from pydantic import BaseModel

class LocationUpdate(BaseModel):
    account_id: int
    lat: float
    lng: float
