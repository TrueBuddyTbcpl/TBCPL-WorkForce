import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, User, Key, Settings, Shield } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../services/api/apiClient';
import SuperAdminProfileDrawer from './SuperAdminProfileDrawer';

interface EmployeeDetails {
  empId: string; fullName: string; firstName: string; lastName: string;
  middleName?: string; email: string; roleName: string; departmentName: string;
  lastPasswordChangeDate?: string; lastLoginDate?: string; isActive: boolean;
  createdAt?: string; createdBy?: string;
  passwordExpired?: boolean; daysUntilPasswordExpiry?: number;
}

const SuperAdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownOpen, setDropdownOpen]       = useState(false);
  const [isProfileDrawerOpen, setProfileOpen] = useState(false);
  const [employee, setEmployee]               = useState<EmployeeDetails | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiClient.get('/auth/profile');
        if (res.data?.success && res.data?.data) setEmployee(res.data.data);
      } catch {
        if (user) setEmployee({
          empId: user.empId || '', fullName: user.fullName || 'Super Admin',
          firstName: user.fullName?.split(' ')[0] || 'Super',
          lastName: user.fullName?.split(' ').slice(-1)[0] || '',
          email: user.email || 'superadmin@tbcpl.com',
          roleName: user.roleName || 'Super Administrator',
          departmentName: user.departmentName || 'Administration',
          isActive: true,
        });
      }
    };
    fetch();
  }, [user]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const adminName  = employee?.fullName  || user?.fullName  || 'Super Admin';
  const adminEmail = employee?.email     || user?.email     || 'superadmin@tbcpl.com';
  const adminRole  = employee?.roleName  || user?.roleName  || 'Super Administrator';
  const initial    = adminName.charAt(0).toUpperCase();

  const menuItems = [
    { icon: User,     label: 'View My Profile',  action: () => { setDropdownOpen(false); setProfileOpen(true); } },
    { icon: Key,      label: 'Change Password',  action: () => { setDropdownOpen(false); navigate('/auth/change-password'); } },
    { icon: Settings, label: 'Settings',         action: () => { setDropdownOpen(false); navigate('/super-admin/settings'); } },
  ];

  return (
    <>
      <div className="bg-[#060e1e]/70 backdrop-blur-xl
        border-b border-cyan-400/10 px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">

          <div>
            {/* Cyan top-border accent line matching ID card style */}
            <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent mb-2 rounded-full" />
            <h2 className="text-xl font-extrabold text-white tracking-wide uppercase">
              Super Admin Dashboard
            </h2>
            <p className="text-sm text-cyan-300/50">Welcome back, {adminName}</p>
          </div>

          <div className="flex items-center gap-4">

            {/* Notification Bell */}
            <button className="relative p-2 text-cyan-400 hover:bg-cyan-400/10
              rounded-xl border border-transparent hover:border-cyan-400/20 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2
                bg-red-500 rounded-full ring-2 ring-[#060e1e]" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl
                  hover:bg-cyan-400/10 border border-cyan-400/15
                  hover:border-cyan-400/30 transition"
              >
                {/* Avatar with True Buddy brand gradient */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center
                  bg-gradient-to-br from-cyan-400 to-[#1a3a6e]
                  text-white font-bold text-sm shadow-lg shadow-cyan-500/20">
                  {initial}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{adminName}</p>
                  <p className="text-xs text-cyan-300/50">{adminRole}</p>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64
                  bg-[#060e1e]/90 backdrop-blur-2xl
                  border border-cyan-400/15 rounded-2xl shadow-2xl
                  shadow-cyan-900/30 overflow-hidden z-50">

                  {/* Profile Header */}
                  <div className="px-4 py-4 border-b border-cyan-400/10
                    bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full
                        bg-gradient-to-br from-cyan-400 to-[#1a3a6e]
                        flex items-center justify-center
                        text-white font-bold shadow-lg flex-shrink-0">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{adminName}</p>
                        <p className="text-xs text-cyan-300/50 truncate">{adminEmail}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Shield className="w-3 h-3 text-cyan-400" />
                          <p className="text-xs text-cyan-400 font-semibold">{adminRole}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {menuItems.map(({ icon: Icon, label, action }) => (
                      <button key={label} onClick={action}
                        className="w-full flex items-center gap-3 px-4 py-2.5
                          text-sm text-cyan-200/60 hover:bg-cyan-400/10
                          hover:text-white transition">
                        <Icon className="w-4 h-4 text-cyan-400/60" />
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-cyan-400/10">
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5
                        text-sm text-red-400/70 hover:bg-red-500/10
                        hover:text-red-300 transition"
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

      <SuperAdminProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setProfileOpen(false)}
        employee={employee}
      />
    </>
  );
};

export default SuperAdminHeader;
