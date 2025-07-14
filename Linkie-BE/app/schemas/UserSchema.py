from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.schemas.LocationDTO import LocationOut
from app.schemas.ProfileDTO import ProfileCreate, ProfileOut

class AccountRegister(BaseModel):
    email: EmailStr

class SendOtpRequest(BaseModel):
    email: EmailStr

class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: int

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    account_id: int
    profile_id: Optional[int] = None

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"

class AccountOut(BaseModel):
    id: int
    email: str
    phone: Optional[str]
    role: UserRole
    is_activated: bool

    class Config:
        from_attributes = True

class AvatarOut(BaseModel):
    id: int
    title: str
    url: str
    alt: str
    upload_date: datetime

    class Config:
        from_attributes = True

class AccountWithAvatarOut(BaseModel):
    id: int
    email: str
    is_activated: bool
    role: UserRole
    avatar: Optional[AvatarOut] = None  # Có thể không có avatar
    latitude: float
    longitude: float
    
    class Config:
        from_attributes = True

class AccountWithProfileOut(BaseModel):
    id: int
    email: str
    is_activated: bool
    role: UserRole
    profile: Optional[ProfileOut] = None

    class Config:
        from_attributes = True

class AccountWithLocationOut(BaseModel):
    id: int
    email: str
    is_activated: bool
    role: UserRole
    location: Optional[LocationOut] = None

    class Config:
        from_attributes = True
