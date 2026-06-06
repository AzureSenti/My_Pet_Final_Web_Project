import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.notification import NotificationListResponse, NotificationResponse, UnreadCountResponse
from app.services import notification_service

router = APIRouter(prefix="/notification", tags=["Notification"])

@router.get("", response_model=NotificationListResponse)
async def get_notifications(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Lấy danh sách thông báo của user hiện tại"""
    return await notification_service.get_user_notifications(db, current_user, page, limit)

@router.get("/unread-count", response_model=UnreadCountResponse)
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Lấy số lượng thông báo chưa đọc"""
    count = await notification_service.get_unread_count(db, current_user)
    return {"unread_count": count}

@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_as_read(
    notification_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Đánh dấu một thông báo là đã đọc"""
    return await notification_service.mark_as_read(db, current_user, notification_id)
