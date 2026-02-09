import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Department } from './types/admin.types';
import {
  Building2,
  Users,
  Calculator,
  Briefcase,
  ChevronDown,
  Home,
  User,
  Settings,
  LogOut,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAuth } from '../../hooks/useAuth';

export type ViewMode = 'employees' | 'cases' | 'profiles' | 'prereports' | 'clients';

interface Filters {
  role: string;
  status: string;
}

interface AdminSidebarProps {
  selectedDepartment: Department;
  onDepartmentChange: (dept: Department) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  selectedDepartment,
  viewMode,
  onViewModeChange,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const adminName = user?.fullName || 'Admin User';
  const adminEmail = user?.email || 'admin@tbcpl.com';
  const adminRole = user?.roleName || 'Administrator';

  const departments: { value: Department; label: string; icon: any; color: string }[] = [
    { value: 'Operations', label: 'Operations', icon: Building2, color: 'blue' },
    { value: 'HR', label: 'Human Resources', icon: Users, color: 'green' },
    { value: 'Account', label: 'Accounts', icon: Calculator, color: 'purple' },
  ];

  const selectedDept = departments.find(d => d.value === selectedDepartment);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  return (
    <>
      {/* ✅ CHANGED: Background color to light sky blue */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-sky-100 border-r border-gray-200 shadow-lg z-40 flex flex-col">
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

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* ✅ CHANGED: Disabled Department Selector */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
              Select Department
            </label>
            <button
              disabled
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg cursor-not-allowed opacity-60"
            >
              <div className="flex items-center gap-2">
                {selectedDept && <selectedDept.icon className={`w-5 h-5 text-${selectedDept.color}-600`} />}
                <span className="font-medium text-gray-900">{selectedDept?.label}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* ✅ View Mode Selector - Cases and Profiles DISABLED */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
              View Mode
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onViewModeChange('employees')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${viewMode === 'employees'
                  ? 'bg-blue-50 text-blue-600 border-2 border-blue-600 font-semibold'
                  : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
              >
                <Users className="w-5 h-5" />
                <span>Employees</span>
              </button>

              {/* ✅ CHANGED: Cases button disabled */}
              <button
                disabled
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed opacity-60"
              >
                <Briefcase className="w-5 h-5" />
                <span>Cases</span>
              </button>

              {/* ✅ CHANGED: Culprit Profiles button disabled */}
              <button
                disabled
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed opacity-60"
              >
                <UserCheck className="w-5 h-5" />
                <span>Culprit Profiles</span>
              </button>
            </div>
          </div>

          {/* ✅ REMOVED: Filter Section - Completely removed */}

          {/* ✅ REMOVED: Employee Management Section - Completely removed */}

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* ✅ REMOVED: Change Password button - Completely removed */}
            {/* ✅ NEW: Preliminary Reports Button */}
            <button
              onClick={() => onViewModeChange('prereports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${viewMode === 'prereports'
                ? 'bg-blue-50 text-blue-600 border-2 border-blue-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
            >
              <FileText className="w-5 h-5" />
              Preliminary Reports
            </button>

            {/* ✅ Client Management Button - Same pattern as prereports */}
            <button
              onClick={() => onViewModeChange('clients')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${viewMode === 'clients'
                  ? 'bg-blue-50 text-blue-600 border-2 border-blue-600'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
            >
              <Building2 className="w-5 h-5" />
              Client Management
            </button>


          </div>
        </div>

        {/* Admin Profile Section (Bottom) */}
        <div className="border-t border-gray-200 p-4">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {adminName}
                </p>
                <p className="text-xs text-gray-500 truncate">{adminRole}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{adminName}</p>
                    <p className="text-xs text-gray-500 truncate">{adminEmail}</p>
                  </div>

                  <button
                    onClick={() => {
                      navigate('/admin/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate('/admin/settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
