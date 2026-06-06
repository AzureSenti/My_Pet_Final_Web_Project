import uuid
import enum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Numeric, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.session import Base


class PaymentMethod(str, enum.Enum):
    cash = "cash"
    card = "card"
    online = "online"


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    refunded = "refunded"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    appointment_id = Column(
        UUID(as_uuid=True),
        ForeignKey("appointments.id", ondelete="RESTRICT"),
        unique=True,
        nullable=False,
    )
    owner_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    amount = Column(Numeric(10, 2), nullable=False)
    method = Column(
        Enum(PaymentMethod, name="payment_method", create_type=False),
        nullable=False,
    )
    status = Column(
        Enum(PaymentStatus, name="payment_status", create_type=False),
        default=PaymentStatus.pending,
        nullable=False,
    )
    transaction_id = Column(String(255))
    paid_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    appointment = relationship("Appointment", backref="payment")
    owner = relationship("User", backref="payments")

    def __repr__(self) -> str:
        return f"<Payment id={self.id} status={self.status}>"
