"""
Service layer — Doctor: Thống kê cá nhân.
"""
import uuid
from datetime import datetime, timezone, timedelta

from fastapi import HTTPException, status
from sqlalchemy import select, func, and_, case, extract
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment, AppointmentStatus
from app.models.medical_record import MedicalRecord
from app.models.payment import Payment, PaymentStatus
from app.models.service import Service
from app.models.veterinarian import Veterinarian
from app.models.user import User
from app.schemas.doctor_stats import (
    DoctorStatsResponse,
    AppointmentStatusCount,
    ServiceStatItem,
)


async def _get_vet_id(db: AsyncSession, user: User) -> uuid.UUID:
    result = await db.execute(
        select(Veterinarian.id).where(Veterinarian.user_id == user.id)
    )
    vet_id = result.scalar_one_or_none()
    if not vet_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy hồ sơ bác sĩ.",
        )
    return vet_id


async def get_doctor_stats(db: AsyncSession, user: User) -> DoctorStatsResponse:
    vet_id = await _get_vet_id(db, user)
    now = datetime.now(timezone.utc)

    # ─── 1. Tổng lịch hẹn ───
    total_appointments = await db.scalar(
        select(func.count())
        .select_from(Appointment)
        .where(Appointment.vet_id == vet_id)
    ) or 0

    # ─── 2. Lịch hẹn theo trạng thái ───
    status_rows = await db.execute(
        select(Appointment.status, func.count())
        .where(Appointment.vet_id == vet_id)
        .group_by(Appointment.status)
    )
    status_map = {row[0].value: row[1] for row in status_rows.all()}
    appointments_by_status = AppointmentStatusCount(
        pending=status_map.get("pending", 0),
        confirmed=status_map.get("confirmed", 0),
        completed=status_map.get("completed", 0),
        cancelled=status_map.get("cancelled", 0),
    )

    # ─── 3. Lịch hẹn tuần này ───
    start_of_week = now - timedelta(days=now.weekday())
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
    appointments_this_week = await db.scalar(
        select(func.count())
        .select_from(Appointment)
        .where(
            Appointment.vet_id == vet_id,
            Appointment.scheduled_at >= start_of_week,
        )
    ) or 0

    # ─── 4. Lịch hẹn tháng này ───
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    appointments_this_month = await db.scalar(
        select(func.count())
        .select_from(Appointment)
        .where(
            Appointment.vet_id == vet_id,
            Appointment.scheduled_at >= start_of_month,
        )
    ) or 0

    # ─── 5. Số pet duy nhất đã khám ───
    total_unique_pets = await db.scalar(
        select(func.count(func.distinct(Appointment.pet_id)))
        .where(
            Appointment.vet_id == vet_id,
            Appointment.status == AppointmentStatus.completed,
        )
    ) or 0

    # ─── 6. Tổng bệnh án ───
    total_medical_records = await db.scalar(
        select(func.count())
        .select_from(MedicalRecord)
        .where(MedicalRecord.vet_id == vet_id)
    ) or 0

    # ─── 7. Doanh thu từ appointments completed ───
    total_revenue = await db.scalar(
        select(func.coalesce(func.sum(Payment.amount), 0))
        .select_from(Payment)
        .join(Appointment, Payment.appointment_id == Appointment.id)
        .where(
            Appointment.vet_id == vet_id,
            Payment.status == PaymentStatus.paid,
        )
    ) or 0

    revenue_this_month = await db.scalar(
        select(func.coalesce(func.sum(Payment.amount), 0))
        .select_from(Payment)
        .join(Appointment, Payment.appointment_id == Appointment.id)
        .where(
            Appointment.vet_id == vet_id,
            Payment.status == PaymentStatus.paid,
            Payment.paid_at >= start_of_month,
        )
    ) or 0

    # ─── 8. Top 5 dịch vụ phổ biến ───
    top_services_rows = await db.execute(
        select(Service.name, func.count().label("cnt"))
        .select_from(Appointment)
        .join(Service, Appointment.service_id == Service.id)
        .where(Appointment.vet_id == vet_id)
        .group_by(Service.name)
        .order_by(func.count().desc())
        .limit(5)
    )
    top_services = [
        ServiceStatItem(service_name=row[0], count=row[1])
        for row in top_services_rows.all()
    ]

    return DoctorStatsResponse(
        total_appointments=total_appointments,
        appointments_by_status=appointments_by_status,
        appointments_this_week=appointments_this_week,
        appointments_this_month=appointments_this_month,
        total_unique_pets=total_unique_pets,
        total_medical_records=total_medical_records,
        total_revenue=float(total_revenue),
        revenue_this_month=float(revenue_this_month),
        top_services=top_services,
    )
