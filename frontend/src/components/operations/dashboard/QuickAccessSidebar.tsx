// src/components/operations/dashboard/QuickAccessSidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserPlus,
  FileText,
  Users,
  FolderOpen,
  ClipboardList,
} from 'lucide-react';

const QuickAccessSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (route: string) => location.pathname === route;

  const quickActions = [
    {
      icon: FileText,
      label: 'New Pre-Report',
      description: 'Create preliminary report',
      route: '/operations/pre-report/create',
      disabled: false,
    },
    {
      icon: UserPlus,
      label: 'New Profile',
      description: 'Create culprit profile',
      route: '/operations/profile-form',
      disabled: false,
    },
  ];

  const navigationLinks = [
    { icon: FileText, label: 'All Pre-Reports', route: '/operations/pre-reports', disabled: false },
    { icon: FolderOpen, label: 'All Cases', route: '/operations/cases', disabled: false },
    { icon: Users, label: 'All Profiles', route: '/operations/profile', disabled: false },
    { icon: ClipboardList, label: 'Final Reports', route: '/operations/final-reports', disabled: false },
  ];

  return (
    <aside
      className="w-64 flex flex-col sticky top-20 min-h-[calc(100vh-80px)]" // ✅ ADD min-h
      style={{
        background: 'linear-gradient(180deg, #1a2235 0%, #1e2d40 60%, #16202e 100%)',
      }}
    >
      {/* Brand Strip */}
      <div className="px-5 py-4 border-b border-white/10 flex-shrink-0">
        <p className="text-[10px] font-bold tracking-[0.25em] text-blue-400 uppercase">
          Operations Hub
        </p>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-white/10 flex-shrink-0">
        <h3 className="text-[10px] font-bold text-blue-300/60 uppercase tracking-widest mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => !action.disabled && navigate(action.route)}
              disabled={action.disabled}
              className={`w-full text-left p-3 rounded-lg border transition-all
                ${action.disabled
                  ? 'border-white/5 bg-white/5 cursor-not-allowed opacity-40'
                  : 'border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-400/50 cursor-pointer'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md flex-shrink-0 ${action.disabled ? 'bg-white/10' : 'bg-blue-500/20'}`}>
                  <action.icon className={`w-4 h-4 ${action.disabled ? 'text-gray-500' : 'text-blue-300'}`} />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${action.disabled ? 'text-gray-500' : 'text-gray-100'}`}>
                    {action.label}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1">
        <h3 className="text-[10px] font-bold text-blue-300/60 uppercase tracking-widest mb-3">
          Navigation
        </h3>
        <div className="space-y-0.5">
          {navigationLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => !link.disabled && navigate(link.route)}
              disabled={link.disabled}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left
                ${link.disabled
                  ? 'text-gray-600 cursor-not-allowed opacity-40'
                  : isActive(link.route)
                    ? 'bg-blue-500/20 text-white border border-blue-500/30'
                    : 'text-gray-400 hover:bg-white/8 hover:text-gray-100'
                }`}
            >
              <link.icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive(link.route) ? 'text-blue-400' : ''}`} />
              <span className="text-sm">{link.label}</span>
              {isActive(link.route) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default QuickAccessSidebar;
