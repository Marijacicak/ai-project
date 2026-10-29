from database import SessionLocal, engine, Base
from models.role import Role


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
            description="Standard user with basic permissions",
        )

        admin_role = Role(
            name="admin",
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


if __name__ == "__main__":
    seed_roles()
