from typing import Dict
from fastapi import WebSocket

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[int, Dict[str, WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int, conn_type: str):
        await websocket.accept()

        # Chỉ tạo dict mới nếu chưa tồn tại user_id
        if user_id not in self.active_connections:
            self.active_connections[user_id] = {}

        # Gán conn_type mà không ghi đè dict cũ
        self.active_connections[user_id][conn_type] = websocket


    def disconnect(self, user_id: int, conn_type: str):
        if user_id in self.active_connections:
            self.active_connections[user_id].pop(conn_type, None)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_to(self, user_id: int, conn_type: str, message: str):
        websocket = self.active_connections.get(user_id, {}).get(conn_type)
        if websocket:
            await websocket.send_text(message)
        else:
            print(f"[Warning] No {conn_type} WebSocket found for user {user_id}")