import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class MedicalRecordCreateRequest(BaseModel):
    appointment_id: uuid.UUID
    pet_id: uuid.UUID
    vet_id: uuid.UUID
    diagnosis: str
    treatment: str
    prescription: Optional[str] = None
    notes: Optional[str] = None


# Nested schema cho thông tin bác sĩ
class MedicalRecordVetUserInfo(BaseModel):
    id: uuid.UUID
    full_name: str

    class Config:
        from_attributes = True

class MedicalRecordVetInfo(BaseModel):
    id: uuid.UUID
    specialization: str
    user: Optional[MedicalRecordVetUserInfo] = None

    class Config:
        from_attributes = True


class MedicalRecordResponse(BaseModel):
    id: uuid.UUID
    appointment_id: uuid.UUID
    pet_id: uuid.UUID
    vet_id: uuid.UUID
    diagnosis: str
    treatment: str
    prescription: Optional[str]
    notes: Optional[str]
    recorded_at: datetime
    vet: Optional[MedicalRecordVetInfo] = None

    class Config:
        from_attributes = True


class MedicalRecordListResponse(BaseModel):
    items: List[MedicalRecordResponse]
    total: int
