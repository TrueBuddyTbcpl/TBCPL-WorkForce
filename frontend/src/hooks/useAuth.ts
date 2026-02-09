import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { loginUser, logoutUser } from '../services/api/auth.api';
import { getDeviceFingerprint, getUserIP } from '../utils/deviceFingerprint';
import { getErrorMessage } from '../utils/errorHandler';
import type { LoginFormData } from '../schemas/auth.schema';
import { queryClient } from '../lib/queryClient';

export const useAuth = () => {
  const navigate = useNavigate();
  const { login, logout, user, isAuthenticated, isTokenExpired } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const deviceId = getDeviceFingerprint();
      const ipAddress = await getUserIP();

      return loginUser({
        ...credentials,
        deviceId,
        ipAddress,
      });
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { token, expiresIn, empId, email, fullName, departmentName, roleName } = response.data;

        // Store in Zustand store (which also saves to localStorage)
        login(
          token,
          {
            empId,
            email,
            fullName,
            departmentName,
            roleName,
          },
          expiresIn
        );

        // ✅ Smart redirect based on role
        const isAdmin = roleName === 'SUPER_ADMIN' || roleName === 'HR_MANAGER';
        const redirectPath = isAdmin ? '/admin' : '/operations/dashboard';

        console.log('✅ Login Success - Role:', roleName);
        console.log('✅ Is Admin?', isAdmin);
        console.log('✅ Redirecting to:', redirectPath);

        navigate(redirectPath, { replace: true });
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        return await logoutUser();
      } catch (error: any) {
        // ✅ Ignore 403 errors during logout (session already expired)
        if (error?.response?.status === 403) {
          console.log('⚠️ Session already expired on server - proceeding with local logout');
          return { success: true }; // Return success anyway
        }
        throw error; // Re-throw other errors
      }
    },
    onSuccess: () => {
      console.log('✅ Logout successful');
      logout();
      queryClient.clear();
      navigate('/auth/login', { replace: true });
    },
    onError: (error: any) => {
      // ✅ Even if API call fails completely, clear local auth data
      console.log('⚠️ Logout API failed, clearing local session anyway');
      logout();
      queryClient.clear();
      navigate('/auth/login', { replace: true });
    },
  });

  return {
    user,
    isAuthenticated,
    isTokenExpired,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error ? getErrorMessage(loginMutation.error) : null,
    resetLoginError: loginMutation.reset,
  };
};
