from datetime import datetime
from app.core.base import Base
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from sqlalchemy.orm import relationship


class Message(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True, index=True)
    from_user_id = Column(Integer, ForeignKey('account.id'), nullable=False)
    to_user_id = Column(Integer, ForeignKey('account.id'), nullable=False)
    content = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    from_user = relationship("Account", foreign_keys=[from_user_id], back_populates="sent_messages")
    to_user = relationship("Account", foreign_keys=[to_user_id], back_populates="received_messages")