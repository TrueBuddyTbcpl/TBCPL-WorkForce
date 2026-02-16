// src/components/operations/dashboard/dashboard-index.tsx
import React from 'react';
import DashboardLayout from './DashboardLayout';
import DashboardStats from './DashboardStats';
import EmployeePreReportList from '../dashboard/EmployeePreReportList';
import NotificationPanel from './NotificationPanel';



const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Statistics */}
        <DashboardStats />


        {/* Main Content - Full Width */}
        <div className="w-full"> {/* ✅ CHANGED: Removed grid, now full width */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <EmployeePreReportList />
          </div>
        </div>
      </div>
      
      {/* ✅ Notification Panel - Positioned fixed on right */}
      <NotificationPanel />
    </DashboardLayout>
  );
};



export default Dashboard;
