
from sqlalchemy import Column, Integer, Enum, ForeignKey, DateTime, Text, Enum as SAEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
from app.enum.ReportReason import ReportReason

class AccountReport(Base):
    __tablename__ = "account_reports"

    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("account.id"), nullable=False)
    reported_id = Column(Integer, ForeignKey("account.id"), nullable=False)
    reason = Column(SAEnum(ReportReason), nullable=False)
    description = Column(Text, nullable=True)
    detail_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    reporter = relationship("Account", foreign_keys=[reporter_id])
    reported = relationship("Account", foreign_keys=[reported_id])
