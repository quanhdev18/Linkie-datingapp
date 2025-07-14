from pydantic import BaseModel
from datetime import datetime

class PackageCreate(BaseModel):
    name: str
    description: str
    price: int

class PackageOut(BaseModel):
    id: int
    name: str
    description: str
    price: int
    class Config:
        orm_mode = True

class PurchaseCreate(BaseModel):
    package_id: int

class PurchaseOut(BaseModel):
    id: int
    user_id: int
    package_id: int
    status: str
    created_at: datetime
    class Config:
        orm_mode = True
