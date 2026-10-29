import pytest

from database import SessionLocal
from models.user import User

PASSWORD = "secret123"


def register(client, email, username):
    return client.post(
        "/auth/register",
        json={"email": email, "username": username, "password": PASSWORD},
    )


def login(client, email):
    response = client.post("/auth/login", json={"email": email, "password": PASSWORD})
    return response.json()["access_token"]


def auth_header(token):
    return {"Authorization": f"Bearer {token}"}


def set_active(email, is_active):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        user.is_active = is_active
        db.commit()
    finally:
        db.close()


@pytest.fixture
def admin_token(client):
    register(client, "admin@example.com", "admin")
    return login(client, "admin@example.com")


@pytest.fixture
def user_token(client, admin_token):
    register(client, "user@example.com", "user")
    return login(client, "user@example.com")


def test_first_registered_user_becomes_admin(client):
    response = register(client, "admin@example.com", "admin")

    assert response.status_code == 200
    assert response.json()["roles"] == ["admin"]


def test_later_registered_users_become_user(client, admin_token):
    response = register(client, "user@example.com", "user")

    assert response.json()["roles"] == ["user"]


def test_register_rejects_invalid_email(client):
    response = register(client, "not-an-email", "someone")

    assert response.status_code == 422


def test_login_token_identifies_the_user(client, user_token):
    response = client.get("/auth/me", headers=auth_header(user_token))

    assert response.status_code == 200
    assert response.json()["email"] == "user@example.com"


def test_inactive_user_cannot_log_in(client, user_token):
    set_active("user@example.com", False)

    response = client.post(
        "/auth/login", json={"email": "user@example.com", "password": PASSWORD}
    )

    assert response.status_code == 403


def test_inactive_user_existing_token_is_rejected(client, user_token):
    set_active("user@example.com", False)

    response = client.get("/auth/me", headers=auth_header(user_token))

    assert response.status_code == 403


def test_list_users_requires_token(client):
    assert client.get("/auth/users").status_code == 401


def test_list_users_forbidden_for_regular_user(client, user_token):
    response = client.get("/auth/users", headers=auth_header(user_token))

    assert response.status_code == 403


def test_list_users_allowed_for_admin(client, admin_token, user_token):
    response = client.get("/auth/users", headers=auth_header(admin_token))

    assert response.status_code == 200
    assert len(response.json()) == 2


def test_hello_requires_token(client):
    assert client.get("/hello").status_code == 401


def test_hello_returns_message_with_token(client, user_token):
    response = client.get("/hello", headers=auth_header(user_token))

    assert response.status_code == 200
    assert "message" in response.json()
