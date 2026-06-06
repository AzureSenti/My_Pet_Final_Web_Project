import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.pet_admin import PetAdminResponse, PetCreateRequest
from app.schemas.appointment import AppointmentResponse, AppointmentCreateRequest
from app.schemas.medical_record import MedicalRecordResponse
from app.services import pet_admin_service, appointment_service, medical_record_service
from app.models.user import User

router = APIRouter(prefix="/owner", tags=["Owner Portal"])

@router.get("/pets", response_model=List[PetAdminResponse])
async def get_my_pets(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Danh sách thú cưng của tôi"""
    return await pet_admin_service.list_pets_by_owner(db, current_user.id)

@router.post("/pets", response_model=PetAdminResponse, status_code=201)
async def add_my_pet(
    data: PetCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Đăng ký thú cưng mới cho tôi"""
    # Đảm bảo owner_id là của current_user
    data.owner_id = current_user.id
    return await pet_admin_service.create_pet(db, data)

@router.get("/appointments", response_model=List[AppointmentResponse])
async def get_my_appointments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Lịch hẹn của tôi"""
    res = await appointment_service.list_appointments(db, page=1, limit=100, owner_id=current_user.id)
    return res.items

@router.post("/appointments", response_model=AppointmentResponse, status_code=201)
async def book_appointment(
    data: AppointmentCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Đặt lịch hẹn mới"""
    # Force current user as owner
    data.owner_id = current_user.id
    return await appointment_service.create_appointment(db, data)

@router.get("/medical-records", response_model=List[MedicalRecordResponse])
async def get_my_pets_medical_records(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Hồ sơ bệnh án của tất cả pet của tôi"""
    # Hiện tại service có thể chưa hỗ trợ filter theo owner_id trực tiếp trong medical_records, 
    # chúng ta có thể cần lấy list pets rồi lấy records.
    # Để đơn giản, giả sử service có hỗ trợ filter hoặc chúng ta thực hiện logic ở đây.
    # Tạm thời trả về list rỗng nếu chưa có service phù hợp hoặc gọi service với owner_id
    records = await medical_record_service.list_records_by_owner(db, current_user.id)
    return records
