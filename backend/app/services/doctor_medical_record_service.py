"""
Service layer — Doctor: Bệnh án (Medical Records).
"""
import uuid

from fastapi import HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment, AppointmentStatus
from app.models.medical_record import MedicalRecord
from app.models.pet import Pet
from app.models.veterinarian import Veterinarian
from app.models.user import User
from app.schemas.doctor_medical_record import (
    MedicalRecordCreate,
    MedicalRecordUpdate,
    MedicalRecordResponse,
    MedicalRecordListResponse,
)


# ─────────────── Helper ───────────────

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


# ─────────────── Tạo bệnh án ───────────────

async def create_medical_record(
    db: AsyncSession,
    user: User,
    data: MedicalRecordCreate,
) -> MedicalRecordResponse:
    vet_id = await _get_vet_id(db, user)

    # 1. Kiểm tra appointment tồn tại & thuộc về bác sĩ này
    result = await db.execute(
        select(Appointment).where(
            Appointment.id == data.appointment_id,
            Appointment.vet_id == vet_id,
        )
    )
    appt = result.scalar_one_or_none()
    if not appt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy lịch hẹn này hoặc bạn không có quyền.",
        )

    # 2. Kiểm tra chưa có bệnh án
    existing = await db.scalar(
        select(func.count())
        .select_from(MedicalRecord)
        .where(MedicalRecord.appointment_id == data.appointment_id)
    )
    if existing and existing > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Lịch hẹn này đã có bệnh án.",
        )

    # 3. Chỉ cho phép tạo khi status là confirmed hoặc completed
    if appt.status not in (AppointmentStatus.confirmed, AppointmentStatus.completed):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Không thể tạo bệnh án cho lịch hẹn có trạng thái '{appt.status.value}'. "
                   f"Lịch hẹn phải ở trạng thái 'confirmed' hoặc 'completed'.",
        )

    # 4. Tự động chuyển status → completed
    appt.status = AppointmentStatus.completed

    # 5. Tạo bệnh án
    record = MedicalRecord(
        appointment_id=data.appointment_id,
        pet_id=appt.pet_id,
        vet_id=vet_id,
        diagnosis=data.diagnosis,
        treatment=data.treatment,
        prescription=data.prescription,
        notes=data.notes,
    )
    db.add(record)
    await db.commit()

    # 6. Reload kèm relationships
    return await get_medical_record_detail(db, user, record.id)


# ─────────────── Chi tiết bệnh án ───────────────

async def get_medical_record_detail(
    db: AsyncSession,
    user: User,
    record_id: uuid.UUID,
) -> MedicalRecordResponse:
    vet_id = await _get_vet_id(db, user)

    result = await db.execute(
        select(MedicalRecord)
        .where(MedicalRecord.id == record_id, MedicalRecord.vet_id == vet_id)
        .options(
            joinedload(MedicalRecord.pet),
            joinedload(MedicalRecord.appointment),
        )
    )
    record = result.scalars().unique().one_or_none()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy bệnh án này.",
        )
    return MedicalRecordResponse.model_validate(record)


# ─────────────── Cập nhật bệnh án ───────────────

async def update_medical_record(
    db: AsyncSession,
    user: User,
    record_id: uuid.UUID,
    data: MedicalRecordUpdate,
) -> MedicalRecordResponse:
    vet_id = await _get_vet_id(db, user)

    result = await db.execute(
        select(MedicalRecord).where(
            MedicalRecord.id == record_id,
            MedicalRecord.vet_id == vet_id,
        )
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy bệnh án này.",
        )

    if data.diagnosis is not None:
        record.diagnosis = data.diagnosis
    if data.treatment is not None:
        record.treatment = data.treatment
    if data.prescription is not None:
        record.prescription = data.prescription
    if data.notes is not None:
        record.notes = data.notes

    await db.commit()
    return await get_medical_record_detail(db, user, record_id)


# ─────────────── Lịch sử bệnh án của 1 pet ───────────────

async def get_pet_medical_history(
    db: AsyncSession,
    user: User,
    pet_id: uuid.UUID,
) -> MedicalRecordListResponse:
    vet_id = await _get_vet_id(db, user)

    # Kiểm tra pet tồn tại
    pet = await db.get(Pet, pet_id)
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy thú cưng.",
        )

    # Lấy tất cả bệnh án của pet (không chỉ của bác sĩ hiện tại — 
    # bác sĩ cần xem toàn bộ lịch sử để chẩn đoán chính xác)
    result = await db.execute(
        select(MedicalRecord)
        .where(MedicalRecord.pet_id == pet_id)
        .options(
            joinedload(MedicalRecord.pet),
            joinedload(MedicalRecord.appointment),
        )
        .order_by(MedicalRecord.recorded_at.desc())
    )
    records = result.scalars().unique().all()

    total = len(records)
    return MedicalRecordListResponse(
        items=[MedicalRecordResponse.model_validate(r) for r in records],
        total=total,
        pet=pet,
    )
