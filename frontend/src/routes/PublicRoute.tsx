// src/routes/PublicRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const getDashboardRoute = (roleName: string): string => {
  switch (roleName) {
    case 'SUPER_ADMIN':      return '/super-admin';
    case 'ADMIN':            return '/admin';
    case 'HR_MANAGER':       return '/admin';
    case 'ASSOCIATE':        return '/operations/dashboard';
    case 'FIELD_ASSOCIATE':  return '/field-associate/dashboard';
    default:                 return '/operations/dashboard';
  }
};

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    // ✅ Already logged in → redirect to their dashboard
    return <Navigate to={getDashboardRoute(user.roleName)} replace />;
  }

  // ✅ Not logged in → show the page (login form)
  return <>{children}</>;
};