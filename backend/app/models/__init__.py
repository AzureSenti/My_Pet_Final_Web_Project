# Export all models here so Alembic can detect them automatically
from app.models.user import User, UserRole
from app.models.refresh_token import RefreshToken
from app.models.pet import Pet
from app.models.veterinarian import Veterinarian

__all__ = ["User", "UserRole", "RefreshToken", "Pet", "Veterinarian"]
