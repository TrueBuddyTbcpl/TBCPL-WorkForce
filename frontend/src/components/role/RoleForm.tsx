import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema, updateRoleSchema } from '../../schemas/employee.schema';
import type { RoleFormData, UpdateRoleFormData } from '../../schemas/employee.schema';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { Role } from '../../types/employee.types';

interface RoleFormProps {
  mode: 'create' | 'edit';
  role?: Role;
  onSubmit: (data: RoleFormData | UpdateRoleFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const RoleForm: React.FC<RoleFormProps> = ({
  mode,
  role,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const schema = mode === 'create' ? roleSchema : updateRoleSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: mode === 'edit' && role ? {
      roleName: role.roleName,
      isActive: role.isActive,
    } : undefined,
  });

  const getErrorMessage = (error: any): string | undefined => {
    return error?.message as string | undefined;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Role Name */}
      <Input
        label="Role Name"
        type="text"
        placeholder="e.g., MANAGER, SUPER_ADMIN"
        error={getErrorMessage(errors.roleName)}
        {...register('roleName')}
        required
      />

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
            Active Role
          </label>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {mode === 'create' ? 'Create Role' : 'Update Role'}
        </Button>
      </div>
    </form>
  );
};
