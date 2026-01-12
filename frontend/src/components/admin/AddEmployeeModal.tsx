import React, { useState, useEffect } from 'react';
import { X, UserPlus, Mail, Phone, Calendar, Briefcase, User } from 'lucide-react';
import type { Department } from './types/admin.types';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: Department;
  reportingManager?: string;
  joinDate: string;
  isManager: boolean;
}

interface AddEmployeeModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ onClose, onSuccess }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: 'Operations' as Department,
    reportingManager: '', // ✅ New field
    joinDate: new Date().toISOString().split('T')[0],
    isManager: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = {
    Operations: ['Manager', 'Senior Investigator', 'Investigator', 'Junior Investigator', 'Field Investigator'],
    HR: ['HR Manager', 'HR Executive', 'Recruiter', 'HR Assistant'],
    Account: ['Account Manager', 'Senior Accountant', 'Accountant', 'Junior Accountant'],
  };

  // ✅ Load existing employees for reporting manager dropdown
  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      try {
        const parsedEmployees = JSON.parse(storedEmployees);
        setEmployees(parsedEmployees);
      } catch (error) {
        console.error('Error loading employees:', error);
      }
    }
  }, []);

  // ✅ Filter managers by department
  const availableManagers = employees.filter(
    (emp) => emp.department === formData.department && emp.isManager
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) newErrors.phone = 'Phone is invalid';
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // ✅ Create new employee with unique ID
    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      reportingManager: formData.reportingManager || undefined,
      joinDate: formData.joinDate,
      isManager: formData.isManager,
    };

    // ✅ Save to localStorage
    try {
      const storedEmployees = localStorage.getItem('employees');
      const employeesList: Employee[] = storedEmployees ? JSON.parse(storedEmployees) : [];
      employeesList.push(newEmployee);
      localStorage.setItem('employees', JSON.stringify(employeesList));

      // Show success message
      alert('Employee added successfully!');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to add employee. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
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
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Personal Information
            </h3>
            
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Job Information Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Job Information
            </h3>

            {/* Department and Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    department: e.target.value as Department,
                    role: '', // Reset role when department changes
                    reportingManager: '', // Reset manager when department changes
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Operations">Operations</option>
                  <option value="HR">Human Resources</option>
                  <option value="Account">Accounts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Role</option>
                  {roles[formData.department].map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              </div>
            </div>

            {/* ✅ Reporting Manager and Join Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Reporting Manager
                </label>
                <select
                  value={formData.reportingManager}
                  onChange={(e) => setFormData({ ...formData, reportingManager: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={availableManagers.length === 0}
                >
                  <option value="">Select Manager (Optional)</option>
                  {availableManagers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} - {manager.role}
                    </option>
                  ))}
                </select>
                {availableManagers.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No managers available in {formData.department} department
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Join Date *
                </label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Is Manager Checkbox */}
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="isManager"
                checked={formData.isManager}
                onChange={(e) => setFormData({ ...formData, isManager: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isManager" className="text-sm font-medium text-gray-700">
                Assign as Department Manager
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
