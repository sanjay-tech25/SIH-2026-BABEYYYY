import json
from typing import Dict, List, Set, Any
from fastapi import WebSocket
from app.core.logging import logger


class WebSocketManager:
    """Manages active WebSocket connections by user ID and topic broadcasting."""
    def __init__(self):
        # Map user_id -> Set of active WebSockets
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
        logger.info(f"WebSocket connected for user: {user_id}. Active sessions: {len(self.active_connections[user_id])}")

    def disconnect(self, user_id: str, websocket: WebSocket):
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        logger.info(f"WebSocket disconnected for user: {user_id}")

    async def send_personal_event(self, user_id: str, event_type: str, payload: Dict[str, Any]):
        """Send a strongly-typed JSON event to all open connections of a user."""
        if user_id in self.active_connections:
            message = json.dumps({
                "type": event_type,
                "data": payload
            })
            dead_connections = set()
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(message)
                except Exception as exc:
                    logger.warning(f"Error sending to user {user_id} connection: {exc}")
                    dead_connections.add(connection)
            
            # Clean up dead sockets
            for dead in dead_connections:
                self.disconnect(user_id, dead)

    async def broadcast(self, event_type: str, payload: Dict[str, Any]):
        """Broadcast an event to all connected users across the platform."""
        message = json.dumps({
            "type": event_type,
            "data": payload
        })
        for user_id, connections in list(self.active_connections.items()):
            for connection in list(connections):
                try:
                    await connection.send_text(message)
                except Exception:
                    self.disconnect(user_id, connection)


ws_manager = WebSocketManager()
