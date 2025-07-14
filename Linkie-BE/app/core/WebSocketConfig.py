# managers/ws_instance.py

from app.crud.WebSocketService import WebSocketManager

# ✅ Singleton — chỉ tạo 1 lần duy nhất cho toàn ứng dụng
ws_manager = WebSocketManager()