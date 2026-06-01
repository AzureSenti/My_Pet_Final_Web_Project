import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.session import Base


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    appointment_id = Column(
        UUID(as_uuid=True),
        ForeignKey("appointments.id", ondelete="RESTRICT"),
        unique=True,
        nullable=False,
    )
    pet_id = Column(
        UUID(as_uuid=True), ForeignKey("pets.id"), nullable=False
    )
    vet_id = Column(
        UUID(as_uuid=True), ForeignKey("veterinarians.id"), nullable=False
    )
    diagnosis = Column(Text, nullable=False)
    treatment = Column(Text, nullable=False)
    prescription = Column(Text)
    notes = Column(Text)
    recorded_at = Column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    # Relationships
    appointment = relationship("Appointment", back_populates="medical_record")
    pet = relationship("Pet", backref="medical_records")
    vet = relationship("Veterinarian", backref="medical_records")

    def __repr__(self) -> str:
        return f"<MedicalRecord id={self.id} pet_id={self.pet_id}>"
