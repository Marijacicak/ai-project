"""Private stdio MCP server: one read-only tool, scoped to one request's JWT."""

import os

import httpx
from fastmcp import FastMCP

from schemas.user import UserResponse

mcp = FastMCP("Current user profile")


@mcp.tool()
async def get_my_profile() -> dict:
    """Read the signed-in user's profile from GET /auth/me. Takes no user ID."""
    token = os.environ.get("PROFILE_ACCESS_TOKEN")
    if not token:
        raise ValueError("Authentication is required")

    # No caller-controlled URLs, redirects, IDs, or database access.
    async with httpx.AsyncClient(timeout=10, follow_redirects=False) as client:
        response = await client.get(
            "http://127.0.0.1:8000/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        response.raise_for_status()
        return UserResponse.model_validate(response.json()).model_dump(mode="json")


if __name__ == "__main__":
    mcp.run(transport="stdio")
