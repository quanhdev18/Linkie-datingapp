from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.report import AccountReportCreate, AccountReportOut
from app.crud import report as report_crud
from app.core.database import get_db

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/account", response_model=AccountReportOut)
def report_account(report: AccountReportCreate, db: Session = Depends(get_db)):
    return report_crud.create_account_report(db, report)

@router.get("/accounts", response_model=list[AccountReportOut])
def get_account_reports(db: Session = Depends(get_db)):
    return report_crud.get_all_account_reports(db)