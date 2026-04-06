// src/hooks/useDashboardPath.ts
import { useAuthStore } from '../stores/authStore';

export const useDashboardPath = (): string => {
  const { user } = useAuthStore();

  if (!user?.roleName) return '/auth/login';

switch (user.roleName) {
  case 'SUPER_ADMIN':
    return '/super-admin';
  case 'ADMIN':      
    return '/admin';
  case 'FIELD_ASSOCIATE':
    return '/field-associate/dashboard';
  case 'ASSOCIATE':
  default:
    return '/operations/dashboard';
}

};
