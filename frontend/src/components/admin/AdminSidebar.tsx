import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Department } from './types/admin.types';
import { 
  Building2, 
  Users, 
  Calculator, 
  UserPlus, 
  Lock, 
  Briefcase, 
  ChevronDown, 
  Home,
  User,
  Settings,
  LogOut,
  Filter,
  List,
  FileText,
  UserCheck,
} from 'lucide-react';
import AddEmployeeModal from './AddEmployeeModal';
import ChangePasswordModal from './ChangePasswordModal';
import ClientsListModal from './ClientsListModal';

type ViewMode = 'employees' | 'cases' | 'profiles';

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
  onDepartmentChange,
  viewMode,
  onViewModeChange,
  filters,
  onFiltersChange,
}) => {
  const navigate = useNavigate();
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showClientsList, setShowClientsList] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false); // ✅ Filter state

  // ✅ Get admin info from localStorage
  const adminName = localStorage.getItem('admin_name') || 'Admin User';
  const adminEmail = localStorage.getItem('admin_email') || 'admin@tbcpl.com';
  const adminRole = localStorage.getItem('admin_role') || 'Administrator';

  const departments: { value: Department; label: string; icon: any; color: string }[] = [
    { value: 'Operations', label: 'Operations', icon: Building2, color: 'blue' },
    { value: 'HR', label: 'Human Resources', icon: Users, color: 'green' },
    { value: 'Account', label: 'Accounts', icon: Calculator, color: 'purple' },
  ];

  const selectedDept = departments.find(d => d.value === selectedDepartment);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  // ✅ Clear all filters
  const handleClearFilters = () => {
    onFiltersChange({ role: 'all', status: 'all' });
  };

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

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Department Selector */}
          <div className="mb-4">
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

          {/* ✅ View Mode Selector */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
              View Mode
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onViewModeChange('employees')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  viewMode === 'employees'
                    ? 'bg-blue-50 text-blue-600 border-2 border-blue-600 font-semibold'
                    : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Employees</span>
              </button>

              <button
                onClick={() => onViewModeChange('cases')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  viewMode === 'cases'
                    ? 'bg-blue-50 text-blue-600 border-2 border-blue-600 font-semibold'
                    : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                <span>Cases</span>
              </button>

              <button
                onClick={() => onViewModeChange('profiles')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  viewMode === 'profiles'
                    ? 'bg-blue-50 text-blue-600 border-2 border-blue-600 font-semibold'
                    : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <span>Culprit Profiles</span>
              </button>
            </div>
          </div>

          {/* ✅ Filter Section */}
          <div className="mb-4">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* ✅ Filter Options */}
            {filterOpen && (
              <div className="mt-2 bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                {/* Role Filter (Employees only) */}
                {viewMode === 'employees' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={filters.role}
                      onChange={(e) => onFiltersChange({ ...filters, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Roles</option>
                      <option value="Manager">Manager</option>
                      <option value="Senior Investigator">Senior Investigator</option>
                      <option value="Investigator">Investigator</option>
                      <option value="Junior Investigator">Junior Investigator</option>
                    </select>
                  </div>
                )}

                {/* Status Filter (Cases and Profiles) */}
                {(viewMode === 'cases' || viewMode === 'profiles') && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      {viewMode === 'cases' ? (
                        <>
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="on-hold">On Hold</option>
                          <option value="closed">Closed</option>
                        </>
                      ) : (
                        <>
                          <option value="active">Active</option>
                          <option value="under investigation">Under Investigation</option>
                          <option value="arrested">Arrested</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                {/* Clear Filters Button */}
                <button
                  onClick={handleClearFilters}
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* ✅ Employee Management Section */}
          <div className="space-y-2 mb-4">
            <button
              onClick={() => setShowEmployeeMenu(!showEmployeeMenu)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span>Employee Management</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showEmployeeMenu ? 'rotate-180' : ''}`} />
            </button>

            {showEmployeeMenu && (
              <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                <button
                  onClick={() => setShowAddEmployee(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Employee
                </button>

                <button
                  onClick={() => console.log('View all employees')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm"
                >
                  <List className="w-4 h-4" />
                  All Employees
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
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
              <FileText className="w-5 h-5" />
              View All Clients
            </button>
          </div>
        </div>

        {/* ✅ Admin Profile Section (Bottom) */}
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
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  showProfileMenu ? 'rotate-180' : ''
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

      {/* Modals */}
      {showAddEmployee && (
        <AddEmployeeModal 
          onClose={() => setShowAddEmployee(false)}
          onSuccess={() => setShowAddEmployee(false)}
        />
      )}
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
      {showClientsList && (
        <ClientsListModal onClose={() => setShowClientsList(false)} />
      )}
    </>
  );
};

export default AdminSidebar;
