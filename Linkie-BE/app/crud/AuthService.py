import random
from datetime import datetime, timedelta

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.UserModel import Account, Otp, RefreshToken
from app.schemas.UserSchema import SendOtpRequest, VerifyOtpRequest, AuthResponse, AccountRegister
from app.crud.EmailService import EmailService
from app.security.JwtService import JwtService
from app.models.ProfileModel import Profile


email_service = EmailService()
jwt_service = JwtService()


def generate_otp_code() -> int:
    return random.randint(100000, 999999)


async def send_otp_email(request: SendOtpRequest, db: Session):
    account = db.query(Account).filter(Account.email == request.email).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account with this email does not exist")

    existing_otp = db.query(Otp).filter(Otp.account_id == account.id).first()
    now = datetime.utcnow()

    if existing_otp:
        if existing_otp.expiration_time > now:
            raise HTTPException(status_code=400, detail="OTP already sent. Please wait before requesting another.")
        db.delete(existing_otp)
        db.commit()

    otp_code = generate_otp_code()
    expires_at = now + timedelta(minutes=2)

    otp = Otp(
        account_id=account.id,
        otp=otp_code,
        expiration_time=expires_at
    )
    db.add(otp)
    db.commit()

    # Gửi email
    import asyncio
    asyncio.create_task(email_service.send_email_otp(email=account.email, otp=otp_code))

def verify_email_by_otp(request: VerifyOtpRequest, db: Session) -> AuthResponse:
    account = db.query(Account).filter(Account.email == request.email).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    otp_entry = db.query(Otp).filter(Otp.account_id == account.id, Otp.otp == request.otp).first()
    if not otp_entry:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if otp_entry.expiration_time < datetime.utcnow():
        db.delete(otp_entry)
        db.commit()
        raise HTTPException(status_code=400, detail="OTP expired")

    # OTP is valid → delete it
    db.delete(otp_entry)
    db.commit()

    # Create a new null profile
    # Tạo profile nếu chưa có
    existing_profile = db.query(Profile).filter_by(account_id=account.id).first()
    # profile = existing_profile
   

    # Sửa trường is_activated = true
    account.is_activated = True

    # Access & Refresh Token
    access_token = jwt_service.create_access_token(subject=account.email)
    refresh_token_str = jwt_service.create_refresh_token(subject=account.email)

    # Lưu refresh token vào DB (nếu chưa có thì tạo mới, nếu có thì cập nhật)
    refresh = db.query(RefreshToken).filter(RefreshToken.account_id == account.id).first()
    expires_at = datetime.utcnow() + timedelta(hours=jwt_service.refresh_token_expire_hours)

    if refresh:
        refresh.refresh_token = refresh_token_str
        refresh.expiration_time = expires_at
    else:
        refresh = RefreshToken(
            account_id=account.id,
            refresh_token=refresh_token_str,
            expiration_time=expires_at
        )
        db.add(refresh)

    db.commit()
    # profile có thể là new_profile hoặc existing_profile
    # profile = new_profile if not existing_profile else existing_profile

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token_str,
        account_id=account.id,
        # profile_id=profile.id,
    )


def verify_otp_and_login(request: VerifyOtpRequest, db: Session) -> AuthResponse:
    account = db.query(Account).filter(Account.email == request.email).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    otp_entry = db.query(Otp).filter(Otp.account_id == account.id, Otp.otp == request.otp).first()
    if not otp_entry:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if otp_entry.expiration_time < datetime.utcnow():
        db.delete(otp_entry)
        db.commit()
        raise HTTPException(status_code=400, detail="OTP expired")

    # OTP is valid → delete it
    db.delete(otp_entry)
    db.commit()

    # Access & Refresh Token
    access_token = jwt_service.create_access_token(subject=account.email)
    refresh_token_str = jwt_service.create_refresh_token(subject=account.email)

    # Save/Update refresh token
    refresh = db.query(RefreshToken).filter(RefreshToken.account_id == account.id).first()
    expires_at = datetime.utcnow() + timedelta(hours=jwt_service.refresh_token_expire_hours)

    if refresh:
        refresh.refresh_token = refresh_token_str
        refresh.expiration_time = expires_at
    else:
        refresh = RefreshToken(
            account_id=account.id,
            refresh_token=refresh_token_str,
            expiration_time=expires_at
        )
        db.add(refresh)

    db.commit()

    # 🔍 Lấy profile_id
    profile = db.query(Profile).filter(Profile.account_id == account.id).first()
    profile_id = profile.id if profile else None

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token_str,
        account_id=account.id,
        profile_id=profile_id
    )

def register_user(user_data: AccountRegister, db: Session):
    # Kiểm tra email hoặc username đã tồn tại
    if db.query(Account).filter(Account.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    account = Account(
        email=user_data.email,
        role="USER"
    )

    db.add(account)
    db.commit()
    db.refresh(account)
    return {"message": "Account registered successfully!"}


def refresh_access_token(refresh_token: str, db: Session) -> AuthResponse:
    token_record = db.query(RefreshToken).filter(RefreshToken.refresh_token == refresh_token).first()

    if not token_record:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    if token_record.expiration_time < datetime.utcnow():
        db.delete(token_record)
        db.commit()
        raise HTTPException(status_code=401, detail="Refresh token expired")

    account = token_record.account

    new_access_token = jwt_service.create_access_token(subject=account.email)
    return AuthResponse(
        access_token=new_access_token,
        refresh_token=token_record.refresh_token
    )
