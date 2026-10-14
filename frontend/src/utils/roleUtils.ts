import { User } from '../types/auth';

export const hasRole = (user: User | null, role: string): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
};

export const hasPermission = (
  user: User | null,
  permission: string
): boolean => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
};

export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin');
};

export const getRoleDisplayText = (user: User | null): string => {
  if (!user || !user.roles || user.roles.length === 0) return 'No Role';

  if (isAdmin(user)) return 'Admin';
  if (hasRole(user, 'user')) return 'User';

  return user.roles.join(', ');
};
