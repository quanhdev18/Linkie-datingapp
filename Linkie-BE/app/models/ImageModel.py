from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.base import Base

class AccountAvatar(Base):
    __tablename__ = "account_avatar"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    alt = Column(String)
    upload_date = Column(DateTime, default=datetime.utcnow)
    account_id = Column(Integer, ForeignKey("account.id"), unique=True, nullable=False)
    account = relationship("Account", back_populates="avatar")

class ProfileImage(Base):
    __tablename__ = "profile_image"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True)
    url = Column(String, nullable=False)
    alt = Column(String)
    upload_date = Column(DateTime, default=datetime.utcnow)
    
    # ForeignKey liên kết về profile
    profile_id = Column(Integer, ForeignKey("profile.id", ondelete="CASCADE"), nullable=False)

    profile = relationship("Profile", back_populates="images")
