import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  FolderOpen,
  Building2,
  UserCog,
  History,
  Shield,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../stores/authStore';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const isAdmin = user?.roleName === 'SUPER_ADMIN' || user?.roleName === 'HR_MANAGER';

  const navItems = [
    {
      title: 'Operations',
      items: [
        {
          name: 'Dashboard',
          path: '/operations/dashboard',
          icon: LayoutDashboard,
        },
        {
          name: 'Pre-Reports',
          path: '/operations/pre-report',
          icon: FileText,
        },
        {
          name: 'Reports',
          path: '/operations/reports',
          icon: FolderOpen,
        },
        {
          name: 'Profiles',
          path: '/operations/profile',
          icon: Users,
        },
        {
          name: 'Cases',
          path: '/operations/case',
          icon: Briefcase,
        },
      ],
    },
  ];

  // Add Admin section if user is admin
  if (isAdmin) {
    navItems.push({
      title: 'Administration',
      items: [
        {
          name: 'Admin Dashboard',
          path: '/admin',
          icon: Shield,
        },
        {
          name: 'Employee Management',
          path: '/admin/employees',
          icon: UserCog,
        },
        {
          name: 'Departments',
          path: '/admin/departments',
          icon: Building2,
        },
        {
          name: 'Login History',
          path: '/admin/login-history',
          icon: History,
        },
      ],
    });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header - Only visible on mobile */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6 overflow-y-auto h-full pb-20">
          {navItems.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        )
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};
