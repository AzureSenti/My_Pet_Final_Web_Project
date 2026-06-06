
import asyncio
import uuid
from decimal import Decimal
from datetime import datetime, timedelta
from app.db.session import AsyncSessionLocal
from app.models import User, UserRole, Pet, Service, Appointment, AppointmentStatus, Payment, PaymentStatus, PaymentMethod, Veterinarian
from app.models.pet import PetGender
from app.core.security import hash_password
from sqlalchemy import select

async def seed_data():
    async with AsyncSessionLocal() as db:
        print("正在 tạo dữ liệu mẫu...")
        
        # 1. Tạo Owner mẫu
        owner_email = "test.owner@example.com"
        res = await db.execute(select(User).where(User.email == owner_email))
        owner = res.scalar_one_or_none()
        if not owner:
            owner = User(
                full_name="Nguyễn Văn Khách",
                email=owner_email,
                password_hash=hash_password("password123"),
                phone="0123456789",
                role=UserRole.owner,
                is_active=True
            )
            db.add(owner)
            await db.flush()
            print(f"- Đã tạo Owner: {owner.full_name}")
        
        # 2. Tạo Service mẫu
        service_name = "Khám tổng quát & Spa"
        res = await db.execute(select(Service).where(Service.name == service_name))
        service = res.scalar_one_or_none()
        if not service:
            service = Service(
                name=service_name,
                description="Dịch vụ khám sức khỏe định kỳ và làm đẹp cho thú cưng",
                price=Decimal("350000"),
                duration_minutes=60,
                is_active=True
            )
            db.add(service)
            await db.flush()
            print(f"- Đã tạo Service: {service.name}")
        
        # 3. Tạo Pet mẫu
        pet_name = "LuLu"
        res = await db.execute(select(Pet).where(Pet.name == pet_name, Pet.owner_id == owner.id))
        pet = res.scalar_one_or_none()
        if not pet:
            pet = Pet(
                owner_id=owner.id,
                name=pet_name,
                species="Dog",
                breed="Poodle",
                date_of_birth=datetime.now().date() - timedelta(days=365*2), # 2 tuổi
                gender=PetGender.male
            )
            db.add(pet)
            await db.flush()
            print(f"- Đã tạo Pet: {pet.name}")

        # 4. Tìm một Bác sĩ để gán lịch hẹn
        res = await db.execute(select(Veterinarian).limit(1))
        vet = res.scalar_one_or_none()
        if not vet:
            print("⚠️ Cảnh báo: Cần tạo bác sĩ trước khi tạo lịch hẹn. Hãy chạy seed_test_vet.py trước.")
            return

        # 5. Tạo 3 Lịch hẹn + 3 Hóa đơn với các trạng thái khác nhau
        data_sets = [
            {"status": AppointmentStatus.completed, "pay_status": PaymentStatus.paid, "amount": service.price},
            {"status": AppointmentStatus.completed, "pay_status": PaymentStatus.pending, "amount": service.price},
            {"status": AppointmentStatus.confirmed, "pay_status": None, "amount": service.price},
        ]

        for i, item in enumerate(data_sets):
            # Tạo Appointment
            appt = Appointment(
                owner_id=owner.id,
                pet_id=pet.id,
                vet_id=vet.id,
                service_id=service.id,
                scheduled_at=datetime.utcnow() - timedelta(days=i),
                status=item["status"],
                notes=f"Ghi chú mẫu cho lịch hẹn {i+1}"
            )
            db.add(appt)
            await db.flush()

            # Nếu trạng thái là hoàn thành thì tạo Payment
            if item["pay_status"]:
                payment = Payment(
                    appointment_id=appt.id,
                    owner_id=owner.id,
                    amount=item["amount"],
                    method=PaymentMethod.cash,
                    status=item["pay_status"],
                    paid_at=datetime.utcnow() if item["pay_status"] == PaymentStatus.paid else None
                )
                db.add(payment)
                print(f"- Đã tạo Hóa đơn mẫu {i+1} cho lịch hẹn {appt.id}")

        await db.commit()
        print("✅ Đã đổ dữ liệu mẫu thành công!")

if __name__ == "__main__":
    asyncio.run(seed_data())
