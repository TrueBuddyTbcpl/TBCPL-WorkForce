import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../../schemas/auth.schema';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuthStore } from '../../stores/authStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { login, isLoggingIn, loginError, resetLoginError } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) { // ✅ Check both conditions
      console.log('Already authenticated, redirecting...'); // Debug
      console.log('User role:', user.roleName); // Debug
      
      // ✅ Check admin role with null safety
      const isAdmin = user?.roleName === 'SUPER_ADMIN' || user?.roleName === 'HR_MANAGER';
      const defaultRoute = isAdmin ? '/admin' : '/operations/dashboard';
      
      console.log('Default route:', defaultRoute); // Debug
      
      const from = (location.state as any)?.from?.pathname || defaultRoute;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  // Clear login error when component unmounts
  useEffect(() => {
    return () => {
      resetLoginError();
    };
  }, [resetLoginError]);

  const onSubmit = (data: LoginFormData) => {
    console.log('Submitting login...'); // Debug
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            TBCPL Workforce
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
          {/* Error Message */}
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {loginError}
            </div>
          )}

          {/* Email Input */}
          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="firstname.lastname.YYYY@gnsp.co.in"
              error={errors.email?.message}
              {...register('email')}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoggingIn}
          >
            Sign In
          </Button>

          {/* Info Text */}
          <p className="text-xs text-center text-gray-500 mt-4">
            For security reasons, you can only be logged in on one device at a time.
          </p>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Need help? Contact your system administrator.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
