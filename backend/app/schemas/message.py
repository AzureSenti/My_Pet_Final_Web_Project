"""
Pydantic schemas cho hệ thống nhắn tin.
"""
import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.conversation import MessageType


# ─────────────────────── Sub-schemas ───────────────────────

class ParticipantBrief(BaseModel):
    """Thông tin tóm tắt user trong cuộc trò chuyện."""
    id: uuid.UUID
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str

    model_config = {"from_attributes": True}


class AttachmentResponse(BaseModel):
    """Thông tin file đính kèm."""
    id: uuid.UUID
    file_url: str
    file_name: str
    file_type: str
    file_size: int

    model_config = {"from_attributes": True}


class SenderBrief(BaseModel):
    """Thông tin người gửi trong tin nhắn."""
    id: uuid.UUID
    full_name: str
    role: str

    model_config = {"from_attributes": True}


# ─────────────────────── Message ───────────────────────

class MessageResponse(BaseModel):
    """Chi tiết một tin nhắn."""
    id: uuid.UUID
    conversation_id: uuid.UUID
    sender: Optional[SenderBrief] = None
    content: Optional[str] = None
    message_type: MessageType
    attachments: List[AttachmentResponse] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class MessageListResponse(BaseModel):
    """Danh sách tin nhắn phân trang."""
    items: List[MessageResponse]
    total: int
    page: int
    limit: int
    pages: int


class MessageSendRequest(BaseModel):
    """Gửi tin nhắn text."""
    content: str = Field(..., min_length=1, max_length=5000)


# ─────────────────────── Conversation ───────────────────────

class LastMessagePreview(BaseModel):
    """Preview tin nhắn cuối trong danh sách conversation."""
    id: uuid.UUID
    content: Optional[str] = None
    message_type: MessageType
    sender_name: Optional[str] = None
    created_at: datetime


class ConversationResponse(BaseModel):
    """Chi tiết một cuộc trò chuyện."""
    id: uuid.UUID
    participants: List[ParticipantBrief]
    last_message: Optional[LastMessagePreview] = None
    unread_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ConversationListResponse(BaseModel):
    """Danh sách cuộc trò chuyện phân trang."""
    items: List[ConversationResponse]
    total: int
    page: int
    limit: int
    pages: int


class ConversationCreateRequest(BaseModel):
    """Tạo cuộc trò chuyện mới."""
    participant_ids: List[uuid.UUID] = Field(
        ..., min_length=1, description="Danh sách user_id muốn chat"
    )
    initial_message: Optional[str] = Field(
        default=None, max_length=5000,
        description="Tin nhắn đầu tiên (tùy chọn)",
    )


class ConversationDetailResponse(BaseModel):
    """Chi tiết cuộc trò chuyện kèm tin nhắn gần nhất."""
    id: uuid.UUID
    participants: List[ParticipantBrief]
    unread_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UnreadCountResponse(BaseModel):
    """Tổng số tin nhắn chưa đọc."""
    total_unread: int
