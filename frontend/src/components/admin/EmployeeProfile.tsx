import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Employee, UpdateEmployeeRequest, Department, Role } from '../../types/employee.types';
import { getEmployeeById, updateEmployee, deleteEmployee } from '../../services/api/employee.api';
import { getDepartments } from '../../services/api/department.api';
import { getRoles } from '../../services/api/role.api';
import { toast } from 'sonner';
import { AUTH_QUERY_KEYS } from '../../utils/constants';
import {
  ArrowLeft, Mail, Calendar, User,
  Building2, Edit, Trash2, X, Save, UserCheck
} from 'lucide-react';

const EmployeeProfile: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Use numeric DB id — avoids %2F slash issue with empId in URL
  const numericId = employeeId ? Number(employeeId) : null;

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: employeeResponse, isLoading } = useQuery({
    queryKey: ['employee-detail', numericId],
    queryFn: () => getEmployeeById(numericId!),  // ← numeric id, uses /employees/{id}
    enabled: !!numericId && !isNaN(numericId),
    staleTime: 0,
    gcTime: 0,
  });

  const { data: departmentsResponse } = useQuery({
    queryKey: [AUTH_QUERY_KEYS.DEPARTMENTS],
    queryFn: getDepartments,
  });

  const { data: rolesResponse } = useQuery({
    queryKey: [AUTH_QUERY_KEYS.ROLES],
    queryFn: getRoles,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; updateData: UpdateEmployeeRequest }) =>
      updateEmployee(data.id, data.updateData),  // ← numeric id
    onSuccess: () => {
      toast.success('Employee updated successfully!');
      setShowEditModal(false);
      queryClient.invalidateQueries({ queryKey: ['employee-detail', numericId] });
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.EMPLOYEES] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update employee');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteEmployee(id),  // ← numeric id
    onSuccess: () => {
      toast.success('Employee deactivated successfully!');
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.EMPLOYEES] });
      navigate('/admin');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete employee');
    },
  });

  const employee: Employee | undefined = employeeResponse?.data;
  const departments: Department[] = departmentsResponse?.data || [];
  const roles: Role[] = rolesResponse?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Not Found</h2>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Admin Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Panel
          </button>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
              {employee.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {employee.fullName}
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  employee.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </span>
              </h1>
              <p className="text-gray-600">{employee.roleName} - {employee.departmentName}</p>
              <p className="text-xs text-gray-500 font-mono">{employee.empId}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Deactivate
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Email</p>
                <p className="text-sm font-medium text-gray-900 truncate">{employee.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="bg-purple-50 p-2 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Employee ID</p>
                <p className="text-sm font-medium text-gray-900 font-mono">{employee.empId}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Created At</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(employee.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-2 rounded-lg">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Department</p>
                <p className="text-sm font-medium text-gray-900">{employee.departmentName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Created By</p>
              <p className="text-base font-medium text-gray-900">{employee.createdBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-base font-medium text-gray-900">
                {new Date(employee.updatedAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </p>
            </div>
            {/* Reporting Manager */}
            <div>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <UserCheck className="w-4 h-4" /> Reporting Manager
              </p>
              {employee.reportingManagerName ? (
                <p className="text-base font-medium text-gray-900">
                  {employee.reportingManagerName}
                  <span className="text-xs text-gray-500 ml-1 font-mono">
                    ({employee.reportingManagerEmpId})
                  </span>
                </p>
              ) : (
                <p className="text-base text-gray-400 italic">Not assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditEmployeeModal
          employee={employee}
          departments={departments}
          roles={roles}
          onClose={() => setShowEditModal(false)}
          onSubmit={(updateData) =>
            updateMutation.mutate({ id: employee.id, updateData })  // ← numeric id
          }
          loading={updateMutation.isPending}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          employeeName={employee.fullName}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => deleteMutation.mutate(employee.id)}  // ← numeric id
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

// ── EditEmployeeModal ─────────────────────────────────────────────────────────
interface EditEmployeeModalProps {
  employee: Employee;
  departments: Department[];
  roles: Role[];
  onClose: () => void;
  onSubmit: (data: UpdateEmployeeRequest) => void;
  loading: boolean;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  employee, departments, roles, onClose, onSubmit, loading
}) => {
  const [formData, setFormData] = useState<UpdateEmployeeRequest>({
    firstName: employee.firstName,
    lastName: employee.lastName,
    middleName: employee.middleName || '',
    departmentId: departments.find(d => d.departmentName === employee.departmentName)?.id || 0,
    roleId: roles.find(r => r.roleName === employee.roleName)?.id || 0,
    isActive: employee.isActive,
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
              <Edit className="w-6 h-6 text-blue-600" />
              Edit Employee Profile
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" disabled={loading}>
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
            <input
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Middle Name</label>
            <input
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Department *</label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.roleName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active Employee
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.departmentId || !formData.roleId}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Updating...</>
              ) : (
                <><Save className="w-4 h-4" />Update Employee</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── DeleteConfirmationModal ───────────────────────────────────────────────────
interface DeleteConfirmationModalProps {
  employeeName: string;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  employeeName, onClose, onConfirm, loading
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Deactivate Employee</h3>
        </div>
        <p className="text-gray-600 mb-2">
          Are you sure you want to deactivate{' '}
          <span className="font-semibold text-gray-900">{employeeName}</span>?
        </p>
        <p className="text-sm text-amber-600 mb-6">
          ⚠️ This is a soft delete — the employee record is retained but access is revoked.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Deactivating...</>
            ) : (
              <><Trash2 className="w-4 h-4" />Deactivate</>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default EmployeeProfile;
