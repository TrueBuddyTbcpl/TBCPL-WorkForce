import React from 'react';
import QuickAccessSidebar from './QuickAccessSidebar';
import EmployeeProfileSection from './EmployeeProfileSection';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TBCPL Workforce Management</h1>
            <p className="text-sm text-gray-600 mt-1">Investigation & Case Management Dashboard</p>
          </div>
          
          {/* Employee Profile Section (Top Right) */}
          <EmployeeProfileSection />
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar - Quick Access */}
        <QuickAccessSidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
