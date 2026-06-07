
import asyncio
from app.db.session import AsyncSessionLocal
from app.models.user import User, UserRole
from app.models.veterinarian import Veterinarian
from sqlalchemy import select

async def fix_missing_vets():
    async with AsyncSessionLocal() as db:
        print("正在 kiểm tra các bác sĩ thiếu hồ sơ...")
        
        # Tìm tất cả user có role là 'vet'
        result = await db.execute(select(User).where(User.role == UserRole.vet))
        vets = result.scalars().all()
        
        count = 0
        for vet in vets:
            # Kiểm tra xem đã có bản ghi trong bảng Veterinarian chưa
            vet_res = await db.execute(select(Veterinarian).where(Veterinarian.user_id == vet.id))
            profile = vet_res.scalar_one_or_none()
            
            if not profile:
                # Nếu chưa có thì tạo mới
                new_profile = Veterinarian(
                    user_id=vet.id,
                    specialization="Chưa cập nhật",
                    bio="Thông tin đang được cập nhật...",
                    is_active=True
                )
                db.add(new_profile)
                count += 1
                print(f"- Đã bổ sung hồ sơ cho bác sĩ: {vet.full_name}")
        
        await db.commit()
        print(f"✅ Hoàn tất! Đã bổ sung hồ sơ cho {count} bác sĩ.")

if __name__ == "__main__":
    asyncio.run(fix_missing_vets())
