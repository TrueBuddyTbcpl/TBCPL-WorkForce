import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { loginUser, logoutUser, resendVerificationEmail } from '../services/api/auth.api';
import { getDeviceFingerprint, getUserIP } from '../utils/deviceFingerprint';
import { getErrorMessage } from '../utils/errorHandler';
import type { LoginFormData } from '../schemas/auth.schema';
import { queryClient } from '../lib/queryClient';
import { toast } from 'sonner';

export const useAuth = () => {
  const navigate = useNavigate();
  const { login, logout, user, isAuthenticated, isTokenExpired } = useAuthStore();

  // Login mutation
  // In useAuth.ts — update loginMutation:

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const deviceId = getDeviceFingerprint();
      const ipAddress = await getUserIP();
      return loginUser({ ...credentials, deviceId, ipAddress });
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { token, expiresIn, empId, email, fullName, departmentName, roleName } = response.data;
        login(token, { empId, email, fullName, departmentName, roleName }, expiresIn);

        // ── Role-based redirect after login ───────────────────────────────────
        let redirectPath: string;

        switch (roleName) {
          case 'SUPER_ADMIN':
            redirectPath = '/super-admin';
            break;
          case 'ADMIN':         
            redirectPath = '/admin';
            break;
          case 'FIELD_ASSOCIATE':
            redirectPath = '/field-associate/dashboard';
            break;
          case 'ASSOCIATE':
          default:
            redirectPath = '/operations/dashboard';
            break;
        }

        navigate(redirectPath, { replace: true });
      }
    },


    // ← REPLACE your existing onError:
    onError: (error: any) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || '';

      if (status === 403 && message.toLowerCase().includes('not verified')) {
        // ← Email verification specific — show info toast, NOT error
        toast.info('📧 ' + message, {
          duration: 8000,
          position: 'top-center',
          description: 'Please check your inbox (and spam folder) for the verification link.',
        });
      } else if (status === 409) {
        toast.error(message || 'You are already logged in on another device.', {
          duration: 5000,
          position: 'top-center',
        });
      } else {
        // Generic error — will show in the loginError state on the form
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
    onError: () => {
      // ✅ Even if API call fails completely, clear local auth data
      console.log('⚠️ Logout API failed, clearing local session anyway');
      logout();
      queryClient.clear();
      navigate('/auth/login', { replace: true });
    },
  });

  // Resend verification email
  const resendMutation = useMutation({
    mutationFn: async (email: string) => {
      const deviceId = getDeviceFingerprint();
      const ipAddress = await getUserIP();
      return resendVerificationEmail({ email, deviceId, ipAddress });
    },
    onSuccess: () => {
      toast.success('Verification email sent! Check your inbox (and spam folder).', {
        duration: 5000,
        position: 'top-center',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to resend verification email.';
      toast.error(message, { duration: 5000 });
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
    resendVerification: resendMutation.mutate,
    isResending: resendMutation.isPending,
  };
};
