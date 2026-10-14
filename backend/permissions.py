ROLE_PERMISSIONS = {
    "user": ["read_own_profile", "update_own_profile"],
    "admin": [
        "read_own_profile",
        "update_own_profile",
        "read_all_users",
        "delete_users",
        "manage_roles",
    ],
}


def resolve_permissions(role_names):
    permissions = set()
    for role_name in role_names:
        permissions.update(ROLE_PERMISSIONS.get(role_name, []))
    return sorted(permissions)
