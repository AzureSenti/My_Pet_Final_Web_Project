import uuid
import enum
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.session import Base


class AppointmentStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    completed = "completed"


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    pet_id = Column(
        UUID(as_uuid=True), ForeignKey("pets.id"), nullable=False
    )
    vet_id = Column(
        UUID(as_uuid=True), ForeignKey("veterinarians.id"), nullable=False
    )
    service_id = Column(
        UUID(as_uuid=True), ForeignKey("services.id"), nullable=False
    )
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    status = Column(
        Enum(AppointmentStatus, name="appointment_status", create_type=False),
        default=AppointmentStatus.pending,
        nullable=False,
    )
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    # Relationships
    owner = relationship("User", foreign_keys=[owner_id], backref="appointments_as_owner")
    pet = relationship("Pet", backref="appointments")
    vet = relationship("Veterinarian", backref="appointments")
    service = relationship("Service", backref="appointments")
    medical_record = relationship(
        "MedicalRecord", back_populates="appointment", uselist=False
    )

    def __repr__(self) -> str:
        return f"<Appointment id={self.id} status={self.status}>"
