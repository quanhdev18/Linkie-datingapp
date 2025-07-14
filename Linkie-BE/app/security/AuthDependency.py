from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.core.database import get_db
from app.models.UserModel import Account
from app.security.SecurityConfig import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")  # Dummy URL

def get_current_account(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Account:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing token",
    )

    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    account = db.query(Account).filter(Account.email == email).first()
    if not account:
        raise credentials_exception

    return account


def require_role(role: str):
    def role_checker(account: Account = Depends(get_current_account)):
        if account.role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"You must have {role} role to access this resource."
            )
        return account
    return role_checker
