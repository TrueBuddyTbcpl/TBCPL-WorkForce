import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search, Plus, Users, Eye, Mail, ChevronLeft, ChevronRight, X, UserCheck
} from 'lucide-react';
import type {
  Employee, EmployeeFilters, CreateEmployeeRequest, Department, Role
} from '../../types/employee.types';
import type { ApiResponse } from '../../types/auth.types';
import { getEmployees, createEmployee, getReportingManagers } from '../../services/api/employee.api';
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

  const [filters, setFilters] = useState<EmployeeFilters>({ page: 0, size: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

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

  const { data: employeeResponse, isLoading, error } = useQuery({
    queryKey: [AUTH_QUERY_KEYS.EMPLOYEES, filters],
    queryFn: () => getEmployees(filters),
    placeholderData: {
      success: true, message: 'Loading...', timestamp: new Date().toISOString(),
      data: { employees: [], currentPage: 0, totalPages: 0, totalElements: 0, pageSize: 10 }
    } as ApiResponse<any>,
  });

  const { data: departmentsResponse } = useQuery({
    queryKey: [AUTH_QUERY_KEYS.DEPARTMENTS],
    queryFn: getDepartments,
    placeholderData: { success: true, message: '', timestamp: new Date().toISOString(), data: [] } as ApiResponse<Department[]>,
  });

  const { data: rolesResponse } = useQuery({
    queryKey: [AUTH_QUERY_KEYS.ROLES],
    queryFn: getRoles,
    placeholderData: { success: true, message: '', timestamp: new Date().toISOString(), data: [] } as ApiResponse<Role[]>,
  });

  const { data: reportingManagersResponse } = useQuery({
    queryKey: [AUTH_QUERY_KEYS.REPORTING_MANAGERS],
    queryFn: getReportingManagers,
    placeholderData: { success: true, message: '', timestamp: new Date().toISOString(), data: [] } as ApiResponse<Employee[]>,
  });

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      toast.success('Employee created successfully! Verification email sent.');
      setShowAddModal(false);
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.EMPLOYEES] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create employee');
    },
  });

  // REPLACE WITH:
  const pageData = employeeResponse?.data as any;
  const employees: Employee[] = pageData?.content ?? [];
  const totalPages: number = pageData?.totalPages ?? 0;
  const currentPage: number = pageData?.number ?? 0;
  const totalElements: number = pageData?.totalElements ?? 0;
  const departments: Department[] = departmentsResponse?.data ?? [];
  const roles: Role[] = rolesResponse?.data ?? [];
  const reportingManagers: Employee[] = reportingManagersResponse?.data ?? [];


  const updateFilter = (key: keyof EmployeeFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 0 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <p className="text-red-600">Error loading employees. Please try again.</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">

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
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
          ))}
        </select>
        <select
          value={filters.roleId?.toString() || ''}
          onChange={(e) => updateFilter('roleId', e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>{role.roleName}</option>
          ))}
        </select>
      </div>

      {/* Employee List */}
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
                    {/* Avatar */}
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
                          onClick={() => navigate(`/admin/employee/${employee.id}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm whitespace-nowrap"
                        >
                          <Eye className="w-4 h-4" />
                          View Profile
                        </button>
                      </div>

                      {/* 4-column info grid */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 flex-shrink-0 text-gray-400" />
                          <span className="truncate">{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {employee.empId}
                          </span>
                        </div>
                        {/* Reporting Manager column */}
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 flex-shrink-0 text-gray-400" />
                          {employee.reportingManagerName ? (
                            <span className="truncate text-xs">
                              <span className="text-gray-500">Reports to: </span>
                              <span className="font-medium text-gray-700">{employee.reportingManagerName}</span>
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No reporting manager</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          Status:{' '}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.isActive
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
          reportingManagers={reportingManagers}
          loading={createMutation.isPending}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AddEmployeeModal
// ─────────────────────────────────────────────────────────────────────────────

interface AddEmployeeModalProps {
  onClose: () => void;
  onSubmit: (data: CreateEmployeeRequest) => void;
  departments: Department[];
  roles: Role[];
  reportingManagers: Employee[];
  loading: boolean;
}

const EMAIL_DOMAINS = ['tbcpl.co.in', 'gnsp.co.in'];

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  onClose, onSubmit, departments, roles, reportingManagers, loading
}) => {
  const [formData, setFormData] = useState<CreateEmployeeRequest>({
    firstName: '',
    lastName: '',
    middleName: '',
    emailPrefix: '',           // ← CHANGED: custom prefix
    emailDomain: 'tbcpl.co.in',
    password: '',
    departmentId: 0,
    roleId: 0,
    reportingManagerEmpId: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [managerSearch, setManagerSearch] = useState('');

  const filteredManagers = reportingManagers.filter((m) =>
    managerSearch.trim() === '' ||
    m.fullName.toLowerCase().includes(managerSearch.toLowerCase()) ||
    m.empId.toLowerCase().includes(managerSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.departmentId || !formData.roleId) return;
    if (!formData.emailPrefix?.trim()) return;

    const payload = {
      ...formData,
      emailPrefix: formData.emailPrefix.trim().toLowerCase(),
      reportingManagerEmpId: formData.reportingManagerEmpId?.trim() || undefined,
      middleName: formData.middleName?.trim() || undefined,
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              Add New Employee
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all" disabled={loading}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          {/* ── Honeypot: absorbs browser autofill — DO NOT REMOVE ── */}
          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
            <input type="text" name="username" tabIndex={-1} readOnly />
            <input type="password" name="password" tabIndex={-1} readOnly />
            <input type="email" name="email" tabIndex={-1} readOnly />
          </div>
          {/* ────────────────────────────────────────────────────────── */}

          {/* rest of your form fields below — unchanged */}


          {/* Row 1: First + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
              <input
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="John"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
              <input
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Doe"
                disabled={loading}
              />
            </div>
          </div>

          {/* Row 2: Middle Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Middle Name <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Optional"
              disabled={loading}
            />
          </div>

          {/* Row 3: Email Prefix + Domain — CHANGED FROM AUTO-GEN TO CUSTOM */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <div className="flex">
              <input
                required
                type="text"
                value={formData.emailPrefix}
                onChange={(e) => setFormData({ ...formData, emailPrefix: e.target.value })}
                disabled={loading}
                placeholder="e.g. john.doe / john.doe2025"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-l-lg focus:ring-2
                  focus:ring-green-500 focus:z-10 disabled:bg-gray-50"
              />
              <span className="flex items-center px-3 bg-gray-100 border-t border-b
                border-gray-200 text-gray-500 text-sm font-medium select-none">
                @
              </span>
              <select
                value={formData.emailDomain}
                onChange={(e) => setFormData({ ...formData, emailDomain: e.target.value })}
                disabled={loading}
                className="px-3 py-2 border border-l-0 border-gray-200 rounded-r-lg bg-gray-50
                  focus:ring-2 focus:ring-green-500 text-sm disabled:bg-gray-100 cursor-pointer"
              >
                {EMAIL_DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>

            {/* Amber warning — always visible */}
            <p className="text-xs text-amber-600 mt-1.5 font-medium">
              ⚠ The email prefix must match the company-provided email exactly.
            </p>

            {/* Live preview — only when prefix is typed */}
            {formData.emailPrefix && (
              <p className="text-xs text-blue-600 mt-1 font-medium">
                📧 Preview: {formData.emailPrefix.toLowerCase()}@{formData.emailDomain}
              </p>
            )}
          </div>

          {/* Row 4: Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Min 8 characters"
                disabled={loading}
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Row 5: Department + Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Department *</label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                disabled={loading}
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
                disabled={loading}
              >
                <option value={0}>Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.roleName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 6: Reporting Manager */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-gray-500" />
                Reporting Manager
                <span className="text-xs text-gray-400 font-normal">(Optional)</span>
              </div>
            </label>
            <div className="relative mb-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or empId..."
                value={managerSearch}
                onChange={(e) => setManagerSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                disabled={loading}
              />
            </div>
            <select
              value={formData.reportingManagerEmpId || ''}
              onChange={(e) => setFormData({ ...formData, reportingManagerEmpId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
              disabled={loading}
              size={filteredManagers.length > 0 ? Math.min(4, filteredManagers.length + 1) : 2}
            >
              <option value="">— No Reporting Manager —</option>
              {filteredManagers.map((manager) => (
                <option key={manager.empId} value={manager.empId}>
                  {manager.fullName} ({manager.empId}) · {manager.roleName}
                </option>
              ))}
            </select>
            {formData.reportingManagerEmpId && (
              <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800 font-medium">
                    {reportingManagers.find(m => m.empId === formData.reportingManagerEmpId)?.fullName}
                  </span>
                  <span className="text-xs text-green-600">({formData.reportingManagerEmpId})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, reportingManagerEmpId: '' })}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
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
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700
                disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
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
