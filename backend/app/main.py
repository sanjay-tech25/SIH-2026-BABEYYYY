from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.database import engine, Base
from app.core.exceptions import DomainException
from app.api.router import api_router
import app.models  # Ensure all ORM models are registered with Base metadata


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: configure logging and create tables in SQLite
    setup_logging()
    logger.info("Initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info(f"{settings.PROJECT_NAME} startup complete. Environment: {settings.ENVIRONMENT}")
    yield
    # Shutdown
    logger.info("Shutting down database engine...")
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(DomainException)
async def domain_exception_handler(request: Request, exc: DomainException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": exc.detail}
    )


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "project": settings.PROJECT_NAME, "environment": settings.ENVIRONMENT}


@app.get("/", tags=["Root"])
async def root(request: Request):
    """Returns a visual confirmation in the browser that the backend is running properly."""
    accept_header = request.headers.get("accept", "")
    if "text/html" in accept_header:
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{settings.PROJECT_NAME} - Backend Active</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #0b0f19;
            color: #f3f4f6;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }}
        .card {{
            background: #111827;
            border: 1px solid #1f2937;
            border-radius: 16px;
            padding: 40px;
            max-width: 580px;
            width: 100%;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(16, 185, 129, 0.15);
            text-align: center;
        }}
        .badge {{
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.15);
            color: #10b981;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 20px;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }}
        .dot {{
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            box-shadow: 0 0 10px #10b981;
            animation: pulse 2s infinite;
        }}
        @keyframes pulse {{
            0%, 100% {{ opacity: 1; transform: scale(1); }}
            50% {{ opacity: 0.4; transform: scale(1.3); }}
        }}
        h1 {{
            font-size: 1.65rem;
            margin-bottom: 12px;
            color: #ffffff;
            letter-spacing: -0.02em;
        }}
        p {{
            color: #9ca3af;
            font-size: 0.95rem;
            line-height: 1.5;
            margin-bottom: 24px;
        }}
        .meta-box {{
            background: #1f2937;
            border-radius: 10px;
            padding: 14px 18px;
            text-align: left;
            margin-bottom: 24px;
            font-size: 0.85rem;
            font-family: monospace;
            color: #d1d5db;
        }}
        .meta-item {{
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid #374151;
        }}
        .meta-item:last-child {{ border-bottom: none; }}
        .actions {{
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }}
        .btn {{
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 10px 18px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s;
        }}
        .btn-primary {{
            background: #2563eb;
            color: #ffffff;
        }}
        .btn-primary:hover {{ background: #1d4ed8; }}
        .btn-secondary {{
            background: #374151;
            color: #e5e7eb;
        }}
        .btn-secondary:hover {{ background: #4b5563; }}
    </style>
</head>
<body>
    <div class="card">
        <div class="badge">
            <span class="dot"></span>
            Backend Active & Operational
        </div>
        <h1>{settings.PROJECT_NAME}</h1>
        <p>The backend server is running properly and connected to the database.</p>
        
        <div class="meta-box">
            <div class="meta-item"><span>Server Status</span><span style="color: #10b981; font-weight: bold;">Healthy (200 OK)</span></div>
            <div class="meta-item"><span>Environment</span><span>{settings.ENVIRONMENT}</span></div>
            <div class="meta-item"><span>API Version</span><span>{settings.API_V1_STR}</span></div>
        </div>

        <div class="actions">
            <a href="{settings.API_V1_STR}/docs" class="btn btn-primary" target="_blank">📖 Swagger API Docs</a>
            <a href="{settings.API_V1_STR}/redoc" class="btn btn-secondary" target="_blank">📘 ReDoc</a>
            <a href="/health" class="btn btn-secondary" target="_blank">🩺 Health JSON</a>
        </div>
    </div>
</body>
</html>"""
        return HTMLResponse(content=html_content)

    return JSONResponse(
        content={
            "status": "healthy",
            "message": f"{settings.PROJECT_NAME} backend is running properly",
            "environment": settings.ENVIRONMENT,
            "docs_url": f"{settings.API_V1_STR}/docs"
        }
    )


# Mount API V1 router
app.include_router(api_router, prefix=settings.API_V1_STR)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
