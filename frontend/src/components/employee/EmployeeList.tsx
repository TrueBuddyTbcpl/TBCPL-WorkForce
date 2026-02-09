import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Pagination } from '../common/Pagination';
import { EmployeeFilters } from './EmployeeFilters';
import { EmployeeTable } from './EmployeeTable';
import { EmployeeDetails } from './EmployeeDetails';
import { useEmployees, useDeleteEmployee } from '../../hooks/useEmployees';
import { getErrorMessage } from '../../utils/errorHandler';
import type { Employee } from '../../types/employee.types';

interface EmployeeListProps {
  onCreateClick: () => void;
  onEditClick: (employee: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ onCreateClick, onEditClick }) => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [departmentFilter, setDepartmentFilter] = useState<number | undefined>();
  const [roleFilter, setRoleFilter] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const { data, isLoading, error } = useEmployees({
    page,
    size,
    departmentId: departmentFilter,
    roleId: roleFilter,
  });

  const deleteEmployeeMutation = useDeleteEmployee();

  const handleDelete = (empId: string) => {
    deleteEmployeeMutation.mutate(empId);
  };

  // Filter employees by search query (client-side)
  const filteredEmployees = data?.data?.employees?.filter((emp: Employee) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      emp.fullName.toLowerCase().includes(searchLower) ||
      emp.email.toLowerCase().includes(searchLower) ||
      emp.empId.toLowerCase().includes(searchLower)
    );
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading employees..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{getErrorMessage(error)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage employee accounts and permissions
          </p>
        </div>
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <EmployeeFilters
        onDepartmentChange={setDepartmentFilter}
        onRoleChange={setRoleFilter}
        onSearchChange={setSearchQuery}
        selectedDepartment={departmentFilter}
        selectedRole={roleFilter}
        searchQuery={searchQuery}
      />

      {/* Table */}
      <EmployeeTable
        employees={filteredEmployees}
        onView={setSelectedEmployee}
        onEdit={onEditClick}
        onDelete={handleDelete}
        isDeleting={deleteEmployeeMutation.isPending}
      />

      {/* Pagination */}
      {data?.data && (
        <Pagination
          currentPage={data.data.currentPage}
          totalPages={data.data.totalPages}
          onPageChange={setPage}
          totalElements={data.data.totalElements}
          pageSize={data.data.pageSize}
        />
      )}

      {/* Employee Details Modal */}
      <EmployeeDetails
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
};
