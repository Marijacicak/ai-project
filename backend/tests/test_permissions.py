from permissions import resolve_permissions

USER_PERMISSIONS = ["read_own_profile", "update_own_profile"]
ADMIN_PERMISSIONS = [
    "delete_users",
    "manage_roles",
    "read_all_users",
    "read_own_profile",
    "update_own_profile",
]


def test_user_role_resolves_to_own_profile_permissions():
    assert resolve_permissions(["user"]) == USER_PERMISSIONS


def test_admin_role_resolves_to_full_permission_set():
    assert resolve_permissions(["admin"]) == ADMIN_PERMISSIONS


def test_unknown_role_resolves_to_no_permissions():
    assert resolve_permissions(["ghost"]) == []


def test_no_roles_resolves_to_no_permissions():
    assert resolve_permissions([]) == []


def test_multiple_roles_resolve_to_union_without_duplicates():
    assert resolve_permissions(["user", "admin", "admin"]) == ADMIN_PERMISSIONS
