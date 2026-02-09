import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { changePasswordSchema, type ChangePasswordFormData } from '../../schemas/auth.schema';
import { changePassword } from '../../services/api/auth.api';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { PASSWORD_REQUIREMENTS } from '../../utils/constants';
import { getErrorMessage } from '../../utils/errorHandler';

export const ChangePasswordForm: React.FC = () => {
  const { logout } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = watch('newPassword', '');

  // Password strength checker
  const checkRequirement = (requirement: string): boolean => {
    switch (requirement) {
      case 'At least 8 characters':
        return newPassword.length >= 8;
      case 'At least 1 uppercase letter':
        return /[A-Z]/.test(newPassword);
      case 'At least 1 lowercase letter':
        return /[a-z]/.test(newPassword);
      case 'At least 1 number':
        return /[0-9]/.test(newPassword);
      case 'At least 1 special character (@#$%^&+=!)':
        return /[@#$%^&+=!]/.test(newPassword);
      default:
        return false;
    }
  };

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setSuccessMessage(
        'Password changed successfully! You will be logged out in 3 seconds. Please login with your new password.'
      );
      reset();
      
      // Auto logout after 3 seconds
      setTimeout(() => {
        logout();
      }, 3000);
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    setSuccessMessage('');
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {changePasswordMutation.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {getErrorMessage(changePasswordMutation.error)}
        </div>
      )}

      {/* Current Password */}
      <div className="relative">
        <Input
          label="Current Password"
          type={showCurrentPassword ? 'text' : 'password'}
          placeholder="Enter your current password"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
          required
        />
        <button
          type="button"
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
        >
          {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {/* New Password */}
      <div className="relative">
        <Input
          label="New Password"
          type={showNewPassword ? 'text' : 'password'}
          placeholder="Enter your new password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
          required
        />
        <button
          type="button"
          onClick={() => setShowNewPassword(!showNewPassword)}
          className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
        >
          {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {/* Password Requirements */}
      {newPassword && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
          <ul className="space-y-1">
            {PASSWORD_REQUIREMENTS.map((requirement) => {
              const isValid = checkRequirement(requirement);
              return (
                <li key={requirement} className="flex items-center gap-2 text-sm">
                  <CheckCircle2
                    className={`h-4 w-4 ${
                      isValid ? 'text-green-600' : 'text-gray-400'
                    }`}
                  />
                  <span className={isValid ? 'text-green-600' : 'text-gray-600'}>
                    {requirement}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Confirm Password */}
      <div className="relative">
        <Input
          label="Confirm New Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Re-enter your new password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
        >
          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        isLoading={changePasswordMutation.isPending}
        disabled={!!successMessage}
      >
        Change Password
      </Button>

      {/* Warning */}
      <p className="text-sm text-gray-500 text-center">
        After changing your password, you will be automatically logged out and need to login again.
      </p>
    </form>
  );
};
