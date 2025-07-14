from sqlalchemy.orm import Session
from app.models.report import AccountReport
from app.schemas.report import AccountReportCreate

def create_account_report(db: Session, report: AccountReportCreate):
    db_report = AccountReport(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def get_all_account_reports(db: Session) -> list[AccountReport]:
    return db.query(AccountReport).order_by(AccountReport.created_at.desc()).all()

