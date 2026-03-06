import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Key, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';
import apiClient from '../../../services/api/apiClient';

interface EmployeeDetails {
  empId: string;
  fullName: string;
  email: string;
  roleName: string;
  departmentName: string;
  joinDate?: string;
  phone?: string;
  passwordExpiryDate?: string;
  lastPasswordChangedDate?: string;
  isActive: boolean;
}

const EmployeeProfileSection: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [daysUntilPasswordExpiry, setDaysUntilPasswordExpiry] = useState<number | null>(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!user?.empId) { setIsLoading(false); return; }
      try {
        setIsLoading(true);
        const response = await apiClient.get('/auth/profile');
        if (response.data?.success && response.data?.data) {
          const empData = response.data.data;
          setEmployee(empData);

          let expiryDate: Date | null = null;
          if (empData.passwordExpiryDate) {
            expiryDate = new Date(empData.passwordExpiryDate);
          } else if (empData.lastPasswordChangedDate) {
            expiryDate = new Date(empData.lastPasswordChangedDate);
            expiryDate.setDate(expiryDate.getDate() + 60);
          } else if (empData.joinDate) {
            expiryDate = new Date(empData.joinDate);
            expiryDate.setDate(expiryDate.getDate() + 60);
          }

          if (expiryDate) {
            const diffDays = Math.ceil(
              (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            setDaysUntilPasswordExpiry(diffDays);
          } else {
            setDaysUntilPasswordExpiry(45);
          }
        }
      } catch {
        if (user) {
          setEmployee({
            empId: user.empId,
            fullName: user.fullName || 'Unknown User',
            email: user.email || '',
            roleName: user.roleName || 'Employee',
            departmentName: user.departmentName || 'N/A',
            isActive: true,
          });
          setDaysUntilPasswordExpiry(45);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployeeDetails();
  }, [user]);

  // ── Close dropdown on outside click ──────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewProfile    = () => { setIsDropdownOpen(false); navigate('/operations/employee/profile'); };
  const handleSettings       = () => { setIsDropdownOpen(false); navigate('/operations/settings'); };
  const handleChangePassword = () => { setIsDropdownOpen(false); navigate('/auth/change-password'); };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsLoggingOut(true);
    try {
      await apiClient.post('/auth/logout');
    } catch { /* continue regardless */ } finally {
      logout();
      setIsLoggingOut(false);
      navigate('/auth/login', { replace: true });
    }
  };

  const getPasswordExpiryBadge = () => {
    if (daysUntilPasswordExpiry === null) return null;
    if (daysUntilPasswordExpiry <= 0) return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 border border-red-500/40 rounded-full">
        <AlertTriangle className="w-3 h-3 text-red-400" />
        <span className="text-xs font-semibold text-red-400">Password Expired</span>
      </div>
    );
    if (daysUntilPasswordExpiry <= 7) return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 border border-red-500/40 rounded-full">
        <Key className="w-3 h-3 text-red-400" />
        <span className="text-xs font-semibold text-red-400">{daysUntilPasswordExpiry}d left</span>
      </div>
    );
    if (daysUntilPasswordExpiry <= 15) return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full">
        <Key className="w-3 h-3 text-yellow-400" />
        <span className="text-xs font-semibold text-yellow-400">{daysUntilPasswordExpiry}d left</span>
      </div>
    );
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 border border-green-500/40 rounded-full">
        <Key className="w-3 h-3 text-green-400" />
        <span className="text-xs font-semibold text-green-400">{daysUntilPasswordExpiry}d left</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white/10 rounded-full animate-pulse" />
      </div>
    );
  }

  if (!employee) return null;

  const initial = employee.fullName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center" ref={dropdownRef}>

      {/* ── Avatar Button ─────────────────────────────────────────── */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2.5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition-all"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-sm">{initial}</span>
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold text-gray-100 leading-tight">
              {employee.fullName}
            </p>
            <p className="text-xs text-blue-400 leading-tight">{employee.roleName}</p>
          </div>
        </button>

        {/* ── Dropdown ──────────────────────────────────────────────── */}
        {isDropdownOpen && (
          <div
            className="absolute right-0 mt-3 w-80 rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{
              background: 'rgba(22, 32, 46, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
          >
            {/* Profile Header */}
            <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-2 ring-blue-500/30 shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-xl">{initial}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{employee.fullName}</p>
                  <p className="text-xs text-gray-400 truncate">{employee.email}</p>
                  <p className="text-xs text-blue-400/70 font-mono mt-0.5">{employee.empId}</p>
                </div>
                {daysUntilPasswordExpiry !== null && getPasswordExpiryBadge()}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div
                  className="rounded-lg px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Department</p>
                  <p className="text-xs font-semibold text-gray-200 truncate mt-0.5">{employee.departmentName}</p>
                </div>
                <div
                  className="rounded-lg px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Role</p>
                  <p className="text-xs font-semibold text-gray-200 truncate mt-0.5">{employee.roleName}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {[
                { icon: User,     label: 'View Full Profile',  action: handleViewProfile,    hoverBg: 'hover:bg-blue-500/10',   hoverText: 'group-hover:text-blue-400'   },
                { icon: Key,      label: 'Change Password',    action: handleChangePassword, hoverBg: 'hover:bg-purple-500/10', hoverText: 'group-hover:text-purple-400' },
                { icon: Settings, label: 'Settings',           action: handleSettings,       hoverBg: 'hover:bg-white/5',       hoverText: 'group-hover:text-gray-200'   },
              ].map(({ icon: Icon, label, action, hoverBg, hoverText }) => (
                <button
                  key={label}
                  onClick={action}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group ${hoverBg}`}
                >
                  <Icon className={`w-4 h-4 text-gray-500 transition-colors ${hoverText}`} />
                  <span className={`text-gray-400 font-medium transition-colors ${hoverText}`}>{label}</span>
                </button>
              ))}
            </div>

            {/* Logout */}
            <div className="p-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm hover:bg-red-500/10 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4 text-red-500/70 group-hover:text-red-400 transition-colors" />
                <span className="text-red-500/70 group-hover:text-red-400 font-medium transition-colors">
                  {isLoggingOut ? 'Logging out…' : 'Logout'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfileSection;
