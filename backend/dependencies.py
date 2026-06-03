from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from database import get_db
from models.user import User
from auth import SECRET_KEY, ALGORITHM
import json

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Permission constants
PERMISSIONS = {
    "user": ["read_own_profile", "update_own_profile"],
    "admin": [
        "read_own_profile",
        "update_own_profile",
        "read_all_users",
        "delete_users",
        "manage_roles",
    ],
}


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


def require_permission(permission: str):
    def permission_checker(current_user: User = Depends(get_current_user)):
        user_permissions = []

        # Get all permissions from user's roles
        for role in current_user.roles:
            role_permissions = json.loads(role.permissions) if role.permissions else []
            user_permissions.extend(role_permissions)

        if permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions"
            )

        return current_user

    return permission_checker


def require_role(role_name: str):
    def role_checker(current_user: User = Depends(get_current_user)):
        user_roles = [role.name for role in current_user.roles]

        if role_name not in user_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires {role_name} role",
            )

        return current_user

    return role_checker


def get_current_user_roles(current_user: User = Depends(get_current_user)):
    return [role.name for role in current_user.roles]


def is_admin(current_user: User = Depends(get_current_user)):
    return require_role("admin")(current_user)
