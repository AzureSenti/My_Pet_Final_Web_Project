
import asyncio
import sqlalchemy as sa
from app.db.session import engine, Base
# Import tất cả các model để SQLAlchemy metadata nhận diện đầy đủ các bảng
import app.models 

async def init_db():
    print("正在 kiểm tra và cập nhật cấu trúc database cho tất cả tính năng...")
    async with engine.begin() as conn:
        # Danh sách các bảng cần làm mới nếu có thay đổi cấu trúc (môi trường dev)
        # Nếu muốn xóa sạch để tạo lại từ đầu, bạn có thể uncomment dòng dưới
        # await conn.run_sync(Base.metadata.drop_all)
        
        # Chỉ xóa các bảng hay bị thay đổi cấu trúc khi dev
        tables_to_refresh = ["payments", "notifications"]
        for table in tables_to_refresh:
            await conn.execute(sa.text(f"DROP TABLE IF EXISTS {table} CASCADE"))
            
        # Tạo tất cả các bảng chưa tồn tại (bao gồm cả các bảng Conversations/Messages mới)
        await conn.run_sync(Base.metadata.create_all)
        
    print("✅ Đã đồng bộ hóa toàn bộ Database thành công (bao gồm Thanh toán, Thông báo và Tin nhắn)!")

if __name__ == "__main__":
    asyncio.run(init_db())
