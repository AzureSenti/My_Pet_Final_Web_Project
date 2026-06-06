"""
Service layer — Doctor: Quản lý lịch hẹn.
"""
import uuid
import math
from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import select, func, and_
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment, AppointmentStatus
from app.models.veterinarian import Veterinarian
from app.models.user import User
from app.schemas.doctor_appointment import (
    DoctorAppointmentResponse,
    DoctorAppointmentListResponse,
    AppointmentStatusUpdate,
)


# ─────────────── Helper: lấy vet_id từ user ───────────────

async def _get_vet_id(db: AsyncSession, user: User) -> uuid.UUID:
    """Trả về veterinarians.id từ user đang đăng nhập."""
    result = await db.execute(
        select(Veterinarian.id).where(Veterinarian.user_id == user.id)
    )
    vet_id = result.scalar_one_or_none()
    if not vet_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy hồ sơ bác sĩ. Liên hệ admin.",
        )
    return vet_id


# ─────────────── Helper: query cơ bản ───────────────

def _base_query(vet_id: uuid.UUID):
    """Query Appointment của 1 bác sĩ, eager-load owner/pet/service/medical_record."""
    return (
        select(Appointment)
        .where(Appointment.vet_id == vet_id)
        .options(
            joinedload(Appointment.owner),
            joinedload(Appointment.pet),
            joinedload(Appointment.service),
            joinedload(Appointment.medical_record),
        )
    )


def _serialize(appt: Appointment) -> dict:
    """Chuyển Appointment ORM → dict phù hợp DoctorAppointmentResponse."""
    return {
        "id": appt.id,
        "scheduled_at": appt.scheduled_at,
        "status": appt.status,
        "notes": appt.notes,
        "created_at": appt.created_at,
        "owner": appt.owner,
        "pet": appt.pet,
        "service": appt.service,
        "has_medical_record": appt.medical_record is not None,
    }


# ─────────────── Danh sách lịch hẹn (phân trang + filter) ───────────────

async def get_my_appointments(
    db: AsyncSession,
    user: User,
    page: int = 1,
    limit: int = 10,
    status_filter: Optional[AppointmentStatus] = None,
) -> DoctorAppointmentListResponse:
    vet_id = await _get_vet_id(db, user)

    query = _base_query(vet_id)
    count_query = (
        select(func.count()).select_from(Appointment).where(Appointment.vet_id == vet_id)
    )

    if status_filter:
        query = query.where(Appointment.status == status_filter)
        count_query = count_query.where(Appointment.status == status_filter)

    query = query.order_by(Appointment.scheduled_at.desc())

    total = await db.scalar(count_query) or 0
    pages = math.ceil(total / limit) if total > 0 else 1

    result = await db.execute(query.offset((page - 1) * limit).limit(limit))
    items = result.scalars().unique().all()

    return DoctorAppointmentListResponse(
        items=[_serialize(a) for a in items],
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )


# ─────────────── Lịch hẹn sắp tới ───────────────

async def get_upcoming_appointments(
    db: AsyncSession,
    user: User,
    limit: int = 10,
) -> list[DoctorAppointmentResponse]:
    vet_id = await _get_vet_id(db, user)
    now = datetime.now(timezone.utc)

    query = (
        _base_query(vet_id)
        .where(
            Appointment.status.in_([AppointmentStatus.pending, AppointmentStatus.confirmed]),
            Appointment.scheduled_at >= now,
        )
        .order_by(Appointment.scheduled_at.asc())
        .limit(limit)
    )

    result = await db.execute(query)
    items = result.scalars().unique().all()
    return [DoctorAppointmentResponse(**_serialize(a)) for a in items]


# ─────────────── Lịch hẹn hôm nay ───────────────

async def get_today_appointments(
    db: AsyncSession,
    user: User,
) -> list[DoctorAppointmentResponse]:
    vet_id = await _get_vet_id(db, user)
    now = datetime.now(timezone.utc)
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = start_of_day + timedelta(days=1)

    query = (
        _base_query(vet_id)
        .where(
            Appointment.scheduled_at >= start_of_day,
            Appointment.scheduled_at < end_of_day,
        )
        .order_by(Appointment.scheduled_at.asc())
    )

    result = await db.execute(query)
    items = result.scalars().unique().all()
    return [DoctorAppointmentResponse(**_serialize(a)) for a in items]


# ─────────────── Chi tiết 1 lịch hẹn ───────────────

async def get_appointment_detail(
    db: AsyncSession,
    user: User,
    appointment_id: uuid.UUID,
) -> DoctorAppointmentResponse:
    vet_id = await _get_vet_id(db, user)

    query = _base_query(vet_id).where(Appointment.id == appointment_id)
    result = await db.execute(query)
    appt = result.scalars().unique().one_or_none()

    if not appt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy lịch hẹn này hoặc bạn không có quyền truy cập.",
        )
    return DoctorAppointmentResponse(**_serialize(appt))


# ─────────────── Cập nhật trạng thái ───────────────

_VALID_TRANSITIONS = {
    AppointmentStatus.pending: {AppointmentStatus.confirmed, AppointmentStatus.cancelled},
    AppointmentStatus.confirmed: {AppointmentStatus.completed, AppointmentStatus.cancelled},
}


async def update_appointment_status(
    db: AsyncSession,
    user: User,
    appointment_id: uuid.UUID,
    data: AppointmentStatusUpdate,
) -> DoctorAppointmentResponse:
    vet_id = await _get_vet_id(db, user)

    # Load appointment (không eager-load relationships — sẽ reload sau)
    result = await db.execute(
        select(Appointment).where(
            Appointment.id == appointment_id,
            Appointment.vet_id == vet_id,
        )
    )
    appt = result.scalar_one_or_none()

    if not appt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy lịch hẹn này.",
        )

    allowed = _VALID_TRANSITIONS.get(appt.status, set())
    if data.status not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Không thể chuyển từ '{appt.status.value}' sang '{data.status.value}'. "
                   f"Trạng thái hợp lệ: {[s.value for s in allowed]}",
        )

    appt.status = data.status
    
    # --- TỰ ĐỘNG TẠO HÓA ĐƠN KHI HOÀN THÀNH ---
    if data.status == AppointmentStatus.completed:
        # Kiểm tra xem đã có payment chưa để tránh tạo trùng
        from app.models.payment import Payment, PaymentMethod
        from app.services.payment_service import create_payment
        from app.schemas.payment import PaymentCreateRequest

        stmt = select(Payment).where(Payment.appointment_id == appointment_id)
        res_pay = await db.execute(stmt)
        existing_payment = res_pay.scalar_one_or_none()

        if not existing_payment and appt.service:
            payment_data = PaymentCreateRequest(
                appointment_id=appt.id,
                owner_id=appt.owner_id,
                amount=appt.service.price,
                method=PaymentMethod.cash
            )
            await create_payment(db, payment_data)

    await db.commit()

    # Reload đầy đủ relationships
    return await get_appointment_detail(db, user, appointment_id)
