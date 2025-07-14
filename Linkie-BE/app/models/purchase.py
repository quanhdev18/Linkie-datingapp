from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    package_id = Column(Integer, nullable=False)
    status = Column(String(50), default="pending")  # 'pending', 'success', 'failed'
    vnp_txn_ref = Column(String(100), unique=True, nullable=False)
    vnp_transaction_no = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())