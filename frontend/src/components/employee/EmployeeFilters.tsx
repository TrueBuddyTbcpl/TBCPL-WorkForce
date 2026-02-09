import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useDepartments } from '../../hooks/useDepartments';
import { useRoles } from '../../hooks/useRoles';
import type { Department, Role } from '../../types/employee.types';

interface EmployeeFiltersProps {
  onDepartmentChange: (departmentId: number | undefined) => void;
  onRoleChange: (roleId: number | undefined) => void;
  onSearchChange: (search: string) => void;
  selectedDepartment?: number;
  selectedRole?: number;
  searchQuery: string;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  onDepartmentChange,
  onRoleChange,
  onSearchChange,
  selectedDepartment,
  selectedRole,
  searchQuery,
}) => {
  const { data: departmentsResponse } = useDepartments();
  const { data: rolesResponse } = useRoles();

  const departments: Department[] = departmentsResponse?.data || [];
  const roles: Role[] = rolesResponse?.data || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="font-medium text-gray-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Department Filter */}
        <select
          value={selectedDepartment || ''}
          onChange={(e) =>
            onDepartmentChange(e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Departments</option>
          {departments.map((dept: Department) => (
            <option key={dept.id} value={dept.id}>
              {dept.departmentName}
            </option>
          ))}
        </select>

        {/* Role Filter */}
        <select
          value={selectedRole || ''}
          onChange={(e) =>
            onRoleChange(e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Roles</option>
          {roles.map((role: Role) => (
            <option key={role.id} value={role.id}>
              {role.roleName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
