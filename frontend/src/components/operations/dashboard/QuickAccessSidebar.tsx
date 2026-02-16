import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, FolderPlus, FileText, Home, BarChart3, Users } from 'lucide-react';


const QuickAccessSidebar: React.FC = () => {
  const navigate = useNavigate();


  const quickActions = [
    {
      icon: FileText,
      label: 'New Pre-Report',
      description: 'Create preliminary report',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      route: '/operations/pre-report/create',
      disabled: false,
    },
    {
      icon: UserPlus,
      label: 'New Profile',
      description: 'Create culprit profile',
      color: 'bg-gray-400',
      hoverColor: 'hover:bg-gray-400',
      route: '/operations/profile-form',
      disabled: true,
    },
    {
      icon: FolderPlus,
      label: 'New Case',
      description: 'Start investigation',
      color: 'bg-gray-400',
      hoverColor: 'hover:bg-gray-400',
      route: '/operations/case',
      disabled: true,
    },
    {
      icon: FileText,
      label: 'New Report',
      description: 'Generate report',
      color: 'bg-gray-400',
      hoverColor: 'hover:bg-gray-400',
      route: '/operations/report-create',
      disabled: true,
    },
  ];


  const navigationLinks = [
    { icon: Home, label: 'Dashboard', route: '/operations/dashboard', disabled: false },
    { icon: FileText, label: 'All Pre-Reports', route: '/operations/pre-reports', disabled: false },
    { icon: FolderPlus, label: 'All Cases', route: '/operations/case', disabled: true },
    { icon: Users, label: 'All Profiles', route: '/operations/profile', disabled: true },
    { icon: FileText, label: 'Reports', route: '/operations/reports', disabled: true },
    { icon: BarChart3, label: 'Analytics', route: '/operations/analytics', disabled: false },
  ];


  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16">
      {/* Quick Actions Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => !action.disabled && navigate(action.route)}
              disabled={action.disabled}
              className={`w-full ${action.color} ${!action.disabled ? action.hoverColor : 'cursor-not-allowed'} text-white p-3 rounded-lg transition shadow-sm ${!action.disabled ? 'hover:shadow-md' : 'opacity-50'} group`}
            >
              <div className="flex items-center gap-3">
                <action.icon className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-sm font-semibold">{action.label}</p>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>


      {/* Navigation Links */}
      <nav className="p-4">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
          Navigation
        </h3>
        <div className="space-y-1">
          {navigationLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => !link.disabled && navigate(link.route)}
              disabled={link.disabled}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                link.disabled 
                  ? 'text-gray-400 cursor-not-allowed opacity-50' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span className="text-sm">{link.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
};


export default QuickAccessSidebar;
