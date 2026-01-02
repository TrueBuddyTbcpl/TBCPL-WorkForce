// src/components/operations/dashboard/dashboard-index.tsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import DashboardStats from './DashboardStats';
import CasesOverview from './CasesOverview';
import RecentProfiles from './RecentProfiles';
import { dashboardStorage } from './utils/dashboardStorage';
import { initializeDashboardData } from '../../../utils/initializeDashboardData'; // ✅ Import from separate file
import type { Case, DashboardFilters } from './types/dashboard.types';

const Dashboard: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [filters, setFilters] = useState<DashboardFilters>({
    searchQuery: '',
    clientName: [],
    productName: [],
    status: [],
    priority: [],
    assignedTo: [],
  });

  useEffect(() => {
    // Initialize dummy data if no cases exist
    const loadedCases = dashboardStorage.getCases();
    
    if (loadedCases.length === 0) {
      // No cases found, initialize with dummy data
      console.log('Initializing dashboard with dummy data...');
      initializeDashboardData(); // Call the function from initializeDashboardData.ts
      
      // Load the newly initialized data
      const newCases = dashboardStorage.getCases();
      setCases(newCases);
      setFilteredCases(newCases);
    } else {
      // Cases already exist, use them
      setCases(loadedCases);
      setFilteredCases(loadedCases);
    }
  }, []);

  useEffect(() => {
    // Apply filters
    let result = cases;

    if (filters.searchQuery) {
      result = result.filter(c =>
        c.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        c.client.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    if (filters.clientName.length > 0) {
      result = result.filter(c => filters.clientName.includes(c.client.name));
    }

    if (filters.productName.length > 0) {
      result = result.filter(c => filters.productName.includes(c.client.productName));
    }

    if (filters.status.length > 0) {
      result = result.filter(c => filters.status.includes(c.status));
    }

    if (filters.priority.length > 0) {
      result = result.filter(c => filters.priority.includes(c.priority));
    }

    if (filters.assignedTo.length > 0) {
      result = result.filter(c => filters.assignedTo.includes(c.assignedTo.name));
    }

    setFilteredCases(result);
  }, [filters, cases]);

  const handleFilterChange = (newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Function to manually reset/reinitialize data
  const handleResetData = () => {
    if (confirm('This will reset all dashboard data to default dummy data. Continue?')) {
      initializeDashboardData();
      const newCases = dashboardStorage.getCases();
      setCases(newCases);
      setFilteredCases(newCases);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Dashboard Info Bar */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-blue-900">
                Dashboard Overview
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Showing {cases.length} total cases, {filteredCases.length} after filters
              </p>
            </div>
            <button
              onClick={handleResetData}
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset to Sample Data
            </button>
          </div>
        </div>

        {/* Top Statistics */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Cases Overview - Takes 3 columns */}
          <div className="lg:col-span-3">
            <CasesOverview
              cases={filteredCases}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Recent Profiles - Takes 1 column */}
          <div className="lg:col-span-1">
            <RecentProfiles />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
