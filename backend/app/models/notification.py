import uuid
import enum
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Text, Enum as sqlalchemy_Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.session import Base


class NotificationType(str, enum.Enum):
    SYSTEM = "system"
    APPOINTMENT = "appointment"
    MESSAGE = "message"
    PROMOTION = "promotion"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    type = Column(sqlalchemy_Enum(NotificationType, name="notification_type"), default=NotificationType.SYSTEM)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    user = relationship("User", backref="notifications")

    def __repr__(self) -> str:
        return f"<Notification id={self.id} user_id={self.user_id} title={self.title}>"
