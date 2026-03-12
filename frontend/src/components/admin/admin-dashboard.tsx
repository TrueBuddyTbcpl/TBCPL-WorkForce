import React, { useState, useEffect } from 'react';
import type { Department, DepartmentStats } from './types/admin.types';
import { getEmployeesByDepartment, getManagerByDepartment } from '../../data/mockData/mockEmployees';
import { mockCases } from '../../data/mockData/mockCases';
import { mockProfiles } from '../../data/mockData/mockProfiles';
import { mockReports } from '../../data/mockData/mockReports';
import AdminSidebar from './AdminSidebar';
import AdminProfile from './AdminProfile';
import RecentActivityFeed from './RecentActivityFeed';
import EmployeeManagement from './EmployeeManagement';
import { Search } from 'lucide-react';
import { AdminPreReportList } from './prereport/AdminPreReportList'; // ✅ Add this import
import ClientManagement from './ClientManagement';
import AdminFinalReportList from './finalreports/AdminFinalReportList';
import AdminCaseList from './cases/AdminCaseList';
import AdminProfileList from './AdminProfileList';


type ViewMode = 'employees' | 'cases' | 'profiles' | 'prereports' | 'clients' | 'finalreports';


const AdminDashboard: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('Operations');
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('employees'); // ✅ Moved to sidebar
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
  }); // ✅ Moved to sidebar

  useEffect(() => {
    loadDepartmentStats();
  }, [selectedDepartment]);

  const loadDepartmentStats = () => {
    const employees = getEmployeesByDepartment(selectedDepartment);
    const manager = getManagerByDepartment(selectedDepartment);

    let stats: DepartmentStats = {
      department: selectedDepartment,
      totalEmployees: employees.length,
      manager: manager ? {
        id: manager.id,
        name: manager.name,
        email: manager.email,
        phone: manager.phone,
      } : {
        id: '',
        name: 'Not Assigned',
        email: '',
        phone: '',
      },
    };

    if (selectedDepartment === 'Operations') {
      stats.activeCases = mockCases.filter(c => c.status !== 'closed').length;
      stats.profilesCreated = mockProfiles.length;
      stats.reportsGenerated = mockReports.length;
    }

    setDepartmentStats(stats);
  };

  const handleDepartmentChange = (dept: Department) => {
    setSelectedDepartment(dept);
  };



  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ✅ Left Sidebar with View Mode and Filters */}
      <AdminSidebar
        selectedDepartment={selectedDepartment}
        onDepartmentChange={handleDepartmentChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Header with Admin Profile */}
        <AdminProfile />

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Center Content */}
          <div className="flex-1 p-6">

            {/* ✅ Search Bar Only - Hide for prereports and clients */}
            {viewMode !== 'prereports' && viewMode !== 'clients' && viewMode !== 'finalreports' && viewMode !== 'profiles' && (
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${viewMode === 'employees' ? 'employees' : viewMode === 'cases' ? 'cases' : 'profiles'}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Statistics Cards - Hide for prereports and clients */}
            {viewMode !== 'prereports' && viewMode !== 'clients' && viewMode !== 'finalreports' && viewMode !== 'cases' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Total Employees Card - Active */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <p className="text-sm text-gray-600">Total Employees</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {departmentStats?.totalEmployees || 0}
                  </p>
                </div>

                {/* Active Cases Card - Disabled */}
                <div className="bg-white rounded-lg shadow-sm border p-6 opacity-50">
                  <p className="text-sm text-gray-600">Active Cases</p>
                  <p className="text-3xl font-bold text-gray-400 mt-2">0</p>
                </div>

                {/* Profiles Created Card - Disabled */}
                <div className="bg-white rounded-lg shadow-sm border p-6 opacity-50">
                  <p className="text-sm text-gray-600">Profiles Created</p>
                  <p className="text-3xl font-bold text-gray-400 mt-2">0</p>
                </div>

                {/* Reports Generated Card - Disabled */}
                <div className="bg-white rounded-lg shadow-sm border p-6 opacity-50">
                  <p className="text-sm text-gray-600">Reports Generated</p>
                  <p className="text-3xl font-bold text-gray-400 mt-2">0</p>
                </div>
              </div>
            )}


            {/* Data Display based on View Mode */}
            {viewMode === 'employees' ? (
              <EmployeeManagement
              />
            ) : viewMode === 'cases' ? (
              <AdminCaseList />
            ) : viewMode === 'profiles' ? (
              <AdminProfileList />
            ) : viewMode === 'prereports' ? ( // ✅ Add this
              <AdminPreReportList />
            ) : viewMode === 'clients' ? (
              <ClientManagement />
            ) : viewMode === 'finalreports' ? (
              <AdminFinalReportList />
            ) : null}

          </div>
        </div>
      </div>

      {/* Right Sidebar - Recent Activity */}
      <RecentActivityFeed />
    </div>
  );
};



export default AdminDashboard;
