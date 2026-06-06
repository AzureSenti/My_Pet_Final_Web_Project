"""
API routes — Doctor: Bệnh án (Medical Records).
"""
import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.dependencies import vet_or_admin
from app.models.user import User
from app.schemas.doctor_medical_record import (
    MedicalRecordCreate,
    MedicalRecordUpdate,
    MedicalRecordResponse,
    MedicalRecordListResponse,
)
from app.services import doctor_medical_record_service

router = APIRouter(prefix="/doctor", tags=["Doctor - Medical Records"])


@router.post(
    "/medical-records",
    response_model=MedicalRecordResponse,
    status_code=201,
    summary="Tạo bệnh án mới",
)
async def create_medical_record(
    data: MedicalRecordCreate,
    current_user: User = Depends(vet_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Tạo bệnh án sau khi khám xong.
    Tự động chuyển trạng thái lịch hẹn sang 'completed'."""
    return await doctor_medical_record_service.create_medical_record(
        db, current_user, data
    )


@router.get(
    "/medical-records/{record_id}",
    response_model=MedicalRecordResponse,
    summary="Chi tiết bệnh án",
)
async def get_medical_record(
    record_id: uuid.UUID,
    current_user: User = Depends(vet_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Xem chi tiết 1 bệnh án."""
    return await doctor_medical_record_service.get_medical_record_detail(
        db, current_user, record_id
    )


@router.put(
    "/medical-records/{record_id}",
    response_model=MedicalRecordResponse,
    summary="Cập nhật bệnh án",
)
async def update_medical_record(
    record_id: uuid.UUID,
    data: MedicalRecordUpdate,
    current_user: User = Depends(vet_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Cập nhật nội dung bệnh án (chẩn đoán, điều trị, đơn thuốc, ghi chú)."""
    return await doctor_medical_record_service.update_medical_record(
        db, current_user, record_id, data
    )


@router.get(
    "/pets/{pet_id}/medical-history",
    response_model=MedicalRecordListResponse,
    summary="Lịch sử bệnh án của thú cưng",
)
async def get_pet_history(
    pet_id: uuid.UUID,
    current_user: User = Depends(vet_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Xem toàn bộ lịch sử bệnh án của 1 thú cưng.
    Bao gồm cả bệnh án từ bác sĩ khác để hỗ trợ chẩn đoán."""
    return await doctor_medical_record_service.get_pet_medical_history(
        db, current_user, pet_id
    )
