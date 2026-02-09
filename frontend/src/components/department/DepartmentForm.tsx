import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { departmentSchema, updateDepartmentSchema } from '../../schemas/employee.schema';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { Department } from '../../types/employee.types';

interface DepartmentFormProps {
  mode: 'create' | 'edit';
  department?: Department;
  onSubmit: (data: any) => void; // ✅ Changed to any
  onCancel: () => void;
  isLoading?: boolean;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  mode,
  department,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const schema = mode === 'create' ? departmentSchema : updateDepartmentSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: mode === 'edit' && department ? {
      departmentName: department.departmentName,
      isActive: department.isActive,
    } : undefined,
  });

  const getErrorMessage = (error: any): string | undefined => {
    return error?.message as string | undefined;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Department Name */}
      <Input
        label="Department Name"
        type="text"
        placeholder="e.g., HR, Finance, Operations"
        error={getErrorMessage(errors.departmentName)}
        {...register('departmentName')}
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
            Active Department
          </label>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {mode === 'create' ? 'Create Department' : 'Update Department'}
        </Button>
      </div>
    </form>
  );
};
