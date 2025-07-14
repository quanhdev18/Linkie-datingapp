from datetime import datetime

from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.core.base import Base


class Like(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True, index=True)
    liker_id = Column(Integer, ForeignKey("account.id", ondelete="CASCADE"))
    liked_id = Column(Integer, ForeignKey("account.id", ondelete="CASCADE"))
    timestamp = Column(DateTime, default=datetime.utcnow)

    liker = relationship("Account", foreign_keys=[liker_id])
    liked = relationship("Account", foreign_keys=[liked_id])

class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user1_id = Column(Integer, ForeignKey("account.id", ondelete="CASCADE"))
    user2_id = Column(Integer, ForeignKey("account.id", ondelete="CASCADE"))
    matched_at = Column(DateTime, default=datetime.utcnow)

    user1 = relationship("Account", foreign_keys=[user1_id])
    user2 = relationship("Account", foreign_keys=[user2_id])
