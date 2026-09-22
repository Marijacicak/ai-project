from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

ProfileField = Literal["id", "username", "email", "roles", "is_active", "created_at"]


class ChatRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    message: str = Field(min_length=1, max_length=2000)
    previous_questions: list[str] = Field(default_factory=list, max_length=6)

    @field_validator("message")
    @classmethod
    def strip_message(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Enter a question")
        return value.strip()

    @field_validator("previous_questions")
    @classmethod
    def limit_questions(cls, values: list[str]) -> list[str]:
        if any(len(value) > 2000 for value in values):
            raise ValueError("Previous questions must be at most 2000 characters")
        return values


class ProfileSelection(BaseModel):
    fields: list[ProfileField] = Field(default_factory=list, max_length=6)
    include_endpoint: bool = False
    unsupported: bool = False


class ChatResponse(BaseModel):
    message: str
    source: str | None = None
