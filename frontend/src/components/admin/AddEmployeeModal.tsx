import React, { useState, useEffect } from 'react';
import { X, UserPlus, Mail, Phone, Calendar, Briefcase, Lock, Eye, EyeOff } from 'lucide-react';
import apiClient from '../../services/api/apiClient';
import { toast } from 'sonner';

interface DepartmentOption {
  id: number;
  departmentName: string;
}

interface RoleOption {
  id: number;
  roleName: string;
}

interface AddEmployeeModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    emailPrefix: '',
    emailDomain: 'tbcpl.co.in',
    password: '',
    phone: '',
    departmentId: '',
    roleId: '',
    joinDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoadingDepartments(true);
        const response = await apiClient.get('/auth/departments');
        setDepartments(response.data?.data || []);
      } catch {
        toast.error('Failed to load departments');
      } finally {
        setIsLoadingDepartments(false);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoadingRoles(true);
        const response = await apiClient.get('/auth/roles');
        setRoles(response.data?.data || []);
      } catch {
        toast.error('Failed to load roles');
      } finally {
        setIsLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2 || formData.firstName.length > 50) {
      newErrors.firstName = 'First name must be between 2 and 50 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2 || formData.lastName.length > 50) {
      newErrors.lastName = 'Last name must be between 2 and 50 characters';
    }

    if (formData.middleName && formData.middleName.length > 50) {
      newErrors.middleName = 'Middle name must not exceed 50 characters';
    }

    if (!formData.emailPrefix.trim()) {
      newErrors.emailPrefix = 'Email prefix is required';
    } else if (!/^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?$/.test(formData.emailPrefix)) {
      newErrors.emailPrefix = 'Only letters, numbers, dots, hyphens allowed';
    } else if (formData.emailPrefix.length < 2 || formData.emailPrefix.length > 50) {
      newErrors.emailPrefix = 'Must be between 2 and 50 characters';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8 || formData.password.length > 50) {
      newErrors.password = 'Password must be between 8 and 50 characters';
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one letter and one number';
    }

    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone is invalid';
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const requestData = {
        emailPrefix: formData.emailPrefix.trim().toLowerCase(),
        emailDomain: formData.emailDomain,
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        middleName: formData.middleName.trim() || undefined,
        departmentId: Number(formData.departmentId),
        roleId: Number(formData.roleId),
      };

      const response = await apiClient.post('/auth/employees', requestData);
      if (response.data.success) {
        toast.success('Employee added successfully!');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to add employee. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add New Employee</h2>
              <p className="text-sm text-gray-600">Fill in the details to add a new employee</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* ── Personal Information ─────────────────────── */}
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Personal Information
          </h3>

          {/* Row 1: First Name + Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={isSubmitting}
                placeholder="John"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                  focus:ring-blue-500 disabled:bg-gray-50
                  ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={isSubmitting}
                placeholder="Doe"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                  focus:ring-blue-500 disabled:bg-gray-50
                  ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Row 2: Middle Name (full width) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Middle Name
              <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              disabled={isSubmitting}
              placeholder="Michael"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                focus:ring-blue-500 disabled:bg-gray-50
                ${errors.middleName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.middleName && (
              <p className="text-red-500 text-xs mt-1">{errors.middleName}</p>
            )}
          </div>

          {/* Row 3: Email Prefix + Domain (full width, split input) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <div className="flex">
              <input
                type="text"
                value={formData.emailPrefix}
                onChange={(e) => setFormData({ ...formData, emailPrefix: e.target.value })}
                disabled={isSubmitting}
                placeholder="e.g. john.doe / john.doe2025 / john.doe25"
                className={`flex-1 px-4 py-3 border rounded-l-lg focus:outline-none focus:ring-2
                  focus:ring-blue-500 focus:z-10 disabled:bg-gray-50
                  ${errors.emailPrefix ? 'border-red-500' : 'border-gray-300'}`}
              />
              <span className="flex items-center px-3 bg-gray-100 border-t border-b
                border-gray-300 text-gray-500 text-sm font-medium select-none">
                @
              </span>
              <select
                value={formData.emailDomain}
                onChange={(e) => setFormData({ ...formData, emailDomain: e.target.value })}
                disabled={isSubmitting}
                className="px-3 py-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm
                  disabled:bg-gray-100 cursor-pointer"
              >
                <option value="tbcpl.co.in">tbcpl.co.in</option>
                <option value="gnsp.co.in">gnsp.co.in</option>
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

            {errors.emailPrefix && (
              <p className="text-red-500 text-xs mt-1">{errors.emailPrefix}</p>
            )}
          </div>

          {/* Row 4: Phone (full width) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
              <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isSubmitting}
              placeholder="+91 98765 43210"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                focus:ring-blue-500 disabled:bg-gray-50
                ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Row 5: Password (full width) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              Initial Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isSubmitting}
                placeholder="Enter initial password"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                  focus:ring-blue-500 pr-12 disabled:bg-gray-50
                  ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500
                  hover:text-gray-700 disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Must be 8–50 characters with letters and numbers.
              Employee will be required to change password on first login.
            </p>
          </div>

          {/* ── Job Information ───────────────────────────── */}
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide pt-2">
            Job Information
          </h3>

          {/* Row 6: Department + Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Department *
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) =>
                  setFormData({ ...formData, departmentId: e.target.value, roleId: '' })
                }
                disabled={isSubmitting || isLoadingDepartments}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                  focus:ring-blue-500 disabled:bg-gray-50
                  ${errors.departmentId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">
                  {isLoadingDepartments ? 'Loading...' : 'Select Department'}
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <p className="text-red-500 text-xs mt-1">{errors.departmentId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                disabled={isSubmitting || isLoadingRoles}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                  focus:ring-blue-500 disabled:bg-gray-50
                  ${errors.roleId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">
                  {isLoadingRoles ? 'Loading...' : 'Select Role'}
                </option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.roleName}
                  </option>
                ))}
              </select>
              {errors.roleId && (
                <p className="text-red-500 text-xs mt-1">{errors.roleId}</p>
              )}
            </div>
          </div>

          {/* Row 7: Join Date (full width) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Join Date
            </label>
            <input
              type="date"
              value={formData.joinDate}
              onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>

          {/* ── Action Buttons ────────────────────────────── */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg
                hover:bg-gray-50 transition font-medium disabled:opacity-50
                disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                transition font-medium flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Add Employee
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
