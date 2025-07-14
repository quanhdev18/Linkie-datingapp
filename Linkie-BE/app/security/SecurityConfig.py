from pydantic import EmailStr
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "FastAPI Auth OTP"

    # JWT config
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_HOURS: int = 5

    # Database
    DATABASE_URL: str

    # Email settings
    MAIL_USERNAME: EmailStr
    MAIL_PASSWORD: str
    MAIL_FROM: EmailStr
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_FROM_NAME: Optional[str] = "Linkie"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8"
    }

# Dùng như Singleton
settings = Settings()