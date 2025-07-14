from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette.websockets import WebSocket, WebSocketDisconnect
from app.core.WebSocketConfig import ws_manager
from app.core.database import get_db


router = APIRouter(
    tags=["Notification"],
)

@router.websocket("/ws/notifications/{user_id}")
async def websocket_notification_endpoint(websocket: WebSocket, user_id: int, db: Session = Depends(get_db)):
    await ws_manager.connect(websocket, user_id, conn_type="notification")  # ✅ RẤT QUAN TRỌNG

    try:
        while True:
            # Chỉ giữ kết nối mở — không cần nhận dữ liệu từ client
            await websocket.receive_text()  # hoặc asyncio.sleep nếu không dùng client send gì cả

    except WebSocketDisconnect:
        ws_manager.disconnect(user_id, "notification")