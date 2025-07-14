from datetime import datetime

from pydantic import BaseModel


class LocationOut(BaseModel):
    latitude: float
    longitude: float
    last_updated: datetime
    
    class Config:
        orm_mode = True 
