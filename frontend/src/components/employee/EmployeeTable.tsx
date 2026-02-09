import React, { useState } from 'react';
import { Edit, Trash2, Eye, KeyRound } from 'lucide-react'; // ✅ Added KeyRound
import { Badge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Modal } from '../common/Modal'; // ✅ Added Modal
import { AdminResetPasswordForm } from '../admin/AdminResetPasswordForm'; // ✅ Added
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../common/Table';
import type { Employee } from '../../types/employee.types';

interface EmployeeTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (empId: string) => void;
  isDeleting?: boolean;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onView,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [resetPasswordEmployee, setResetPasswordEmployee] = useState<Employee | null>(null); // ✅ Added

  const handleDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No employees found</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableHead>Employee ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.empId}>
              <TableCell>
                <span className="font-medium text-gray-900">{employee.empId}</span>
              </TableCell>
              <TableCell>
                <span className="font-medium text-gray-900">{employee.fullName}</span>
              </TableCell>
              <TableCell>
                <span className="text-gray-600">{employee.email}</span>
              </TableCell>
              <TableCell>
                <span className="text-gray-900">{employee.departmentName}</span>
              </TableCell>
              <TableCell>
                <span className="text-gray-900">{employee.roleName}</span>
              </TableCell>
              <TableCell>
                <Badge variant={employee.isActive ? 'success' : 'error'}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onView(employee)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(employee)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {/* ✅ Added Reset Password Button */}
                  <button
                    onClick={() => setResetPasswordEmployee(employee)}
                    className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                    title="Reset Password"
                  >
                    <KeyRound className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(employee.empId)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
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
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action will soft-delete the employee and they will no longer be able to access the system."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />

      {/* ✅ Added Reset Password Modal */}
      <Modal
        isOpen={!!resetPasswordEmployee}
        onClose={() => setResetPasswordEmployee(null)}
        title="Reset Employee Password"
        size="md"
      >
        {resetPasswordEmployee && (
          <AdminResetPasswordForm
            employee={resetPasswordEmployee}
            onSuccess={() => setResetPasswordEmployee(null)}
            onCancel={() => setResetPasswordEmployee(null)}
          />
        )}
      </Modal>
    </>
  );
};
