import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to monitor token expiry and auto-logout
 */
export const useTokenExpiry = () => {
  const { isTokenExpired, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Check token expiry every minute
    const interval = setInterval(() => {
      if (isTokenExpired()) {
        console.log('Token expired - logging out');
        logout();
        navigate('/auth/login');
        alert('Your session has expired. Please login again.');
      }
    }, 60000); // Check every 1 minute

    // Cleanup
    return () => clearInterval(interval);
  }, [isAuthenticated, isTokenExpired, logout, navigate]);
};
