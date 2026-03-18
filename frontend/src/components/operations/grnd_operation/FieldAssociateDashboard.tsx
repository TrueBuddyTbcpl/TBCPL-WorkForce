import React from 'react';
import FieldAssociateSidebar from './FieldAssociateSidebar';
import FieldAssociateLoaList from './FieldAssociateLoaList';
import EmployeeProfileSection from '../dashboard/EmployeeProfileSection';
import NotificationPanel from '../dashboard/NotificationPanel';

/**
 * Field Associate Dashboard.
 * Mirrors the DashboardLayout shell exactly (same header/layout pattern),
 * but uses its own sidebar and shows only the assigned LOAs.
 */
const FieldAssociateDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ────────────────────────────────────────────────── */}
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
              Field Associate Dashboard
            </p>
          </div>
          <EmployeeProfileSection />
        </div>
      </header>

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <div
        className="fixed top-[60px] left-0 z-40 h-[calc(100vh-60px)] overflow-y-auto"
        style={{ width: '256px' }}
      >
        <FieldAssociateSidebar />
      </div>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <main
        className="min-h-screen"
        style={{
          paddingTop: '60px',
          paddingLeft: '256px',
          background: 'linear-gradient(180deg, #1a2235 0%, #1e2d40 60%, #16202e 100%)',
        }}
      >
        <div className="p-6">
          <FieldAssociateLoaList />
        </div>
      </main>

      {/* ── Notification Panel ────────────────────────────────────── */}
      <NotificationPanel />
    </div>
  );
};

export default FieldAssociateDashboard;
