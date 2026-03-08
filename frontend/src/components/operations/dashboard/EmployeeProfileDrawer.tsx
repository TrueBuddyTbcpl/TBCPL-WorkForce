// src/components/operations/dashboard/EmployeeProfileDrawer.tsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  User,
  Mail,
  Building2,
  Shield,
  Calendar,
  Clock,
  Key,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Hash,
} from 'lucide-react';

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

interface EmployeeProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeDetails | null;
}

const EmployeeProfileDrawer: React.FC<EmployeeProfileDrawerProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!employee) return null;

  const initial = employee.fullName.charAt(0).toUpperCase();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPasswordStatus = () => {
    const days = employee.daysUntilPasswordExpiry;
    if (employee.passwordExpired || (days !== undefined && days <= 0)) {
      return { label: 'Expired', color: 'text-red-600 bg-red-50 border-red-200', icon: <XCircle className="w-4 h-4 text-red-500" /> };
    }
    if (days !== undefined && days <= 7) {
      return { label: `Expires in ${days}d`, color: 'text-red-600 bg-red-50 border-red-200', icon: <AlertTriangle className="w-4 h-4 text-red-500" /> };
    }
    if (days !== undefined && days <= 15) {
      return { label: `Expires in ${days}d`, color: 'text-yellow-700 bg-yellow-50 border-yellow-200', icon: <AlertTriangle className="w-4 h-4 text-yellow-500" /> };
    }
    return { label: `${days ?? '–'}d remaining`, color: 'text-green-700 bg-green-50 border-green-200', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> };
  };

  const passwordStatus = getPasswordStatus();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full bg-white shadow-2xl z-[70] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1a2235 0%, #1e2d40 50%, #16202e 100%)',
          }}
        >
          <h2 className="text-lg font-bold text-white">My Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Avatar + Name Block */}
          <div
            className="px-6 pt-6 pb-5"
            style={{
              background: 'linear-gradient(180deg, #1e2d40 0%, #f9fafb 100%)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-4 ring-blue-500/30 shadow-xl flex-shrink-0">
                <span className="text-white font-bold text-2xl">{initial}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{employee.fullName}</h3>
                <p className="text-sm text-blue-300 mt-0.5">{employee.roleName}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                      employee.isActive
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {employee.isActive ? (
                      <><CheckCircle2 className="w-3 h-3" /> Active</>
                    ) : (
                      <><XCircle className="w-3 h-3" /> Inactive</>
                    )}
                  </span>
                  <span className="text-xs text-blue-300/60 font-mono">{employee.empId}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">

            {/* ── Identity Details ── */}
            <Section title="Identity">
              <InfoRow icon={<Hash className="w-4 h-4 text-blue-500" />} label="Employee ID" value={employee.empId} mono />
              <InfoRow icon={<User className="w-4 h-4 text-blue-500" />} label="First Name" value={employee.firstName} />
              {employee.middleName && (
                <InfoRow icon={<User className="w-4 h-4 text-blue-500" />} label="Middle Name" value={employee.middleName} />
              )}
              <InfoRow icon={<User className="w-4 h-4 text-blue-500" />} label="Last Name" value={employee.lastName} />
              <InfoRow icon={<Mail className="w-4 h-4 text-blue-500" />} label="Email" value={employee.email} />
            </Section>

            {/* ── Organization ── */}
            <Section title="Organization">
              <InfoRow icon={<Building2 className="w-4 h-4 text-purple-500" />} label="Department" value={employee.departmentName} />
              <InfoRow icon={<Shield className="w-4 h-4 text-purple-500" />} label="Role" value={employee.roleName} />
              {employee.createdBy && (
                <InfoRow icon={<User className="w-4 h-4 text-purple-500" />} label="Created By" value={employee.createdBy} />
              )}
              {employee.createdAt && (
                <InfoRow icon={<Calendar className="w-4 h-4 text-purple-500" />} label="Joined On" value={formatDate(employee.createdAt)} />
              )}
            </Section>

            {/* ── Activity ── */}
            <Section title="Activity">
              <InfoRow
                icon={<Clock className="w-4 h-4 text-teal-500" />}
                label="Last Login"
                value={formatDateTime(employee.lastLoginDate)}
              />
              <InfoRow
                icon={<Key className="w-4 h-4 text-teal-500" />}
                label="Last Password Change"
                value={formatDate(employee.lastPasswordChangeDate)}
              />
            </Section>

            {/* ── Password Security ── */}
            <Section title="Password Security">
              <div className={`flex items-center gap-3 p-3 border rounded-lg ${passwordStatus.color}`}>
                {passwordStatus.icon}
                <div>
                  <p className="text-xs font-semibold">{passwordStatus.label}</p>
                  <p className="text-xs opacity-75 mt-0.5">
                    {employee.passwordExpired
                      ? 'Please change your password immediately'
                      : 'Password expires every 60 days'}
                  </p>
                </div>
              </div>
            </Section>
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0 space-y-2 bg-white">
          <button
            onClick={() => { onClose(); navigate('/auth/change-password'); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            <Key className="w-4 h-4" />
            Change Password
          </button>
        </div>
      </div>
    </>
  );
};

// ── Small reusable sub-components ──────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{title}</h4>
    <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100">
      {children}
    </div>
  </div>
);

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}> = ({ icon, label, value, mono }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-sm font-medium text-gray-800 truncate mt-0.5 ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
    </div>
  </div>
);

export default EmployeeProfileDrawer;
