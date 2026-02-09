import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { adminResetPassword } from '../../services/api/admin.api';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { PASSWORD_REQUIREMENTS } from '../../utils/constants';
import type { Employee } from '../../types/employee.types';

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@#$%^&+=!]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface AdminResetPasswordFormProps {
  employee: Employee;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminResetPasswordForm: React.FC<AdminResetPasswordFormProps> = ({
  employee,
  onSuccess,
  onCancel,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPassword = watch('newPassword', '');

  const resetPasswordMutation = useMutation({
    mutationFn: adminResetPassword,
    onSuccess: () => {
      setSuccessMessage(
        `Password reset successful for ${employee.fullName}. The employee can now login with the new password.`
      );
      setTimeout(() => {
        onSuccess();
      }, 3000);
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate({
      empId: employee.empId,
      newPassword: data.newPassword,
    });
  };

  const checkRequirement = (requirement: string): boolean => {
    switch (requirement) {
      case 'At least 8 characters':
        return newPassword?.length >= 8;
      case 'At least 1 uppercase letter':
        return /[A-Z]/.test(newPassword || '');
      case 'At least 1 lowercase letter':
        return /[a-z]/.test(newPassword || '');
      case 'At least 1 number':
        return /[0-9]/.test(newPassword || '');
      case 'At least 1 special character (@#$%^&+=!)':
        return /[@#$%^&+=!]/.test(newPassword || '');
      default:
        return false;
    }
  };

  const getErrorMessage = (error: any): string | undefined => {
    return error?.message as string | undefined;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Employee Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Resetting password for:
            </p>
            <p className="text-sm text-blue-800 mt-1">
              <span className="font-semibold">{employee.fullName}</span> ({employee.email})
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {resetPasswordMutation.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {getErrorMessage(resetPasswordMutation.error)}
        </div>
      )}

      {/* New Password */}
      <div className="relative">
        <Input
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter new password"
          error={getErrorMessage(errors.newPassword)}
          {...register('newPassword')}
          required
          disabled={!!successMessage}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          disabled={!!successMessage}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {/* Password Requirements */}
      {newPassword && !successMessage && (
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
          placeholder="Re-enter new password"
          error={getErrorMessage(errors.confirmPassword)}
          {...register('confirmPassword')}
          required
          disabled={!!successMessage}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          disabled={!!successMessage}
        >
          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {/* Warning */}
      {!successMessage && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> This will immediately reset the employee's password. 
            Make sure to communicate the new password securely to the employee.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={resetPasswordMutation.isPending || !!successMessage}
        >
          {successMessage ? 'Close' : 'Cancel'}
        </Button>
        {!successMessage && (
          <Button
            type="submit"
            isLoading={resetPasswordMutation.isPending}
            variant="danger"
          >
            Reset Password
          </Button>
        )}
      </div>
    </form>
  );
};
