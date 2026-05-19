"""
core/security.py
────────────────
Chứa tất cả logic mã hoá:
  - bcrypt: hash / verify password
  - JWT: tạo access_token (15 phút) và refresh_token (7 ngày)
  - JWT: decode và validate token
"""
import uuid
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# ─────────────────────────── BCrypt ───────────────────────────

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Trả về bcrypt hash của plain_password."""
    return _pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """So sánh plain_password với hashed_password. Trả về True nếu khớp."""
    return _pwd_context.verify(plain_password, hashed_password)


# ─────────────────────────── JWT ───────────────────────────

ACCESS_TOKEN_EXPIRE_SECONDS = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
REFRESH_TOKEN_EXPIRE_SECONDS = 7 * 24 * 60 * 60  # 7 ngày


def _create_token(data: dict, expire_delta: timedelta) -> str:
    """Helper nội bộ tạo JWT với exp claim."""
    payload = data.copy()
    now = datetime.now(timezone.utc)
    payload.update({"iat": now, "exp": now + expire_delta})
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_access_token(user_id: uuid.UUID, role: str) -> str:
    """
    Tạo JWT access token.
    Payload: sub=user_id, role=role, type="access"
    Thời hạn: ACCESS_TOKEN_EXPIRE_MINUTES (mặc định 15 phút)
    """
    return _create_token(
        data={"sub": str(user_id), "role": role, "type": "access"},
        expire_delta=timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS),
    )


def create_refresh_token(user_id: uuid.UUID) -> tuple[str, datetime]:
    """
    Tạo JWT refresh token.
    Payload: sub=user_id, jti=random_uuid, type="refresh"
    Thời hạn: 7 ngày.
    Trả về: (token_string, expires_at_datetime)
    """
    jti = str(uuid.uuid4())
    expire = timedelta(seconds=REFRESH_TOKEN_EXPIRE_SECONDS)
    token = _create_token(
        data={"sub": str(user_id), "jti": jti, "type": "refresh"},
        expire_delta=expire,
    )
    expires_at = datetime.now(timezone.utc) + expire
    return token, expires_at


def decode_access_token(token: str) -> dict:
    """
    Decode và validate access token.
    Ném JWTError nếu token không hợp lệ hoặc hết hạn.
    """
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("type") != "access":
        raise JWTError("Sai loại token")
    return payload


def decode_refresh_token(token: str) -> dict:
    """
    Decode và validate refresh token.
    Ném JWTError nếu token không hợp lệ hoặc hết hạn.
    """
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    if payload.get("type") != "refresh":
        raise JWTError("Sai loại token")
    return payload
