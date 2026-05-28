"""
Pydantic schemas cho Doctor — Quản lý lịch hẹn.
"""
import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.appointment import AppointmentStatus


# ─────────────────────── Sub-schemas (nested) ───────────────────────

class OwnerBrief(BaseModel):
    """Thông tin tóm tắt của chủ thú cưng."""
    id: uuid.UUID
    full_name: str
    email: str
    phone: Optional[str] = None

    model_config = {"from_attributes": True}


class PetBrief(BaseModel):
    """Thông tin tóm tắt của thú cưng."""
    id: uuid.UUID
    name: str
    species: str
    breed: Optional[str] = None
    gender: str
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}


class ServiceBrief(BaseModel):
    """Thông tin dịch vụ."""
    id: uuid.UUID
    name: str
    price: float
    duration_minutes: int

    model_config = {"from_attributes": True}


# ─────────────────────── Response schemas ───────────────────────

class DoctorAppointmentResponse(BaseModel):
    """Chi tiết một lịch hẹn (góc nhìn bác sĩ)."""
    id: uuid.UUID
    scheduled_at: datetime
    status: AppointmentStatus
    notes: Optional[str] = None
    created_at: datetime
    owner: OwnerBrief
    pet: PetBrief
    service: ServiceBrief
    has_medical_record: bool = False

    model_config = {"from_attributes": True}


class DoctorAppointmentListResponse(BaseModel):
    """Danh sách lịch hẹn phân trang."""
    items: List[DoctorAppointmentResponse]
    total: int
    page: int
    limit: int
    pages: int


# ─────────────────────── Request schemas ───────────────────────

class AppointmentStatusUpdate(BaseModel):
    """Cập nhật trạng thái lịch hẹn."""
    status: AppointmentStatus = Field(
        ..., description="Trạng thái mới: confirmed | cancelled | completed"
    )
