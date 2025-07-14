# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from app.core.database import get_db
# from app.crud.InteractionService import InteractionService

# router = APIRouter(prefix="/interactions", tags=["Interactions"])

# @router.post("/like/{liked_id}/{liker_id}")
# def like_user(
#     liked_id: int,
#     liker_id: int,
#     db: Session = Depends(get_db),
# ):
#     result = InteractionService.like_user(db, liker_id, liked_id)
#     return result
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.crud.InteractionService import InteractionService
from app.crud.AccountService import get_account_by_id
from app.schemas.interation import MatchedUserOut, LikeOut
from fastapi import Query

router = APIRouter(prefix="/interactions", tags=["Interactions"])

@router.post("/like/{liked_id}/{liker_id}")
def like_user(
    liked_id: int,
    liker_id: int,
    db: Session = Depends(get_db),
):
    result = InteractionService.like_user(db, liker_id, liked_id)

    if result.get("match"):  # Nếu match thì lấy thông tin 2 user
        user1 = get_account_by_id(db, liker_id)
        user2 = get_account_by_id(db, liked_id)
        return {
            "match": True,
            "user1": {"email": user1.email},
            "user2": {"username": user2.username},
        }

    return {"match": False}

@router.get("/matches/{account_id}", response_model=List[MatchedUserOut])
def get_matches(account_id: int, db: Session = Depends(get_db)):
    return InteractionService.get_matches(db, account_id)

@router.get("/interactions", response_model=list[LikeOut])
def get_liked_users(user_id: int = Query(...), db: Session = Depends(get_db)):
    """
    Lấy danh sách các account_id mà user đã like.
    """
    likes = InteractionService.get_likes_by_user(db, user_id)
    return likes
