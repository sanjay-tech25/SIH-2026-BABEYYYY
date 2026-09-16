from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.core.websocket_manager import ws_manager
from app.core.security import decode_token
from app.core.logging import logger

router = APIRouter(tags=["WebSocket"])


@router.websocket("/ws/events")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(...)
):
    payload = decode_token(token)
    if not payload:
        await websocket.close(code=1008)  # Policy violation
        return

    user_id = payload.get("sub")
    if not user_id:
        await websocket.close(code=1008)
        return

    await ws_manager.connect(user_id, websocket)
    try:
        while True:
            # Keepalive / incoming ping handler
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(user_id, websocket)
    except Exception as e:
        logger.warning(f"WebSocket exception for user {user_id}: {e}")
        ws_manager.disconnect(user_id, websocket)
