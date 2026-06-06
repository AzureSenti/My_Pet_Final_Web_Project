# Export all models here so Alembic can detect them automatically
from app.models.user import User, UserRole
from app.models.refresh_token import RefreshToken
from app.models.pet import Pet
from app.models.veterinarian import Veterinarian
from app.models.service import Service
from app.models.vet_schedule import VetSchedule
from app.models.appointment import Appointment, AppointmentStatus
from app.models.medical_record import MedicalRecord
from app.models.payment import Payment, PaymentMethod, PaymentStatus
from app.models.notification import Notification, NotificationType

__all__ = [
    "User", "UserRole",
    "RefreshToken",
    "Pet",
    "Veterinarian",
    "Service",
    "VetSchedule",
    "Appointment", "AppointmentStatus",
    "MedicalRecord",
    "Payment", "PaymentMethod", "PaymentStatus",
    "Notification", "NotificationType",
]
