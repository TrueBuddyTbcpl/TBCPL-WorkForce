import React, { useState } from 'react';
import type { Department } from './types/admin.types';
import { 
  Building2, Users, Calculator, UserPlus, 
  Lock, Briefcase, ChevronDown, Home 
} from 'lucide-react';
import AddEmployeeModal from './AddEmployeeModal';
import ChangePasswordModal from './ChangePasswordModal';
import ClientsListModal from './ClientsListModal';

interface AdminSidebarProps {
  selectedDepartment: Department;
  onDepartmentChange: (dept: Department) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  selectedDepartment,
  onDepartmentChange,
}) => {
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showClientsList, setShowClientsList] = useState(false);

  const departments: { value: Department; label: string; icon: any; color: string }[] = [
    { value: 'Operations', label: 'Operations', icon: Building2, color: 'blue' },
    { value: 'HR', label: 'Human Resources', icon: Users, color: 'green' },
    { value: 'Account', label: 'Accounts', icon: Calculator, color: 'purple' },
  ];

  const selectedDept = departments.find(d => d.value === selectedDepartment);

  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg z-40 flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">TBCPL</h1>
              <p className="text-xs text-gray-600">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Department Selector */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
              Select Department
            </label>
            <button
              onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2">
                {selectedDept && <selectedDept.icon className={`w-5 h-5 text-${selectedDept.color}-600`} />}
                <span className="font-medium text-gray-900">{selectedDept?.label}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${deptDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {deptDropdownOpen && (
              <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {departments.map((dept) => {
                  const DeptIcon = dept.icon;
                  const isSelected = dept.value === selectedDepartment;
                  
                  return (
                    <button
                      key={dept.value}
                      onClick={() => {
                        onDepartmentChange(dept.value);
                        setDeptDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition ${
                        isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <DeptIcon className={`w-5 h-5 text-${dept.color}-600`} />
                      <span className={`font-medium ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                        {dept.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => setShowAddEmployee(true)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <UserPlus className="w-5 h-5" />
              Add New Employee
            </button>

            <button
              onClick={() => setShowChangePassword(true)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              <Lock className="w-5 h-5" />
              Change Password
            </button>

            <button
              onClick={() => setShowClientsList(true)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              <Briefcase className="w-5 h-5" />
              View All Clients
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            © 2026 TBCPL Workforce
          </p>
        </div>
      </div>

      {/* Modals */}
      {showAddEmployee && <AddEmployeeModal onClose={() => setShowAddEmployee(false)} />}
      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
      {showClientsList && <ClientsListModal onClose={() => setShowClientsList(false)} />}
    </>
  );
};

export default AdminSidebar;
