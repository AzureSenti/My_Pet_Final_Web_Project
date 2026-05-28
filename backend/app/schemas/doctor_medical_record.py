"""
Pydantic schemas cho Doctor — Bệnh án (Medical Records).
"""
import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# ─────────────────────── Sub-schemas ───────────────────────

class MedicalRecordPetBrief(BaseModel):
    """Thông tin pet gắn với bệnh án."""
    id: uuid.UUID
    name: str
    species: str
    breed: Optional[str] = None

    model_config = {"from_attributes": True}


class MedicalRecordAppointmentBrief(BaseModel):
    """Thông tin lịch hẹn gắn với bệnh án."""
    id: uuid.UUID
    scheduled_at: datetime
    notes: Optional[str] = None

    model_config = {"from_attributes": True}


# ─────────────────────── Request schemas ───────────────────────

class MedicalRecordCreate(BaseModel):
    """Tạo bệnh án mới (bác sĩ ghi sau khi khám xong)."""
    appointment_id: uuid.UUID = Field(..., description="ID lịch hẹn đã hoàn thành")
    diagnosis: str = Field(..., min_length=1, description="Chẩn đoán bệnh")
    treatment: str = Field(..., min_length=1, description="Phương pháp điều trị")
    prescription: Optional[str] = Field(None, description="Đơn thuốc")
    notes: Optional[str] = Field(None, description="Ghi chú thêm")


class MedicalRecordUpdate(BaseModel):
    """Cập nhật bệnh án."""
    diagnosis: Optional[str] = None
    treatment: Optional[str] = None
    prescription: Optional[str] = None
    notes: Optional[str] = None


# ─────────────────────── Response schemas ───────────────────────

class MedicalRecordResponse(BaseModel):
    """Chi tiết một bệnh án."""
    id: uuid.UUID
    diagnosis: str
    treatment: str
    prescription: Optional[str] = None
    notes: Optional[str] = None
    recorded_at: datetime
    pet: MedicalRecordPetBrief
    appointment: MedicalRecordAppointmentBrief

    model_config = {"from_attributes": True}


class MedicalRecordListResponse(BaseModel):
    """Danh sách bệnh án (lịch sử pet)."""
    items: List[MedicalRecordResponse]
    total: int
    pet: MedicalRecordPetBrief
