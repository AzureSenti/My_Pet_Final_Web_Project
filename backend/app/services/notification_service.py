import math
import uuid
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import NotificationCreate

async def create_notification(db: AsyncSession, data: NotificationCreate) -> Notification:
    notif = Notification(
        user_id=data.user_id,
        title=data.title,
        content=data.content,
        type=data.type
    )
    db.add(notif)
    await db.commit()
    await db.refresh(notif)
    return notif

async def get_user_notifications(db: AsyncSession, current_user: User, page: int = 1, limit: int = 20):
    # Total count
    query_count = select(func.count(Notification.id)).where(Notification.user_id == current_user.id)
    result_count = await db.execute(query_count)
    total = result_count.scalar() or 0

    # Get items
    offset = (page - 1) * limit
    query = (
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    result = await db.execute(query)
    items = result.scalars().all()

    pages = math.ceil(total / limit) if limit > 0 else 0

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages
    }

async def mark_as_read(db: AsyncSession, current_user: User, notification_id: uuid.UUID):
    query = select(Notification).where(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    )
    result = await db.execute(query)
    notif = result.scalar_one_or_none()
    
    if not notif:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Thông báo không tồn tại hoặc không thuộc về bạn."
        )

    notif.is_read = True
    await db.commit()
    await db.refresh(notif)
    return notif

async def get_unread_count(db: AsyncSession, current_user: User) -> int:
    query = select(func.count(Notification.id)).where(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    )
    result = await db.execute(query)
    return result.scalar() or 0
