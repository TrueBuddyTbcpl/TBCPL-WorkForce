import React from 'react';
import QuickAccessSidebar from './QuickAccessSidebar';
import EmployeeProfileSection from './EmployeeProfileSection';
import NotificationPanel from './NotificationPanel'; // ✅ added

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header — fixed ───────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: 'linear-gradient(135deg, #1a2235 0%, #1e2d40 40%, #243447 70%, #16202e 100%)',
          borderColor: 'rgba(255,255,255,0.07)',
        }}
      >
        <div className="px-4 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              TBCPL Workforce Management
            </h1>
            <p className="text-xs text-blue-300/60 mt-0.5 tracking-wide">
              Investigation & Case Management Dashboard
            </p>
          </div>
          <EmployeeProfileSection />
        </div>
      </header>

      {/* ── Sidebar — fixed below header ─────────────────────────────── */}
      <div
        className="fixed top-[60px] left-0 z-40 h-[calc(100vh-60px)] overflow-y-auto"
        style={{ width: '256px' }}
      >
        <QuickAccessSidebar />
      </div>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main
        className="bg-gray-50 min-h-screen"
        style={{ paddingTop: '60px', paddingLeft: '256px' }}
      >
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* ── Notification Panel — fixed right side tab ─────────────────── */}
      <NotificationPanel />

    </div>
  );
};

export default DashboardLayout;
