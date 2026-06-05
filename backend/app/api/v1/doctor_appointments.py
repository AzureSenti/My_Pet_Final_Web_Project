"""
API routes — Doctor: Quản lý lịch hẹn.
"""
import uuid
from typing import Optional, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.dependencies import get_current_user, vet_or_admin
from app.models.user import User
from app.models.appointment import AppointmentStatus
from app.schemas.doctor_appointment import (
    DoctorAppointmentResponse,
    DoctorAppointmentListResponse,
    AppointmentStatusUpdate,
)
from app.services import doctor_appointment_service

router = APIRouter(prefix="/doctor/appointments", tags=["Doctor - Appointments"])


@router.get(
    "",
    response_model=DoctorAppointmentListResponse,
    summary="Danh sách lịch hẹn của bác sĩ",
)
async def list_my_appointments(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[AppointmentStatus] = Query(None, description="Filter theo trạng thái"),
    current_user: User = Depends(vet_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Lấy danh sách tất cả lịch hẹn của bác sĩ đang đăng nhập.
    Hỗ trợ phân trang và filter theo trạng thái."""
    return await doctor_appointment_service.get_my_appointments(
        db, current_user, page, limit, status
    )


@router.get(
    "/upcoming",
    response_model=List[DoctorAppointmentResponse],
    summary="Lịch hẹn sắp tới",
)
async def upcoming_appointments(
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(vet_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Lấy các lịch hẹn sắp tới (pending + confirmed, chưa qua ngày)."""
    return await doctor_appointment_service.get_upcoming_appointments(
        db, current_user, limit
    )


@router.get(
    "/today",
    response_model=List[DoctorAppointmentResponse],
    summary="Lịch hẹn hôm nay",
)
async def today_appointments(
    current_user: User = Depends(vet_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Lấy tất cả lịch hẹn trong ngày hôm nay."""
    return await doctor_appointment_service.get_today_appointments(db, current_user)


@router.get(
    "/{appointment_id}",
    response_model=DoctorAppointmentResponse,
    summary="Chi tiết lịch hẹn",
)
async def appointment_detail(
    appointment_id: uuid.UUID,
    current_user: User = Depends(vet_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Xem chi tiết 1 lịch hẹn cụ thể."""
    return await doctor_appointment_service.get_appointment_detail(
        db, current_user, appointment_id
    )


@router.patch(
    "/{appointment_id}/status",
    response_model=DoctorAppointmentResponse,
    summary="Cập nhật trạng thái lịch hẹn",
)
async def update_status(
    appointment_id: uuid.UUID,
    data: AppointmentStatusUpdate,
    current_user: User = Depends(vet_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Cập nhật trạng thái lịch hẹn.
    
    Luồng hợp lệ:
    - pending → confirmed | cancelled
    - confirmed → completed | cancelled
    """
    return await doctor_appointment_service.update_appointment_status(
        db, current_user, appointment_id, data
    )
