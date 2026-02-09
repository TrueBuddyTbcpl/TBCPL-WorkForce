import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../common/Table';
import type { Role } from '../../types/employee.types';

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleDelete = () => {
    if (deleteConfirm !== null) {
      onDelete(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (roles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No roles found</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableHead>Role Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>
                <span className="font-medium text-gray-900">{role.roleName}</span>
              </TableCell>
              <TableCell>
                <Badge variant={role.isActive ? 'success' : 'error'}>
                  {role.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-gray-900">{role.createdBy}</span>
              </TableCell>
              <TableCell>
                <span className="text-gray-600">{formatDate(role.createdAt)}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(role)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(role.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                    disabled={role.createdBy === 'SYSTEM'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Role"
        message="Are you sure you want to delete this role? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};
