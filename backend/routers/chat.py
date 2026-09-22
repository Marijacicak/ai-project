import logging
import os

from fastapi import APIRouter, Depends, HTTPException

from auth import get_current_user, oauth2_scheme
from models.user import User
from schemas.chat import ChatRequest, ChatResponse
from services.chat_service import answer_question

router = APIRouter(prefix="/chat", tags=["chat"])
logger = logging.getLogger(__name__)


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    user: User = Depends(get_current_user),
    token: str = Depends(oauth2_scheme),
):
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Your account is inactive")
    if not os.getenv("OPENAI_API_KEY", "").strip():
        raise HTTPException(
            status_code=503,
            detail="Chat is not configured yet. Set OPENAI_API_KEY in the backend environment.",
        )
    try:
        return await answer_question(request, token)
    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="Chat dependencies are missing. Rebuild the backend image.",
        ) from None
    except TimeoutError:
        raise HTTPException(
            status_code=504, detail="The assistant took too long. Please try again."
        ) from None
    except Exception as error:
        # Provider/MCP exception text can contain credentials or personal data.
        logger.warning("Chat failed (%s)", type(error).__name__)
        raise HTTPException(
            status_code=502,
            detail="Unable to answer right now. Check the model configuration, API quota, "
            "and profile service, then try again.",
        ) from None
