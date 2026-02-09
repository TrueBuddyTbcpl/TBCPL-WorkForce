import React from 'react';
import {  Mail, User, Building2, Shield, Calendar, Clock } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import type { Employee } from '../../types/employee.types';

interface EmployeeDetailsProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  employee,
  isOpen,
  onClose,
}) => {
  if (!employee) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Employee Details" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pb-4 border-b">
          <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {employee.fullName.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{employee.fullName}</h3>
            <p className="text-sm text-gray-600">{employee.empId}</p>
          </div>
          <Badge variant={employee.isActive ? 'success' : 'error'}>
            {employee.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{employee.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="text-sm font-medium text-gray-900">{employee.departmentName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-sm font-medium text-gray-900">{employee.roleName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Created By</p>
              <p className="text-sm font-medium text-gray-900">{employee.createdBy}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(employee.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(employee.updatedAt)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Last Password Change</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(employee.lastPasswordChangeDate)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
