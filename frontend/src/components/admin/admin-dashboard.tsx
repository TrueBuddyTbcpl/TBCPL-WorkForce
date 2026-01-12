import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

type ViewMode = 'employees' | 'cases' | 'profiles';

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

  // Filter data based on search and filters
  const getFilteredData = () => {
    if (viewMode === 'employees') {
      let employees = getEmployeesByDepartment(selectedDepartment);
      
      if (searchQuery) {
        employees = employees.filter(emp => 
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (filters.role !== 'all') {
        employees = employees.filter(emp => emp.role === filters.role);
      }

      return employees;
    } else if (viewMode === 'cases') {
      let cases = mockCases;
      if (searchQuery) {
        cases = cases.filter(c => 
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.client.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (filters.status !== 'all') {
        cases = cases.filter(c => c.status === filters.status);
      }
      return cases;
    } else {
      let profiles = mockProfiles;
      if (searchQuery) {
        profiles = profiles.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.alias.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (filters.status !== 'all') {
        profiles = profiles.filter(p => p.status.toLowerCase() === filters.status.toLowerCase());
      }
      return profiles;
    }
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
          <div className="flex-1 p-6 mr-80">
            {/* ✅ Search Bar Only */}
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

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <p className="text-sm text-gray-600">Total {viewMode === 'employees' ? 'Employees' : viewMode === 'cases' ? 'Cases' : 'Profiles'}</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {viewMode === 'employees' ? departmentStats?.totalEmployees || 0 : 
                   viewMode === 'cases' ? mockCases.length : mockProfiles.length}
                </p>
              </div>

              {selectedDepartment === 'Operations' && viewMode === 'employees' && (
                <>
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-sm text-gray-600">Active Cases</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{departmentStats?.activeCases || 0}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-sm text-gray-600">Profiles Created</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{departmentStats?.profilesCreated || 0}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-sm text-gray-600">Reports Generated</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{departmentStats?.reportsGenerated || 0}</p>
                  </div>
                </>
              )}
            </div>

            {/* Data Display based on View Mode */}
            {viewMode === 'employees' ? (
              <EmployeeManagement 
                department={selectedDepartment}
                employees={getFilteredData() as any}
              />
            ) : viewMode === 'cases' ? (
              <CasesView cases={getFilteredData() as any} />
            ) : (
              <ProfilesView profiles={getFilteredData() as any} />
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Recent Activity */}
      <RecentActivityFeed />
    </div>
  );
};

// Cases View Component
const CasesView: React.FC<{ cases: any[] }> = ({ cases }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">All Cases</h2>
      {cases.length === 0 ? (
        <p className="text-center text-gray-600 py-12">No cases found</p>
      ) : (
        <div className="space-y-3">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              onClick={() => navigate(`/operations/case-index/${caseItem.id}`)}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{caseItem.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{caseItem.caseNumber} • {caseItem.client.name}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`px-2 py-1 rounded-full font-medium ${
                      caseItem.status === 'open' ? 'bg-green-100 text-green-800' :
                      caseItem.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                      caseItem.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {caseItem.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full font-medium ${
                      caseItem.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      caseItem.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      caseItem.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {caseItem.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Profiles View Component
const ProfilesView: React.FC<{ profiles: any[] }> = ({ profiles }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Culprit Profiles</h2>
      {profiles.length === 0 ? (
        <p className="text-center text-gray-600 py-12">No profiles found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => navigate(`/operations/profile/view/${profile.id}`)}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {profile.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                  <p className="text-sm text-gray-600">Alias: {profile.alias}</p>
                  <p className="text-xs text-gray-500 mt-1">{profile.address.city}, {profile.address.state}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    profile.status === 'Active' ? 'bg-green-100 text-green-800' :
                    profile.status === 'Under Investigation' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {profile.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
