from fastapi import WebSocket, WebSocketDisconnect, Depends
from typing import Dict, Set
import json
from app.middleware.auth import get_current_user_ws

class ConnectionManager:
    """Manage WebSocket connections for real-time messaging"""
    
    def __init__(self):
        # booking_id -> Set of WebSocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # WebSocket -> user_id mapping
        self.user_connections: Dict[WebSocket, str] = {}
    
    async def connect(self, websocket: WebSocket, booking_id: str, user_id: str):
        """Connect a client to a booking room"""
        await websocket.accept()
        
        if booking_id not in self.active_connections:
            self.active_connections[booking_id] = set()
        
        self.active_connections[booking_id].add(websocket)
        self.user_connections[websocket] = user_id
        
        print(f"✅ User {user_id} connected to booking {booking_id}")
    
    def disconnect(self, websocket: WebSocket, booking_id: str):
        """Disconnect a client from a booking room"""
        if booking_id in self.active_connections:
            self.active_connections[booking_id].discard(websocket)
            if not self.active_connections[booking_id]:
                del self.active_connections[booking_id]
        
        user_id = self.user_connections.pop(websocket, None)
        print(f"❌ User {user_id} disconnected from booking {booking_id}")
    
    async def broadcast_to_booking(self, booking_id: str, message: dict, exclude: WebSocket = None):
        """Send message to all clients in a booking room"""
        if booking_id in self.active_connections:
            dead_connections = set()
            
            for connection in self.active_connections[booking_id]:
                if connection != exclude:
                    try:
                        await connection.send_json(message)
                    except:
                        dead_connections.add(connection)
            
            # Clean up dead connections
            for connection in dead_connections:
                self.disconnect(connection, booking_id)

manager = ConnectionManager()

async def websocket_endpoint(websocket: WebSocket, booking_id: str, token: str):
    """
    WebSocket endpoint for real-time chat
    
    Usage: ws://localhost:8000/ws/chat/{booking_id}?token={jwt_token}
    """
    try:
        # Verify token and get user
        user = await get_current_user_ws(token)
        
        if not user:
            await websocket.close(code=4001, reason="Unauthorized")
            return
        
        # Connect user to booking room
        await manager.connect(websocket, booking_id, user.id)
        
        try:
            while True:
                # Receive message from client
                data = await websocket.receive_text()
                message_data = json.loads(data)
                
                # Broadcast to all clients in the booking room
                await manager.broadcast_to_booking(
                    booking_id,
                    {
                        "type": "new_message",
                        "message": message_data,
                        "sender_id": user.id,
                        "sender_name": user.full_name
                    },
                    exclude=websocket
                )
        
        except WebSocketDisconnect:
            manager.disconnect(websocket, booking_id)
        
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close(code=4000, reason=str(e))