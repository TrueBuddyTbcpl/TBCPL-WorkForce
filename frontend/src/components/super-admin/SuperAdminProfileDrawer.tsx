import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, User, Mail, Building2, Shield, Calendar,
  Clock, Key, CheckCircle2, XCircle, AlertTriangle, Hash,
} from 'lucide-react';

interface EmployeeDetails {
  empId: string; fullName: string; firstName: string; lastName: string;
  middleName?: string; email: string; roleName: string; departmentName: string;
  lastPasswordChangeDate?: string; lastLoginDate?: string; isActive: boolean;
  createdAt?: string; createdBy?: string;
  passwordExpired?: boolean; daysUntilPasswordExpiry?: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeDetails | null;
}

const SuperAdminProfileDrawer: React.FC<Props> = ({ isOpen, onClose, employee }) => {
  const navigate  = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!employee) return null;

  const initial = employee.fullName.charAt(0).toUpperCase();
  const fmt     = (d?: string) => d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A';
  const fmtDT   = (d?: string) => d
    ? new Date(d).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : 'N/A';

  const getPwStatus = () => {
    const days = employee.daysUntilPasswordExpiry;
    if (employee.passwordExpired || (days !== undefined && days <= 0))
      return { label: 'Expired',              style: 'text-red-300 bg-red-500/20 border-red-400/30',          icon: <XCircle       className="w-4 h-4 text-red-300" /> };
    if (days !== undefined && days <= 7)
      return { label: `Expires in ${days}d`,  style: 'text-red-300 bg-red-500/20 border-red-400/30',          icon: <AlertTriangle className="w-4 h-4 text-red-300" /> };
    if (days !== undefined && days <= 15)
      return { label: `Expires in ${days}d`,  style: 'text-yellow-200 bg-yellow-500/20 border-yellow-400/30', icon: <AlertTriangle className="w-4 h-4 text-yellow-300" /> };
    return   { label: `${days ?? '–'}d remaining`, style: 'text-green-200 bg-green-500/20 border-green-400/30',    icon: <CheckCircle2  className="w-4 h-4 text-green-300" /> };
  };

  const pwStatus = getPwStatus();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full z-[70] flex flex-col
          bg-black/30 backdrop-blur-2xl
          border-l border-white/20
          shadow-2xl shadow-black/30
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0
          bg-white/10 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-white/50 rounded-full" />
            <h2 className="text-lg font-bold text-white tracking-wide
              [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
              Super Admin Profile
            </h2>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition">
            <X className="w-5 h-5 text-white/70 hover:text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* Avatar Block */}
          <div className="px-6 pt-6 pb-5 bg-white/5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex-shrink-0
                bg-white/20 backdrop-blur-sm border border-white/30
                flex items-center justify-center shadow-xl shadow-black/20">
                <span className="text-white font-bold text-2xl
                  [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
                  {initial}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white
                  [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                  {employee.fullName}
                </h3>
                <p className="text-sm text-white/60 mt-0.5
                  [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                  {employee.roleName}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5
                    rounded-full font-medium border
                    [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]
                    ${employee.isActive
                      ? 'bg-green-500/20 text-green-200 border-green-400/30'
                      : 'bg-red-500/20 text-red-200 border-red-400/30'
                    }`}>
                    {employee.isActive
                      ? <><CheckCircle2 className="w-3 h-3" /> Active</>
                      : <><XCircle      className="w-3 h-3" /> Inactive</>}
                  </span>
                  <span className="text-xs text-white/40 font-mono
                    [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                    {employee.empId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">

            <DrawerSection title="Identity">
              <DrawerRow icon={<Hash       className="w-4 h-4 text-white/50" />} label="Employee ID"             value={employee.empId}                    mono />
              <DrawerRow icon={<User       className="w-4 h-4 text-white/50" />} label="First Name"              value={employee.firstName}                     />
              {employee.middleName && (
                <DrawerRow icon={<User     className="w-4 h-4 text-white/50" />} label="Middle Name"             value={employee.middleName}                    />
              )}
              <DrawerRow icon={<User       className="w-4 h-4 text-white/50" />} label="Last Name"               value={employee.lastName}                      />
              <DrawerRow icon={<Mail       className="w-4 h-4 text-white/50" />} label="Email"                   value={employee.email}                         />
            </DrawerSection>

            <DrawerSection title="Organization">
              <DrawerRow icon={<Building2  className="w-4 h-4 text-white/50" />} label="Department"              value={employee.departmentName}                />
              <DrawerRow icon={<Shield     className="w-4 h-4 text-white/50" />} label="Role"                    value={employee.roleName}                      />
              {employee.createdBy && (
                <DrawerRow icon={<User     className="w-4 h-4 text-white/50" />} label="Created By"              value={employee.createdBy}                     />
              )}
              {employee.createdAt && (
                <DrawerRow icon={<Calendar className="w-4 h-4 text-white/50" />} label="Joined On"               value={fmt(employee.createdAt)}                />
              )}
            </DrawerSection>

            <DrawerSection title="Activity">
              <DrawerRow icon={<Clock className="w-4 h-4 text-white/50" />} label="Last Login"           value={fmtDT(employee.lastLoginDate)}       />
              <DrawerRow icon={<Key   className="w-4 h-4 text-white/50" />} label="Last Password Change" value={fmt(employee.lastPasswordChangeDate)} />
            </DrawerSection>

            <DrawerSection title="Password Security">
              <div className={`flex items-center gap-3 p-3 m-3 border rounded-xl
                ${pwStatus.style}`}>
                {pwStatus.icon}
                <div>
                  <p className="text-xs font-semibold
                    [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                    {pwStatus.label}
                  </p>
                  <p className="text-xs opacity-70 mt-0.5
                    [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">
                    {employee.passwordExpired
                      ? 'Please change your password immediately'
                      : 'Password expires every 60 days'}
                  </p>
                </div>
              </div>
            </DrawerSection>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/20 flex-shrink-0 bg-white/5">
          <button
            onClick={() => { onClose(); navigate('/auth/change-password'); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5
              bg-white/20 hover:bg-white/30
              border border-white/30 hover:border-white/50
              text-white font-semibold rounded-xl
              transition-all text-sm backdrop-blur-sm
              [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]
              shadow-sm shadow-black/10"
          >
            <Key className="w-4 h-4" />
            Change Password
          </button>
        </div>
      </div>
    </>
  );
};

/* ── Section ── */
const DrawerSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3
      [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
      {title}
    </h4>
    <div className="bg-white/10 rounded-xl border border-white/20 divide-y divide-white/10">
      {children}
    </div>
  </div>
);

/* ── Row ── */
const DrawerRow: React.FC<{
  icon: React.ReactNode; label: string; value: string; mono?: boolean
}> = ({ icon, label, value, mono }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-white/40
        [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">
        {label}
      </p>
      <p className={`text-sm font-medium text-white truncate mt-0.5
        [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]
        ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
    </div>
  </div>
);

export default SuperAdminProfileDrawer;
