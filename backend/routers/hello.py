from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter()


@router.get("/hello")
async def hello_world(db: Session = Depends(get_db)):
    return {"message": "Pozdrav, konacno ti radi ovo logovanje!"}
