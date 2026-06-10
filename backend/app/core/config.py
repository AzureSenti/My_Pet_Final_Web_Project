from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8",extra="ignore")

    # App
    APP_ENV: str = "development"
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Database
    POSTGRES_USER: str = "mypet_user"
    POSTGRES_PASSWORD: str = "mypet_password"
    POSTGRES_DB: str = "mypet_db"
    POSTGRES_HOST: str = "127.0.0.1"
    POSTGRES_PORT: int = 5432

    # CORS
    FRONTEND_URL: str = "http://localhost:8000"

    # VNPay Configuration
    VNPAY_TMN_CODE: str = ""
    VNPAY_HASH_SECRET: str = ""
    VNPAY_PAYMENT_URL: str = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
    VNPAY_RETURN_URL: str = "https://petcare-mypet.netlify.app/"
    
    @property
    def DATABASE_URL(self) -> str:
        from urllib.parse import quote_plus
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{quote_plus(self.POSTGRES_PASSWORD)}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}?prepared_statement_cache_size=0"
        )

    @property
    def DATABASE_URL_SYNC(self) -> str:
        """Dùng cho alembic migrations (sync driver)"""
        from urllib.parse import quote_plus
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{quote_plus(self.POSTGRES_PASSWORD)}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

import os
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "app" / "uploads"

settings = Settings()
