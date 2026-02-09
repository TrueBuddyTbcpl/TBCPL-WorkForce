import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, Plus, Users, Eye, Mail, ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import type { 
  Employee, EmployeeFilters, CreateEmployeeRequest, Department, Role 
} from '../../types/employee.types';
import type { ApiResponse } from '../../types/auth.types';
import { getEmployees, createEmployee } from '../../services/api/employee.api';
import { getDepartments } from '../../services/api/department.api';
import { getRoles } from '../../services/api/role.api';
import { toast } from 'sonner';
import { AUTH_QUERY_KEYS } from '../../utils/constants';

interface EmployeeManagementProps {
  department?: Department;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ department }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState<EmployeeFilters>({
    page: 0,
    size: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        setFilters(prev => ({ ...prev, page: 0, search: searchTerm.trim() }));
      } else {
        setFilters(prev => ({ ...prev, search: undefined }));
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Employees query
  const { 
    data: employeeResponse, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: [AUTH_QUERY_KEYS.EMPLOYEES, filters],
    queryFn: () => getEmployees(filters),
    placeholderData: {
      success: true,
      message: "Loading...",
      timestamp: new Date().toISOString(),
      data: {
        employees: [],
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 10
      }
    } as ApiResponse<any>,
  });

  // Departments query
  const { data: departmentsResponse } = useQuery({
    queryKey: [AUTH_QUERY_KEYS.DEPARTMENTS],
    queryFn: getDepartments,
    placeholderData: {
      success: true,
      message: "",
      timestamp: new Date().toISOString(),
      data: []
    } as ApiResponse<Department[]>,
  });

  // Roles query
  const { data: rolesResponse } = useQuery({
    queryKey: [AUTH_QUERY_KEYS.ROLES],
    queryFn: getRoles,
    placeholderData: {
      success: true,
      message: "",
      timestamp: new Date().toISOString(),
      data: []
    } as ApiResponse<Role[]>,
  });

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      toast.success('Employee created successfully!');
      setShowAddModal(false);
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.EMPLOYEES] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create employee');
    },
  });

  // Safe data extraction
  const employees: Employee[] = employeeResponse?.data?.employees ?? [];
  const totalPages: number = employeeResponse?.data?.totalPages ?? 0;
  const currentPage: number = employeeResponse?.data?.currentPage ?? 0;
  const totalElements: number = employeeResponse?.data?.totalElements ?? 0;
  const departments: Department[] = departmentsResponse?.data ?? [];
  const roles: Role[] = rolesResponse?.data ?? [];

  const updateFilter = (key: keyof EmployeeFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 0 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Debug component mount
  useEffect(() => {
    console.log('🎯 EmployeeManagement mounted');
    console.log('📊 Current filters:', filters);
  }, [filters]);

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <p className="text-red-600">Error loading employees. Please try again.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* 🧪 DEBUG BUTTON - Remove after testing */}
      <button 
        onClick={async () => {
          console.log('🧪 MANUAL TEST STARTED');
          try {
            const testData = await getEmployees({ page: 0, size: 5 });
            console.log('✅ TEST SUCCESS:', testData);
            alert('API Test Success! Check console for details.');
          } catch (err) {
            console.error('❌ TEST FAILED:', err);
            alert('API Test Failed! Check console for details.');
          }
        }}
        className="fixed top-20 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-purple-700 text-sm font-bold"
      >
        🧪 Test API
      </button>

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Employee Management
            {department && ` - ${department.departmentName}`}
          </h2>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or empId..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            disabled={createMutation.isPending}
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
        <select
          value={filters.departmentId?.toString() || ''}
          onChange={(e) => updateFilter('departmentId', e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.departmentName}
            </option>
          ))}
        </select>
        <select
          value={filters.roleId?.toString() || ''}
          onChange={(e) => updateFilter('roleId', e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.roleName}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No employees found</p>
            {searchTerm && <p className="text-sm text-gray-500 mt-1">Search: "{searchTerm}"</p>}
            <p className="text-xs text-gray-400 mt-2">
              Total in DB: {totalElements} | Current Page: {currentPage + 1}/{totalPages || 1}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {employees.map((employee) => (
                <div
                  key={employee.empId}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600">
                      {employee.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{employee.fullName}</h3>
                          <p className="text-sm text-gray-600 truncate">
                            {employee.roleName} • {employee.departmentName}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">{employee.empId}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/admin/employee/${encodeURIComponent(employee.empId)}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm whitespace-nowrap"
                        >
                          <Eye className="w-4 h-4" />
                          View Profile
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {employee.empId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          Status:{' '}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            employee.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Page {currentPage + 1} of {totalPages} • {totalElements.toLocaleString()} total employees
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm font-medium text-gray-700">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* AddEmployeeModal */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          departments={departments}
          roles={roles}
          loading={createMutation.isPending}
        />
      )}
    </div>
  );
};

interface AddEmployeeModalProps {
  onClose: () => void;
  onSubmit: (data: CreateEmployeeRequest) => void;
  departments: Department[];
  roles: Role[];
  loading: boolean;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  onClose,
  onSubmit,
  departments,
  roles,
  loading
}) => {
  const [formData, setFormData] = useState<CreateEmployeeRequest>({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    password: '',
    departmentId: 0,
    roleId: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              Add New Employee
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              disabled={loading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
            <input
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
            <input
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Middle Name</label>
            <input
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="john.doe@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Secure password..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Department *</label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value={0}>Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role *</label>
              <select
                required
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value={0}>Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.roleName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.departmentId || !formData.roleId}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                'Create Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeManagement;
