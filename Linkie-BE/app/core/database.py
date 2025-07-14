# app/core/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.UserModel import Account, RefreshToken, Otp
from app.models.ImageModel import AccountAvatar, ProfileImage
from app.models.ProfileModel import Profile
from app.models.LocationModel import Location
from app.models.MessageModel import Message
from app.models.NotificationModel import Notification
from app.models.InteractionModel import Match, Like
from dotenv import load_dotenv
from app.core.base import Base

load_dotenv() 
database_url = os.environ.get("DATABASE_URL")

engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tạo bảng
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()