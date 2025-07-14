# app/routers/account_controller.py
from typing import Optional

from fastapi import APIRouter, Depends, status, HTTPException, Request
from pydantic import conint
from sqlalchemy import String
from sqlalchemy.orm import Session, Query

from app.core.database import get_db
from app.crud.AccountService import delete_account_no_constraint_by_email_service, delete_account_with_otp_constraint, \
    get_paginated_activated_accounts, get_account_by_email, deactivate_account_by_email
from app.schemas.PaginationSchema import PaginatedResponse
from app.schemas.ProfileDTO import ProfileOut
from app.schemas.UserSchema import AccountOut, UserRole, AccountWithAvatarOut, AccountWithProfileOut, \
    AccountWithLocationOut

router = APIRouter(
    prefix="/accounts",
    tags=["Accounts"]
)


@router.delete("/no-constraint/{email}", status_code=status.HTTP_200_OK)
def delete_account_no_constraint_by_email(email: str, db: Session = Depends(get_db)):
    result: String = delete_account_no_constraint_by_email_service(email, db)
    return {"message": result}


@router.delete("/otp-constraint/{email}", status_code=status.HTTP_200_OK)
def delete_account_after_failed_verification(email: str, db: Session = Depends(get_db)):
    result: String = delete_account_with_otp_constraint(email, db)
    return {"message": result}


@router.get("/activated", response_model=PaginatedResponse[AccountOut])
def get_activated_users(
        db: Session = Depends(get_db),
        page: conint(gt=0) = Query(1),
        size: conint(gt=0, le=100) = Query(10),
        role: Optional[UserRole] = None
):
    total, total_pages, items = get_paginated_activated_accounts(db, page=page, size=size, role=role)
    return {
        "total": total,
        "total_pages": total_pages,
        "page": page,
        "size": size,
        "items": items
    }


@router.get("/with-avatar/{email}", response_model=AccountWithAvatarOut)
def search_account_with_avatar_by_email(
    email: str,
    db: Session = Depends(get_db)
):
    account = get_account_by_email(db, email=email)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account

@router.get("/with-profile/{email}", response_model=AccountWithProfileOut)
def search_account_with_profile_by_email(
    email: str,
    db: Session = Depends(get_db)
):
    account = get_account_by_email(db, email=email)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account

@router.get("/with-location/{email}", response_model=AccountWithLocationOut)
def search_account_with_profile_by_email(
    email: str,
    db: Session = Depends(get_db)
):
    account = get_account_by_email(db, email=email)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account

@router.put("/deactivate/{email}", status_code=status.HTTP_200_OK)
def deactivate_account(email: str, db: Session = Depends(get_db)):
    result: str = deactivate_account_by_email(email, db)
    return {"message": result}

