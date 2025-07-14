from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.MessageModel import Message
from app.core.database import get_db
from app.models.UserModel import Account

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("/history/")
def get_chat_history(user1_id: int, user2_id: int, db: Session = Depends(get_db)):
    messages = db.query(Message).filter(
        ((Message.from_user_id == user1_id) & (Message.to_user_id == user2_id)) |
        ((Message.from_user_id == user2_id) & (Message.to_user_id == user1_id))
    ).order_by(Message.timestamp).all()

    return [
        {
            "from_user_id": m.from_user_id,
            "to_user_id": m.to_user_id,
            "content": m.content,
            "timestamp": m.timestamp.isoformat(),
        }
        for m in messages
    ]

@router.get("/conversations/{user_id}")
def get_conversations(user_id: int, db: Session = Depends(get_db)):
    """
    Lấy danh sách user đã từng chat với user_id, kèm tin nhắn cuối + partner name + avatar url
    """
    messages = (
        db.query(Message)
        .filter((Message.from_user_id == user_id) | (Message.to_user_id == user_id))
        .order_by(Message.timestamp.desc())
        .all()
    )

    conv_dict = {}
    for m in messages:
        partner_id = m.to_user_id if m.from_user_id == user_id else m.from_user_id

        if partner_id not in conv_dict:
            partner_account = db.query(Account).filter(Account.id == partner_id).first()

            # name
            partner_name = None
            if partner_account and partner_account.profile:
                partner_name = partner_account.profile.username
            else:
                partner_name = "Ẩn danh"

            # avatar url
            avatar_url = None
            if partner_account and partner_account.avatar:
                avatar_url = partner_account.avatar.url

            conv_dict[partner_id] = {
                "partner_id": partner_id,
                "partner_name": partner_name,
                "partner_avatar": avatar_url,  # link đầy đủ
                "last_message": m.content,
                "last_time": m.timestamp,
            }

    return list(conv_dict.values())