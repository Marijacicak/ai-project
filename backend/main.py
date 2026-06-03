from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import hello, auth
from seed_roles import seed_roles

app = FastAPI(title="FastAPI Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed default roles
seed_roles()

# Include routers
app.include_router(auth.router)
app.include_router(hello.router)


@app.get("/")
async def root():
    return {"message": "FastAPI Backend is running"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
