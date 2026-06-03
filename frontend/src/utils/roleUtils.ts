import { User } from '../types/auth';

export const hasRole = (user: User | null, role: string): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
};

export const hasPermission = (
  user: User | null,
  permission: string
): boolean => {
  if (!user || !user.roles) return false;

  // Define role permissions
  const rolePermissions: Record<string, string[]> = {
    user: ['read_own_profile', 'update_own_profile'],
    admin: [
      'read_own_profile',
      'update_own_profile',
      'read_all_users',
      'delete_users',
      'manage_roles',
    ],
  };

  // Check if user has any role that has the required permission
  return user.roles.some(role => rolePermissions[role]?.includes(permission));
};

export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin');
};

export const isUser = (user: User | null): boolean => {
  return hasRole(user, 'user');
};

export const getRoleDisplayText = (user: User | null): string => {
  if (!user || !user.roles || user.roles.length === 0) return 'No Role';

  if (isAdmin(user)) return 'Admin';
  if (isUser(user)) return 'User';

  return user.roles.join(', ');
};

export const canAccessAdminFeatures = (user: User | null): boolean => {
  return isAdmin(user);
};

export const canManageUsers = (user: User | null): boolean => {
  return hasPermission(user, 'read_all_users');
};
