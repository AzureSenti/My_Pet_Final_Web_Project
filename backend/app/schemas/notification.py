import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from app.models.notification import NotificationType

class NotificationCreate(BaseModel):
    user_id: uuid.UUID
    title: str
    content: str
    type: NotificationType = NotificationType.SYSTEM

class NotificationResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    content: str
    type: NotificationType
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class NotificationListResponse(BaseModel):
    items: List[NotificationResponse]
    total: int
    page: int
    limit: int
    pages: int

class UnreadCountResponse(BaseModel):
    unread_count: int
