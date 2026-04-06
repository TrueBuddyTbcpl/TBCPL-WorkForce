import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ViewMode } from './types/superAdmin.types';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminTopBar from './SuperAdminTopBar';

import EmployeeManagement from '../admin/EmployeeManagement';
import AdminCaseList from './cases/AdmincaseList';
import AdminProfileList from './offenders/AdminProfileList';
import { AdminPreReportList } from '../admin/prereport/AdminPreReportList';
import ClientManagement from '../admin/ClientManagement';
import AdminFinalReportList from '../admin/finalreports/AdminFinalReportList';
import AdminLoaList from '../admin/loa/AdminLoaList';
import AdminLoaCreate from '../admin/loa/AdminLoaCreate';
import AdminProposalList from '../admin/proposal/AdminProposalList';

import bgImage from '../../assets/images/super_admin_bg02.jpg';

const getViewModeFromPath = (pathname: string): ViewMode => {
  if (pathname.startsWith('/super-admin/cases'))        return 'cases';
  if (pathname.startsWith('/super-admin/profiles'))     return 'profiles';
  if (pathname.startsWith('/super-admin/pre-reports'))  return 'prereports';
  if (pathname.startsWith('/super-admin/clients'))      return 'clients';
  if (pathname.startsWith('/super-admin/finalreports')) return 'finalreports';
  if (pathname.startsWith('/super-admin/loa'))          return 'loa';
  if (pathname.startsWith('/super-admin/proposals'))    return 'proposals';
  return 'employees';
};

const SuperAdminDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    getViewModeFromPath(location.pathname)
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setViewMode(getViewModeFromPath(location.pathname));
  }, [location.pathname]);

  const handleViewChange = (mode: ViewMode, path: string) => {
    setViewMode(mode);
    navigate(path);
  };

  const renderView = () => {
    switch (viewMode) {
      case 'employees':    return <EmployeeManagement />;
      case 'cases':        return <AdminCaseList />;
      case 'profiles':     return <AdminProfileList />;
      case 'prereports':   return <AdminPreReportList />;
      case 'clients':      return <ClientManagement />;
      case 'finalreports': return <AdminFinalReportList />;
      case 'loa':
        return location.pathname.includes('/create') || location.pathname.includes('/edit')
          ? <AdminLoaCreate />
          : <AdminLoaList />;
      case 'proposals':    return <AdminProposalList />;
      default:             return null;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">

      {/* ── Layer 1: Background Image ── */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* ── Layer 2: Dark overlay for white text readability ── */}
      <div className="fixed inset-0 -z-10 bg-black/30" />

      {/* ── Top Bar ── */}
      <SuperAdminTopBar onMenuToggle={() => setSidebarCollapsed(prev => !prev)} />

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        <SuperAdminSidebar
          viewMode={viewMode}
          collapsed={sidebarCollapsed}
          onViewChange={handleViewChange}
        />

        <main className="flex-1 overflow-hidden flex flex-col">
          <TabBar viewMode={viewMode} onViewChange={handleViewChange} />
          <div className="flex-1 overflow-auto
            bg-white/10 backdrop-blur-md
            border border-white/20
            rounded-tl-2xl mx-2 mb-2">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

/* ── Tab Bar ── */
interface TabBarProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode, path: string) => void;
}

const TABS: { mode: ViewMode; label: string; path: string }[] = [
  { mode: 'employees',    label: 'Employees',         path: '/super-admin'              },
  { mode: 'cases',        label: 'Cases',             path: '/super-admin/cases'        },
  { mode: 'profiles',     label: 'Offender Profiles', path: '/super-admin/profiles'     },
  { mode: 'prereports',   label: 'Pre-Reports',       path: '/super-admin/pre-reports'  },
  { mode: 'clients',      label: 'Clients',           path: '/super-admin/clients'      },
  { mode: 'finalreports', label: 'Final Reports',     path: '/super-admin/finalreports' },
  { mode: 'loa',          label: 'LOA',               path: '/super-admin/loa'          },
  { mode: 'proposals',    label: 'Proposals',         path: '/super-admin/proposals'    },
];

const TabBar: React.FC<TabBarProps> = ({ viewMode, onViewChange }) => (
  <div className="flex items-center gap-1 px-3 pt-2 pb-0
    bg-white/10 backdrop-blur-xl border-b border-white/20
    overflow-x-auto scrollbar-none">
    {TABS.map(tab => {
      const isActive = viewMode === tab.mode;
      return (
        <button
          key={tab.mode}
          onClick={() => onViewChange(tab.mode, tab.path)}
          className={`
            relative flex items-center px-5 py-3 text-sm font-semibold
            whitespace-nowrap transition-all duration-200 flex-shrink-0
            [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]
            ${isActive
              ? 'text-white border-b-2 border-white'
              : 'text-white/60 hover:text-white border-b-2 border-transparent'
            }
          `}
        >
          {tab.label}
          {isActive && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px]
              bg-gradient-to-r from-transparent via-white to-transparent
              shadow-sm shadow-white/30" />
          )}
        </button>
      );
    })}
  </div>
);

export default SuperAdminDashboard;
