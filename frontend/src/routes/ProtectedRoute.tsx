import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { SessionExpiredModal } from '../components/common/SessionExpiredModal';
import { resetSessionExpiredFlag } from '../lib/api-client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isTokenExpired, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);

  // ✅ Listen for session expiry event from API interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      setShowSessionExpiredModal(true);
    };
    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, []);

  // ✅ Handle modal confirmation
  const handleSessionExpiredConfirm = () => {
    setShowSessionExpiredModal(false);
    logout(); // Clear Zustand store
    resetSessionExpiredFlag(); // Reset axios interceptor flag
    navigate('/auth/login', { replace: true, state: { from: location } });
  };

  // ✅ Check if user is authenticated and token is not expired
  if (!isAuthenticated || isTokenExpired()) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {children}
      <SessionExpiredModal
        isOpen={showSessionExpiredModal}
        onConfirm={handleSessionExpiredConfirm}
      />
    </>
  );
};
