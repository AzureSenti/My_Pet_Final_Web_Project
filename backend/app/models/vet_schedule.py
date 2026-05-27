import uuid

from sqlalchemy import Boolean, Column, SmallInteger, Time, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.session import Base


class VetSchedule(Base):
    __tablename__ = "vet_schedules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vet_id = Column(
        UUID(as_uuid=True),
        ForeignKey("veterinarians.id", ondelete="CASCADE"),
        nullable=False,
    )
    day_of_week = Column(SmallInteger, nullable=False)  # 0=CN, 1=T2, ..., 6=T7
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    is_available = Column(Boolean, default=True, nullable=False)

    # Relationships
    vet = relationship("Veterinarian", backref="schedules")

    def __repr__(self) -> str:
        return f"<VetSchedule vet_id={self.vet_id} day={self.day_of_week}>"
