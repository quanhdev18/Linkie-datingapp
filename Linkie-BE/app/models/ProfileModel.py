from pygments.lexers import q
from sqlalchemy import Column, Integer, String, Date, Text, DateTime, Enum, ARRAY, ForeignKey
from sqlalchemy.sql import func
from app.enum.ProfileEnum import GenderEnum, HobbyEnum
from app.core.base import Base
from sqlalchemy.orm import relationship
class Profile(Base):
    __tablename__ = "profile"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String)
    gender = Column((Enum(GenderEnum)))
    date_of_birth = Column(Date)
    bio = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    target_type = Column(String(1000))
    hobby = Column(
        ARRAY(Enum(HobbyEnum, name="hobbyenum", validate_strings=True)),
    )
    avatar_id = Column(Integer, ForeignKey("account_avatar.id", ondelete="SET NULL"), nullable=True)
    avatar = relationship("AccountAvatar", foreign_keys=[avatar_id])
    # One-to-many: profile → images
    images = relationship("ProfileImage", back_populates="profile", cascade="all, delete-orphan")
    account_id = Column(Integer, ForeignKey("account.id"))
    account = relationship("Account", back_populates="profile")
    # user_location = relationship("UserLocation", backref="account", uselist=False, cascade="all, delete-orphan")