from fastapi import APIRouter, Depends
from dependencies import get_current_user
from models.user import User

router = APIRouter()


@router.get("/hello")
async def hello_world(current_user: User = Depends(get_current_user)):
    return {"message": "Pozdrav, konacno ti radi ovo logovanje!"}
