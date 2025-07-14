from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class ImageOut(BaseModel):
    id: int
    title: str
    url: str
    alt: Optional[str] = None
    upload_date: datetime

    class Config:
        from_attributes = True