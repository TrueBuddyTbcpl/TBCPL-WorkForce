import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Modal } from '../common/Modal';
import { RoleTable } from './RoleTable';
import { RoleForm } from './RoleForm';
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from '../../hooks/useRoles';
import { Toast, ToastContainer, useToast } from '../common/Toast';
import { getErrorMessage } from '../../utils/errorHandler';
import type { Role } from '../../types/employee.types';
import type { RoleFormData } from '../../schemas/employee.schema';


export const RoleList: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const { toasts, success, error, removeToast } = useToast();

  const { data, isLoading } = useRoles();
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const roles = data?.data || [];

  const handleCreate = (formData: RoleFormData) => {
    createMutation.mutate(formData, {
      onSuccess: (response) => {
        success(`Role "${response.data.roleName}" created successfully!`);
        setIsCreateModalOpen(false);
      },
      onError: (err) => {
        error(getErrorMessage(err));
      },
    });
  };

  const handleUpdate = (formData: any) => {
    if (!editingRole) return;

    updateMutation.mutate(
      { id: editingRole.id, data: formData },
      {
        onSuccess: (response) => {
          success(`Role "${response.data.roleName}" updated successfully!`);
          setEditingRole(null);
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
        success('Role deleted successfully!');
      },
      onError: (err) => {
        error(getErrorMessage(err));
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading roles..." />
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
          <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage user roles and permissions
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      {/* Table */}
      <RoleTable
        roles={roles}
        onEdit={setEditingRole}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Role"
        size="md"
      >
        <RoleForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingRole}
        onClose={() => setEditingRole(null)}
        title="Edit Role"
        size="md"
      >
        {editingRole && (
          <RoleForm
            mode="edit"
            role={editingRole}
            onSubmit={handleUpdate}
            onCancel={() => setEditingRole(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>
    </div>
  );
};
