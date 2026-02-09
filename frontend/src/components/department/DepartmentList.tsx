import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Modal } from '../common/Modal';
import { DepartmentTable } from './DepartmentTable';
import { DepartmentForm } from './DepartmentForm';
import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from '../../hooks/useDepartments';
import { Toast, ToastContainer, useToast } from '../common/Toast';
import { getErrorMessage } from '../../utils/errorHandler';
import type { Department } from '../../types/employee.types';
import type { DepartmentFormData, UpdateDepartmentFormData } from '../../schemas/employee.schema';

export const DepartmentList: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const { toasts, success, error, removeToast } = useToast();

  const { data, isLoading } = useDepartments();
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  const departments = data?.data || [];

  const handleCreate = (formData: DepartmentFormData) => {
    createMutation.mutate(formData, {
      onSuccess: (response) => {
        success(`Department "${response.data.departmentName}" created successfully!`);
        setIsCreateModalOpen(false);
      },
      onError: (err) => {
        error(getErrorMessage(err));
      },
    });
  };

  const handleUpdate = (formData: UpdateDepartmentFormData) => {
    if (!editingDepartment) return;

    updateMutation.mutate(
      { id: editingDepartment.id, data: formData },
      {
        onSuccess: (response) => {
          success(`Department "${response.data.departmentName}" updated successfully!`);
          setEditingDepartment(null);
        },
        onError: (err) => {
          error(getErrorMessage(err));
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        success('Department deleted successfully!');
      },
      onError: (err) => {
        error(getErrorMessage(err));
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading departments..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Department Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage organizational departments
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Table */}
      <DepartmentTable
        departments={departments}
        onEdit={setEditingDepartment}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Department"
        size="md"
      >
        <DepartmentForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingDepartment}
        onClose={() => setEditingDepartment(null)}
        title="Edit Department"
        size="md"
      >
        {editingDepartment && (
          <DepartmentForm
            mode="edit"
            department={editingDepartment}
            onSubmit={handleUpdate}
            onCancel={() => setEditingDepartment(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>
    </div>
  );
};

