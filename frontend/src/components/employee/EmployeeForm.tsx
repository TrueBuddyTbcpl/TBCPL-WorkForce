import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { createEmployeeSchema, updateEmployeeSchema } from '../../schemas/employee.schema';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useDepartments } from '../../hooks/useDepartments';
import { useRoles } from '../../hooks/useRoles';
import { PASSWORD_REQUIREMENTS } from '../../utils/constants';
import type { Employee, Department, Role } from '../../types/employee.types';

interface EmployeeFormProps {
  mode: 'create' | 'edit';
  employee?: Employee;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  mode,
  employee,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { data: departmentsResponse } = useDepartments();
  const { data: rolesResponse } = useRoles();

  const departments: Department[] = departmentsResponse?.data || [];
  const roles: Role[] = rolesResponse?.data || [];

  const schema = mode === 'create' ? createEmployeeSchema : updateEmployeeSchema;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: mode === 'edit' && employee ? {
      firstName: employee.firstName,
      middleName: employee.middleName || '',
      lastName: employee.lastName,
      departmentId: departments.find((d: Department) => d.departmentName === employee.departmentName)?.id,
      roleId: roles.find((r: Role) => r.roleName === employee.roleName)?.id,
      isActive: employee.isActive,
    } : undefined,
  });

  const password = watch('password', '');

  const checkRequirement = (requirement: string): boolean => {
    switch (requirement) {
      case 'At least 8 characters':
        return password?.length >= 8;
      case 'At least 1 uppercase letter':
        return /[A-Z]/.test(password || '');
      case 'At least 1 lowercase letter':
        return /[a-z]/.test(password || '');
      case 'At least 1 number':
        return /[0-9]/.test(password || '');
      case 'At least 1 special character (@#$%^&+=!)':
        return /[@#$%^&+=!]/.test(password || '');
      default:
        return false;
    }
  };

  // Helper to get error message as string
  const getErrorMessage = (error: any): string | undefined => {
    return error?.message as string | undefined;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email (Create only) */}
      {mode === 'create' && (
        <Input
          label="Email Address"
          type="email"
          placeholder="firstname.lastname.YYYY@gnsp.co.in"
          error={getErrorMessage(errors.email)}
          {...register('email')}
          required
        />
      )}

      {/* Password (Create only) */}
      {mode === 'create' && (
        <div>
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              error={getErrorMessage(errors.password)}
              {...register('password')}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Password Requirements */}
          {password && (
            <div className="bg-gray-50 p-4 rounded-lg mt-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
              <ul className="space-y-1">
                {PASSWORD_REQUIREMENTS.map((requirement) => {
                  const isValid = checkRequirement(requirement);
                  return (
                    <li key={requirement} className="flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className={`h-4 w-4 ${isValid ? 'text-green-600' : 'text-gray-400'}`}
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
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="First Name"
          type="text"
          placeholder="John"
          error={getErrorMessage(errors.firstName)}
          {...register('firstName')}
          required
        />
        <Input
          label="Middle Name"
          type="text"
          placeholder="Michael (Optional)"
          error={getErrorMessage(errors.middleName)}
          {...register('middleName')}
        />
        <Input
          label="Last Name"
          type="text"
          placeholder="Doe"
          error={getErrorMessage(errors.lastName)}
          {...register('lastName')}
          required
        />
      </div>

      {/* Department & Role */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            {...register('departmentId', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Department</option>
            {departments.map((dept: Department) => (
              <option key={dept.id} value={dept.id}>
                {dept.departmentName}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.departmentId)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            {...register('roleId', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Role</option>
            {roles.map((role: Role) => (
              <option key={role.id} value={role.id}>
                {role.roleName}
              </option>
            ))}
          </select>
          {errors.roleId && (
            <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.roleId)}</p>
          )}
        </div>
      </div>

      {/* Active Status (Edit only) */}
      {mode === 'edit' && (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            {...register('isActive')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Active Employee
          </label>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {mode === 'create' ? 'Create Employee' : 'Update Employee'}
        </Button>
      </div>
    </form>
  );
};
