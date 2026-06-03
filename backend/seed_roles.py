from database import SessionLocal, engine, Base
from models.role import Role
from models.user import User
import json


def seed_roles():
    # Create tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if roles already exist
        existing_roles = db.query(Role).all()
        if existing_roles:
            print("Roles already exist, skipping seeding")
            return

        # Create default roles
        user_role = Role(
            name="user",
            permissions=json.dumps(["read_own_profile", "update_own_profile"]),
            description="Standard user with basic permissions",
        )

        admin_role = Role(
            name="admin",
            permissions=json.dumps(
                [
                    "read_own_profile",
                    "update_own_profile",
                    "read_all_users",
                    "delete_users",
                    "manage_roles",
                ]
            ),
            description="Administrator with full system access",
        )

        db.add(user_role)
        db.add(admin_role)
        db.commit()

        print("Default roles seeded successfully")

    except Exception as e:
        print(f"Error seeding roles: {e}")
        db.rollback()
    finally:
        db.close()


def assign_default_role(user_id: int, is_first_user: bool = False):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return False

        # Get the appropriate role
        if is_first_user:
            role = db.query(Role).filter(Role.name == "admin").first()
        else:
            role = db.query(Role).filter(Role.name == "user").first()

        if role:
            user.roles.append(role)
            db.commit()
            return True

        return False

    except Exception as e:
        print(f"Error assigning role: {e}")
        db.rollback()
        return False
    finally:
        db.close()


def get_user_count():
    db = SessionLocal()
    try:
        return db.query(User).count()
    finally:
        db.close()


if __name__ == "__main__":
    seed_roles()
