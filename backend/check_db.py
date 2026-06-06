
import asyncio
from app.db.session import engine, Base
from app.models import User, Pet, Appointment, Payment, Service, Veterinarian # Import các model để metadata nhận diện

async def init_db():
    print("正在 kiểm tra và cập nhật cấu trúc database...")
    async with engine.begin() as conn:
        # Xóa bảng cũ để tạo lại với cấu trúc mới nhất
        await conn.execute(sa.text("DROP TABLE IF EXISTS payments CASCADE"))
        await conn.execute(sa.text("DROP TABLE IF EXISTS notifications CASCADE"))
        
        # Tạo lại các bảng
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Đã đồng bộ hóa bảng Payment và Notification thành công!")

if __name__ == "__main__":
    import sqlalchemy as sa
    asyncio.run(init_db())
