from datetime import datetime

from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.core.base import Base

class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    recipient_id = Column(Integer, ForeignKey('account.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)

    recipient = relationship("Account", back_populates="notifications")
