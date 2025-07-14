# from sqlalchemy import Column, DateTime, Integer, ForeignKey
# from geoalchemy2 import Geography
# from sqlalchemy.ext.declarative import declarative_base
# from datetime import datetime

# Base = declarative_base()

# class UserLocation(Base):
#     __tablename__ = "user_locations"

#     user_id = Column(Integer, ForeignKey("account.id"), primary_key=True, index=True)
#     location = Column(Geography(geometry_type="POINT", srid=4326))
#     last_updated = Column(DateTime, default=datetime.utcnow)

from sqlalchemy import Column, DateTime, Integer, ForeignKey
from geoalchemy2 import Geography
from datetime import datetime
from app.core.base import Base  

class UserLocation(Base):
    __tablename__ = "user_locations"

    account_id = Column(Integer, ForeignKey("account.id"), primary_key=True)
    location = Column(Geography(geometry_type="POINT", srid=4326))
    last_updated = Column(DateTime, default=datetime.utcnow)
