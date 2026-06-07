"""
Service layer — Hệ thống nhắn tin.
"""
import uuid
import math
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import select, func, and_, or_, exists
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.conversation import (
    Conversation, ConversationParticipant,
    Message, MessageAttachment, MessageType,
)
from app.schemas.message import (
    ConversationResponse,
    ConversationListResponse,
    ConversationDetailResponse,
    ConversationCreateRequest,
    MessageResponse,
    MessageListResponse,
    MessageSendRequest,
    LastMessagePreview,
    ParticipantBrief,
    SenderBrief,
    AttachmentResponse,
    UnreadCountResponse,
)
from app.core.file_upload import save_upload_file


# ═══════════════════════════════════════════════════════════════
#  Helpers
# ═══════════════════════════════════════════════════════════════

def _participant_brief(user: User) -> ParticipantBrief:
    """Chuyển User ORM → ParticipantBrief."""
    return ParticipantBrief(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        role=user.role.value,
    )


def _sender_brief(user: User | None) -> SenderBrief | None:
    if user is None:
        return None
    return SenderBrief(
        id=user.id,
        full_name=user.full_name,
        role=user.role.value,
    )


def _attachment_response(att: MessageAttachment) -> AttachmentResponse:
    return AttachmentResponse(
        id=att.id,
        file_url=att.file_url,
        file_name=att.file_name,
        file_type=att.file_type,
        file_size=att.file_size,
    )


def _message_response(msg: Message) -> MessageResponse:
    return MessageResponse(
        id=msg.id,
        conversation_id=msg.conversation_id,
        sender=_sender_brief(msg.sender),
        content=msg.content,
        message_type=msg.message_type,
        attachments=[_attachment_response(a) for a in msg.attachments],
        created_at=msg.created_at,
    )


def _last_message_preview(msg: Message | None) -> LastMessagePreview | None:
    if msg is None:
        return None
    return LastMessagePreview(
        id=msg.id,
        content=msg.content,
        message_type=msg.message_type,
        sender_name=msg.sender.full_name if msg.sender else None,
        created_at=msg.created_at,
    )


async def _check_participant(
    db: AsyncSession,
    conversation_id: uuid.UUID,
    user_id: uuid.UUID,
) -> ConversationParticipant:
    """Kiểm tra user có tham gia conversation không. Ném 403 nếu không."""
    result = await db.execute(
        select(ConversationParticipant).where(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id == user_id,
        )
    )
    participant = result.scalar_one_or_none()
    if not participant:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không tham gia cuộc trò chuyện này.",
        )
    return participant


async def _get_unread_count_for_conversation(
    db: AsyncSession,
    conversation_id: uuid.UUID,
    user_id: uuid.UUID,
    last_read_at: datetime | None,
) -> int:
    """Đếm tin nhắn chưa đọc trong 1 conversation cho 1 user."""
    query = (
        select(func.count())
        .select_from(Message)
        .where(
            Message.conversation_id == conversation_id,
            Message.sender_id != user_id,  # Không đếm tin mình gửi
        )
    )
    if last_read_at:
        query = query.where(Message.created_at > last_read_at)

    return await db.scalar(query) or 0


# ═══════════════════════════════════════════════════════════════
#  1. Tạo cuộc trò chuyện
# ═══════════════════════════════════════════════════════════════

async def create_conversation(
    db: AsyncSession,
    user: User,
    data: ConversationCreateRequest,
) -> ConversationResponse:
    """
    Tạo cuộc trò chuyện mới.
    - Nếu 1-1 (chỉ 1 participant_id): kiểm tra đã tồn tại chưa, nếu rồi trả lại cái cũ.
    - Nếu group (>1 participant_id): luôn tạo mới.
    """
    # Không tự chat với mình
    other_ids = [pid for pid in data.participant_ids if pid != user.id]
    if not other_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phải có ít nhất 1 người khác trong cuộc trò chuyện.",
        )

    # Kiểm tra các user tồn tại
    result = await db.execute(
        select(User.id).where(User.id.in_(other_ids))
    )
    existing_ids = set(result.scalars().all())
    missing = set(other_ids) - existing_ids
    if missing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy user: {[str(m) for m in missing]}",
        )

    # 1-1: kiểm tra conversation đã tồn tại chưa
    all_participant_ids = sorted([user.id] + other_ids)
    if len(other_ids) == 1:
        existing_conv = await _find_direct_conversation(db, user.id, other_ids[0])
        if existing_conv:
            return await _build_conversation_response(db, existing_conv, user.id)

    # Tạo conversation mới
    conv = Conversation()
    db.add(conv)
    await db.flush()

    # Thêm participants
    for uid in all_participant_ids:
        participant = ConversationParticipant(
            conversation_id=conv.id,
            user_id=uid,
        )
        db.add(participant)

    # Gửi tin nhắn đầu tiên nếu có
    if data.initial_message:
        msg = Message(
            conversation_id=conv.id,
            sender_id=user.id,
            content=data.initial_message,
            message_type=MessageType.text,
        )
        db.add(msg)

    await db.commit()
    
    # Reload with all relationships
    query = (
        select(Conversation)
        .where(Conversation.id == conv.id)
        .options(
            selectinload(Conversation.participants).selectinload(ConversationParticipant.user)
        )
    )
    result = await db.execute(query)
    conv_fully_loaded = result.scalar_one()

    return await _build_conversation_response(db, conv_fully_loaded, user.id)


async def _find_direct_conversation(
    db: AsyncSession,
    user_id_1: uuid.UUID,
    user_id_2: uuid.UUID,
) -> Conversation | None:
    """Tìm conversation 1-1 giữa 2 user."""
    # Subquery: conversation có đúng 2 participants
    count_subq = (
        select(
            ConversationParticipant.conversation_id,
            func.count().label("cnt"),
        )
        .group_by(ConversationParticipant.conversation_id)
        .having(func.count() == 2)
        .subquery()
    )

    # Conversation chứa cả 2 user
    query = (
        select(Conversation)
        .join(count_subq, Conversation.id == count_subq.c.conversation_id)
        .where(
            exists(
                select(ConversationParticipant.id).where(
                    ConversationParticipant.conversation_id == Conversation.id,
                    ConversationParticipant.user_id == user_id_1,
                )
            ),
            exists(
                select(ConversationParticipant.id).where(
                    ConversationParticipant.conversation_id == Conversation.id,
                    ConversationParticipant.user_id == user_id_2,
                )
            ),
        )
        .options(
            selectinload(Conversation.participants).selectinload(ConversationParticipant.user)
        )
    )
    result = await db.execute(query)
    return result.scalar_one_or_none()


# ═══════════════════════════════════════════════════════════════
#  2. Danh sách cuộc trò chuyện
# ═══════════════════════════════════════════════════════════════

async def get_conversations(
    db: AsyncSession,
    user: User,
    page: int = 1,
    limit: int = 20,
) -> ConversationListResponse:
    """Lấy danh sách conversations của user, sắp xếp theo tin nhắn mới nhất."""

    # Lấy conversation_ids mà user tham gia
    participant_subq = (
        select(ConversationParticipant.conversation_id)
        .where(ConversationParticipant.user_id == user.id)
        .subquery()
    )

    # Đếm total
    count_query = (
        select(func.count())
        .select_from(Conversation)
        .where(Conversation.id.in_(select(participant_subq)))
    )
    total = await db.scalar(count_query) or 0
    pages = math.ceil(total / limit) if total > 0 else 1

    # Lấy conversations, sort theo updated_at
    query = (
        select(Conversation)
        .where(Conversation.id.in_(select(participant_subq)))
        .options(
            selectinload(Conversation.participants).selectinload(ConversationParticipant.user)
        )
        .order_by(Conversation.updated_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
    )
    result = await db.execute(query)
    conversations = result.scalars().unique().all()

    items = []
    for conv in conversations:
        items.append(await _build_conversation_response(db, conv, user.id))

    return ConversationListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )


async def _build_conversation_response(
    db: AsyncSession,
    conv: Conversation,
    current_user_id: uuid.UUID,
) -> ConversationResponse:
    """Build ConversationResponse từ Conversation ORM."""

    participants = [_participant_brief(p.user) for p in conv.participants]

    # Last message
    last_msg_result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conv.id)
        .options(joinedload(Message.sender))
        .order_by(Message.created_at.desc())
        .limit(1)
    )
    last_msg = last_msg_result.scalar_one_or_none()

    # Unread count
    my_participant = next(
        (p for p in conv.participants if p.user_id == current_user_id), None
    )
    unread_count = 0
    if my_participant:
        unread_count = await _get_unread_count_for_conversation(
            db, conv.id, current_user_id, my_participant.last_read_at
        )

    return ConversationResponse(
        id=conv.id,
        participants=participants,
        last_message=_last_message_preview(last_msg),
        unread_count=unread_count,
        created_at=conv.created_at,
        updated_at=conv.updated_at,
    )


# ═══════════════════════════════════════════════════════════════
#  3. Chi tiết cuộc trò chuyện
# ═══════════════════════════════════════════════════════════════

async def get_conversation_detail(
    db: AsyncSession,
    user: User,
    conversation_id: uuid.UUID,
) -> ConversationDetailResponse:
    """Lấy chi tiết 1 conversation (kiểm tra quyền)."""
    await _check_participant(db, conversation_id, user.id)

    result = await db.execute(
        select(Conversation)
        .where(Conversation.id == conversation_id)
        .options(
            selectinload(Conversation.participants).selectinload(ConversationParticipant.user)
        )
    )
    conv = result.scalar_one_or_none()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy cuộc trò chuyện.",
        )

    participants = [_participant_brief(p.user) for p in conv.participants]

    my_participant = next(
        (p for p in conv.participants if p.user_id == user.id), None
    )
    unread_count = 0
    if my_participant:
        unread_count = await _get_unread_count_for_conversation(
            db, conv.id, user.id, my_participant.last_read_at
        )

    return ConversationDetailResponse(
        id=conv.id,
        participants=participants,
        unread_count=unread_count,
        created_at=conv.created_at,
        updated_at=conv.updated_at,
    )


# ═══════════════════════════════════════════════════════════════
#  4. Gửi tin nhắn text
# ═══════════════════════════════════════════════════════════════

async def send_message(
    db: AsyncSession,
    user: User,
    conversation_id: uuid.UUID,
    data: MessageSendRequest,
) -> MessageResponse:
    """Gửi tin nhắn text vào conversation."""
    await _check_participant(db, conversation_id, user.id)

    msg = Message(
        conversation_id=conversation_id,
        sender_id=user.id,
        content=data.content,
        message_type=MessageType.text,
    )
    db.add(msg)

    # Cập nhật updated_at của conversation
    result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    )
    conv = result.scalar_one()
    conv.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(msg)

    return _message_response(msg)


# ═══════════════════════════════════════════════════════════════
#  5. Gửi tin nhắn kèm file
# ═══════════════════════════════════════════════════════════════

async def send_message_with_attachment(
    db: AsyncSession,
    user: User,
    conversation_id: uuid.UUID,
    file: UploadFile,
    content: Optional[str] = None,
) -> MessageResponse:
    """Gửi tin nhắn kèm file/hình ảnh."""
    await _check_participant(db, conversation_id, user.id)

    # Upload file
    file_info = await save_upload_file(file)

    msg = Message(
        conversation_id=conversation_id,
        sender_id=user.id,
        content=content,
        message_type=MessageType(file_info["message_type"]),
    )
    db.add(msg)
    await db.flush()

    # Tạo attachment
    attachment = MessageAttachment(
        message_id=msg.id,
        file_url=file_info["file_url"],
        file_name=file_info["file_name"],
        file_type=file_info["file_type"],
        file_size=file_info["file_size"],
    )
    db.add(attachment)

    # Cập nhật updated_at của conversation
    result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    )
    conv = result.scalar_one()
    conv.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(msg)

    return _message_response(msg)


# ═══════════════════════════════════════════════════════════════
#  6. Lấy tin nhắn trong conversation
# ═══════════════════════════════════════════════════════════════

async def get_messages(
    db: AsyncSession,
    user: User,
    conversation_id: uuid.UUID,
    page: int = 1,
    limit: int = 50,
) -> MessageListResponse:
    """Lấy danh sách tin nhắn trong conversation (phân trang)."""
    await _check_participant(db, conversation_id, user.id)

    # Đếm total
    count_query = (
        select(func.count())
        .select_from(Message)
        .where(Message.conversation_id == conversation_id)
    )
    total = await db.scalar(count_query) or 0
    pages = math.ceil(total / limit) if total > 0 else 1

    # Lấy messages — mới nhất ở cuối (order ASC), phân trang từ cũ → mới
    query = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .options(
            joinedload(Message.sender),
            selectinload(Message.attachments),
        )
        .order_by(Message.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
    )

    result = await db.execute(query)
    messages = result.scalars().unique().all()

    # Đảo lại để trả về theo thứ tự thời gian (cũ → mới)
    messages = list(reversed(messages))

    return MessageListResponse(
        items=[_message_response(m) for m in messages],
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )


# ═══════════════════════════════════════════════════════════════
#  7. Đánh dấu đã đọc
# ═══════════════════════════════════════════════════════════════

async def mark_as_read(
    db: AsyncSession,
    user: User,
    conversation_id: uuid.UUID,
) -> dict:
    """Đánh dấu đã đọc tất cả tin nhắn trong conversation."""
    participant = await _check_participant(db, conversation_id, user.id)
    participant.last_read_at = datetime.now(timezone.utc)
    await db.commit()
    return {"message": "Đã đánh dấu đã đọc"}


# ═══════════════════════════════════════════════════════════════
#  8. Tổng tin nhắn chưa đọc
# ═══════════════════════════════════════════════════════════════

async def get_total_unread(
    db: AsyncSession,
    user: User,
) -> UnreadCountResponse:
    """Đếm tổng tin nhắn chưa đọc của user trên tất cả conversations."""

    # Lấy tất cả conversation mà user tham gia
    result = await db.execute(
        select(ConversationParticipant).where(
            ConversationParticipant.user_id == user.id
        )
    )
    my_participations = result.scalars().all()

    total_unread = 0
    for p in my_participations:
        count = await _get_unread_count_for_conversation(
            db, p.conversation_id, user.id, p.last_read_at
        )
        total_unread += count

    return UnreadCountResponse(total_unread=total_unread)
