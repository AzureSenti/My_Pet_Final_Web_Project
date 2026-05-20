from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, UserRole
from app.models.pet import Pet
from app.models.veterinarian import Veterinarian

async def get_dashboard_stats(db: AsyncSession):
    # Đếm tổng số lượng
    count_users = await db.scalar(select(func.count()).select_from(User))
    count_vets = await db.scalar(select(func.count()).select_from(Veterinarian))
    count_pets = await db.scalar(select(func.count()).select_from(Pet))
    
    # Đếm theo vai trò
    count_owners = await db.scalar(
        select(func.count()).select_from(User).where(User.role == UserRole.owner)
    )
    
    return {
        "total_users": count_users or 0,
        "total_vets": count_vets or 0,
        "total_pets": count_pets or 0,
        "total_owners": count_owners or 0,
        "recent_stats": [
            {"label": "Người dùng", "value": count_users or 0},
            {"label": "Thú cưng", "value": count_pets or 0},
            {"label": "Bác sĩ", "value": count_vets or 0},
        ]
    }
