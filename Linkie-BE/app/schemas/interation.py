from pydantic import BaseModel
from typing import Optional

class MatchedUserOut(BaseModel):
    id: int
    username: Optional[str]
    # avatar: Optional[str]

    class Config:
        orm_mode = True

class LikeOut(BaseModel):
    liked_id: int

    class Config:
        orm_mode = True