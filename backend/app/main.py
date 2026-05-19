from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

app = FastAPI(
    title="MyPet API",
    description="Backend API cho ứng dụng MyPet",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
async def root():
    return {"message": "MyPet API is running 🐾", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}


# Include routers here as you build them
# from app.api.v1 import auth, pets, users
# app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
# app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
# app.include_router(pets.router, prefix="/api/v1/pets", tags=["Pets"])
