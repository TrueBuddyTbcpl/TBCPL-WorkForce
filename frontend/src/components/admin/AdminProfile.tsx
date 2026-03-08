// src/components/admin/AdminProfile.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Bell, User, Key } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../services/api/apiClient';
import AdminProfileDrawer from './AdminProfileDrawer';

interface EmployeeDetails {
  empId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  roleName: string;
  departmentName: string;
  lastPasswordChangeDate?: string;
  lastLoginDate?: string;
  isActive: boolean;
  createdAt?: string;
  createdBy?: string;
  passwordExpired?: boolean;
  daysUntilPasswordExpiry?: number;
}

const AdminProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);

  // Fetch real admin profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/auth/profile');
        if (response.data?.success && response.data?.data) {
          setEmployee(response.data.data);
        }
      } catch {
        // Fallback to auth store data
        if (user) {
          setEmployee({
            empId: user.empId || '',
            fullName: user.fullName || 'Admin User',
            firstName: user.fullName?.split(' ')[0] || 'Admin',
            lastName: user.fullName?.split(' ').slice(-1)[0] || '',
            email: user.email || 'admin@tbcpl.com',
            roleName: user.roleName || 'Administrator',
            departmentName: user.departmentName || 'Administration',
            isActive: true,
          });
        }
      }
    };
    fetchProfile();
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/auth/login', { replace: true });
  };

  const adminName = employee?.fullName || user?.fullName || 'Admin User';
  const adminEmail = employee?.email || user?.email || 'admin@tbcpl.com';
  const adminRole = employee?.roleName || user?.roleName || 'Administrator';
  const initial = adminName.charAt(0).toUpperCase();

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-sm text-gray-600">Welcome back, {adminName}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Admin Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-bold">
                  {initial}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{adminName}</p>
                  <p className="text-xs text-gray-600">{adminRole}</p>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
                  {/* Profile Summary */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{adminName}</p>
                        <p className="text-xs text-gray-500 truncate">{adminEmail}</p>
                        <p className="text-xs text-purple-600 font-medium">{adminRole}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => { setDropdownOpen(false); setIsProfileDrawerOpen(true); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
                    >
                      <User className="w-4 h-4" />
                      View My Profile
                    </button>

                    <button
                      onClick={() => { setDropdownOpen(false); navigate('/auth/change-password'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
                    >
                      <Key className="w-4 h-4" />
                      Change Password
                    </button>

                    <button
                      onClick={() => { setDropdownOpen(false); navigate('/admin/settings'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Drawer */}
      <AdminProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        employee={employee}
      />
    </>
  );
};

export default AdminProfile;
