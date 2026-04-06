import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

import {
  Menu, Search, SlidersHorizontal, HelpCircle,
  Settings, Bell, LogOut, User, Key, Shield, LayoutGrid,
} from 'lucide-react';
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


interface Props { onMenuToggle: () => void; }


const SuperAdminTopBar: React.FC<Props> = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/auth/profile');
        if (res.data?.success && res.data?.data) setEmployee(res.data.data);
      } catch {
        if (user) setEmployee({
          empId: user.empId || '',
          fullName: user.fullName || 'Super Admin',
          firstName: user.fullName?.split(' ')[0] || 'Super',
          lastName: user.fullName?.split(' ').slice(-1)[0] || '',
          email: user.email || 'superadmin@tbcpl.com',
          roleName: user.roleName || 'Super Administrator',
          departmentName: user.departmentName || 'Administration',
          isActive: true,
        });
      }
    };
    fetchProfile();
  }, [user]);


  const adminName  = employee?.fullName    || user?.fullName    || 'Super Admin';
  const adminEmail = employee?.email       || user?.email       || 'superadmin@tbcpl.com';
  const adminRole  = employee?.roleName    || user?.roleName    || 'Super Administrator';
  const initial    = adminName.charAt(0).toUpperCase();


  return (
    <>
      <header className="flex items-center gap-4 px-4 py-3 flex-shrink-0 z-30
        bg-white/10 backdrop-blur-xl border-b border-white/20
        shadow-sm shadow-black/10">


        {/* ── Left: Hamburger + Logo ── */}
        <div className="flex items-center gap-3 w-56 flex-shrink-0">
          <button onClick={onMenuToggle}
            className="p-2 rounded-full hover:bg-white/20
              text-white/80 hover:text-white transition
              drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center
              bg-white/20 backdrop-blur-sm border border-white/30
              shadow-sm flex-shrink-0">
              <Shield className="w-4 h-4 text-white
                drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-extrabold text-white tracking-widest uppercase leading-none
                [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                True Buddy
              </p>
              <p className="text-[9px] font-semibold text-white/70 tracking-widest uppercase mt-0.5 leading-none
                [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                Consulting
              </p>
            </div>
          </div>
        </div>


        {/* ── Center: Search Bar ── */}
        <div className="flex-1 max-w-2xl">
          <div className={`
            flex items-center gap-3 px-4 py-2.5 rounded-2xl
            transition-all duration-200
            ${searchFocused
              ? 'bg-white/25 border border-white/50 shadow-md shadow-black/10'
              : 'bg-white/15 border border-white/25 hover:bg-white/20'
            }
          `}>
            <Search className={`w-5 h-5 flex-shrink-0 transition-colors
              drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]
              ${searchFocused ? 'text-white' : 'text-white/60'}`}
            />
            <input
              type="text"
              placeholder="Search in super admin..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="flex-1 bg-transparent text-sm text-white
                placeholder-white/40 focus:outline-none
                [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
            />
            <SlidersHorizontal className={`w-4 h-4 flex-shrink-0 cursor-pointer transition-colors
              drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]
              ${searchFocused ? 'text-white' : 'text-white/50 hover:text-white'}`}
            />
          </div>
        </div>


        {/* ── Right: Icons + Avatar ── */}
        <div className="flex items-center gap-1 ml-auto">
          {[
            { Icon: HelpCircle, action: undefined },
            { Icon: Settings,   action: () => navigate('/super-admin/settings') },
            { Icon: LayoutGrid, action: undefined },
          ].map(({ Icon, action }, i) => (
            <button key={i} onClick={action}
              className="p-2 rounded-full hover:bg-white/20
                text-white/60 hover:text-white transition
                drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              <Icon className="w-5 h-5" />
            </button>
          ))}

          <button className="relative p-2 rounded-full hover:bg-white/20
            text-white/60 hover:text-white transition">
            <Bell className="w-5 h-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2
              bg-red-500 rounded-full ring-2 ring-transparent
              shadow-sm shadow-red-500/50" />
          </button>

          {/* ── Avatar ── */}
          <div className="relative ml-1">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center
                bg-white/20 backdrop-blur-sm border border-white/40
                text-white font-bold text-sm
                hover:bg-white/30 hover:border-white/60
                shadow-md shadow-black/20 transition-all
                [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
            >
              {initial}
            </button>

            {dropdownOpen && createPortal(
              <>
                {/* ── Backdrop — handles outside click, NO mousedown conflict ── */}
                <div
                  className="fixed inset-0 z-[998] backdrop-blur-sm bg-black/30"
                  onClick={() => setDropdownOpen(false)}
                />

                {/* ── Dropdown card ── */}
                <div className="fixed top-14 right-4 w-72 z-[999]
                  bg-black/60 backdrop-blur-xl
                  border border-white/25 rounded-2xl
                  shadow-2xl shadow-black/50 overflow-hidden">

                  {/* Profile card */}
                  <div className="px-5 py-5 border-b border-white/20 text-center bg-white/10">
                    <div className="w-16 h-16 rounded-full mx-auto mb-3
                      bg-white/25 border border-white/35
                      flex items-center justify-center
                      text-white font-bold text-2xl
                      shadow-xl shadow-black/30
                      [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
                      {initial}
                    </div>
                    <p className="font-bold text-white text-sm
                      [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                      {adminName}
                    </p>
                    <p className="text-xs text-white/70 mt-0.5
                      [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                      {adminEmail}
                    </p>
                    <div className="inline-flex items-center gap-1 mt-2
                      bg-white/20 border border-white/30 px-2.5 py-1 rounded-full">
                      <Shield className="w-3 h-3 text-white/90" />
                      <span className="text-xs text-white font-semibold
                        [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                        {adminRole}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2 bg-black/20">
                    {[
                      { icon: User,     label: 'View Profile',    action: () => { setDropdownOpen(false); setProfileOpen(true); } },
                      { icon: Key,      label: 'Change Password', action: () => { setDropdownOpen(false); navigate('/auth/change-password'); } },
                      { icon: Settings, label: 'Settings',        action: () => { setDropdownOpen(false); navigate('/super-admin/settings'); } },
                    ].map(({ icon: Icon, label, action }) => (
                      <button key={label} onClick={action}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm
                          text-white/80 hover:bg-white/15 hover:text-white transition
                          [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                        <Icon className="w-4 h-4 text-white/60" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-white/20 py-2 bg-black/20">
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-sm
                        text-red-300 hover:bg-red-500/20 hover:text-red-200 transition
                        [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-white/15 text-center bg-black/25">
                    <p className="text-[10px] text-white/40
                      [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">
                      True Buddy Consulting Pvt. Ltd.
                    </p>
                  </div>
                </div>
              </>,
              document.body
            )}
          </div>
        </div>
      </header>

      <SuperAdminProfileDrawer
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        employee={employee}
      />
    </>
  );
};

export default SuperAdminTopBar;
