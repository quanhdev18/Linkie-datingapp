import jwt
from datetime import datetime, timedelta
from typing import Optional

from app.security.SecurityConfig import settings


class JwtService:
    def __init__(self):
        self.secret = settings.JWT_SECRET_KEY
        self.algorithm = settings.JWT_ALGORITHM
        self.access_token_expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
        self.refresh_token_expire_hours = settings.REFRESH_TOKEN_EXPIRE_HOURS

    def create_access_token(self, subject: str) -> str:
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        payload = {
            "sub": subject,
            "exp": expire,
            "type": "access"
        }
        return jwt.encode(payload, self.secret, algorithm=self.algorithm)

    def create_refresh_token(self, subject: str) -> str:
        expire = datetime.utcnow() + timedelta(hours=self.refresh_token_expire_hours)
        payload = {
            "sub": subject,
            "exp": expire,
            "type": "refresh"
        }
        return jwt.encode(payload, self.secret, algorithm=self.algorithm)

    def extract_username(self, token: str) -> Optional[str]:
        try:
            payload = jwt.decode(token, self.secret, algorithms=[self.algorithm])
            return payload.get("sub")
        except jwt.PyJWTError:
            return None

    def is_token_expired(self, token: str) -> bool:
        try:
            payload = jwt.decode(token, self.secret, algorithms=[self.algorithm])
            return datetime.utcfromtimestamp(payload["exp"]) < datetime.utcnow()
        except jwt.ExpiredSignatureError:
            return True
        except jwt.PyJWTError:
            return True

    def is_token_valid(self, token: str, subject: str) -> bool:
        email = self.extract_username(token)
        return email == subject and not self.is_token_expired(token)
