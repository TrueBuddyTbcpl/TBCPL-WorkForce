import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Home } from 'lucide-react';

const FieldAssociateSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (route: string) => location.pathname === route;

  const navigationLinks = [
    {
      icon: Home,
      label: 'Dashboard',
      route: '/field-associate/dashboard',
    },
    {
      icon: FileText,
      label: 'My Authority Letters',
      route: '/field-associate/loa',
    },
  ];

  return (
    <aside
      className="w-64 flex flex-col sticky top-20 min-h-[calc(100vh-80px)]"
      style={{
        background: 'linear-gradient(180deg, #1a2235 0%, #1e2d40 60%, #16202e 100%)',
      }}
    >
      {/* Brand Strip */}
      <div className="px-5 py-4 border-b border-white/10 flex-shrink-0">
        <p className="text-[10px] font-bold tracking-[0.25em] text-blue-400 uppercase">
          Field Associate Hub
        </p>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1">
        <h3 className="text-[10px] font-bold text-blue-300/60 uppercase tracking-widest mb-3">
          Navigation
        </h3>
        <div className="space-y-0.5">
          {navigationLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => navigate(link.route)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                isActive(link.route)
                  ? 'bg-blue-500/20 text-white border border-blue-500/30'
                  : 'text-gray-400 hover:bg-white/8 hover:text-gray-100'
              }`}
            >
              <link.icon className={`w-4 h-4 flex-shrink-0 ${isActive(link.route) ? 'text-blue-400' : ''}`} />
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

export default FieldAssociateSidebar;
