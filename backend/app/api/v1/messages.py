"""
API routes — Hệ thống nhắn tin.
"""
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.message import (
    ConversationCreateRequest,
    ConversationResponse,
    ConversationListResponse,
    ConversationDetailResponse,
    MessageSendRequest,
    MessageResponse,
    MessageListResponse,
    UnreadCountResponse,
)
from app.services import message_service

router = APIRouter(prefix="/messages", tags=["Messages"])


# ─────────────────────── Conversations ───────────────────────

@router.post(
    "/conversations",
    response_model=ConversationResponse,
    status_code=201,
    summary="Tạo cuộc trò chuyện mới",
)
async def create_conversation(
    data: ConversationCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Tạo cuộc trò chuyện mới với 1 hoặc nhiều user.
    Nếu đã tồn tại conversation 1-1 với user đó, trả lại cái cũ."""
    return await message_service.create_conversation(db, current_user, data)


@router.get(
    "/conversations",
    response_model=ConversationListResponse,
    summary="Danh sách cuộc trò chuyện",
)
async def list_conversations(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Lấy danh sách tất cả cuộc trò chuyện của user đang đăng nhập.
    Sắp xếp theo tin nhắn mới nhất."""
    return await message_service.get_conversations(db, current_user, page, limit)


@router.get(
    "/conversations/{conversation_id}",
    response_model=ConversationDetailResponse,
    summary="Chi tiết cuộc trò chuyện",
)
async def conversation_detail(
    conversation_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Xem chi tiết 1 cuộc trò chuyện."""
    return await message_service.get_conversation_detail(
        db, current_user, conversation_id
    )


# ─────────────────────── Messages ───────────────────────

@router.get(
    "/conversations/{conversation_id}/messages",
    response_model=MessageListResponse,
    summary="Lấy tin nhắn trong cuộc trò chuyện",
)
async def list_messages(
    conversation_id: uuid.UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Lấy danh sách tin nhắn trong cuộc trò chuyện (phân trang).
    Tin nhắn được trả về theo thứ tự thời gian (cũ → mới)."""
    return await message_service.get_messages(
        db, current_user, conversation_id, page, limit
    )


@router.post(
    "/conversations/{conversation_id}/messages",
    response_model=MessageResponse,
    status_code=201,
    summary="Gửi tin nhắn text",
)
async def send_message(
    conversation_id: uuid.UUID,
    data: MessageSendRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Gửi tin nhắn text vào cuộc trò chuyện."""
    return await message_service.send_message(
        db, current_user, conversation_id, data
    )


@router.post(
    "/conversations/{conversation_id}/messages/upload",
    response_model=MessageResponse,
    status_code=201,
    summary="Gửi tin nhắn kèm file/hình ảnh",
)
async def send_message_with_file(
    conversation_id: uuid.UUID,
    file: UploadFile = File(..., description="File hoặc hình ảnh đính kèm"),
    content: Optional[str] = Form(default=None, description="Nội dung text kèm theo (tùy chọn)"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Gửi tin nhắn kèm file hoặc hình ảnh.
    
    Loại file được hỗ trợ:
    - Hình ảnh: jpg, png, gif, webp
    - Tài liệu: pdf, doc, docx, xls, xlsx
    
    Giới hạn: 10 MB
    """
    return await message_service.send_message_with_attachment(
        db, current_user, conversation_id, file, content
    )


# ─────────────────────── Read Status ───────────────────────

@router.put(
    "/conversations/{conversation_id}/read",
    summary="Đánh dấu đã đọc",
)
async def mark_conversation_read(
    conversation_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Đánh dấu đã đọc tất cả tin nhắn trong cuộc trò chuyện."""
    return await message_service.mark_as_read(db, current_user, conversation_id)


@router.get(
    "/unread-count",
    response_model=UnreadCountResponse,
    summary="Tổng tin nhắn chưa đọc",
)
async def total_unread(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Đếm tổng số tin nhắn chưa đọc trên tất cả cuộc trò chuyện."""
    return await message_service.get_total_unread(db, current_user)
