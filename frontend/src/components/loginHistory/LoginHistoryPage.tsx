import React, { useState } from 'react';
import { History } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Pagination } from '../../components/common/Pagination';
import { LoginHistoryTable } from '../../components/loginHistory/LoginHistoryTable';
import { LoginHistoryFilters } from '../../components/loginHistory/LoginHistoryFilters';
import { useLoginHistory } from '../../hooks/useLoginHistory';
import { getErrorMessage } from '../../utils/errorHandler';
import type { LoginHistory } from '../../types/loginHistory.types';

export const LoginHistoryPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error } = useLoginHistory({
    page,
    size,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    isActive: statusFilter === 'active' ? true : statusFilter === 'ended' ? false : undefined,
  });

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setPage(0);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(0);
  };

  // Filter login histories by search query (client-side)
  const filteredHistories = data?.data?.loginHistories?.filter((history: LoginHistory) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      history.fullName.toLowerCase().includes(searchLower) ||
      history.email.toLowerCase().includes(searchLower) ||
      history.empId.toLowerCase().includes(searchLower)
    );
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading login history..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{getErrorMessage(error)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <History className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Login History</h2>
            <p className="text-sm text-gray-600 mt-1">
              View all employee login sessions and activity
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 font-medium">Total Sessions</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {data?.data?.totalElements || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 font-medium">Active Sessions</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {filteredHistories.filter((h) => h.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 font-medium">Ended Sessions</p>
          <p className="text-3xl font-bold text-gray-600 mt-2">
            {filteredHistories.filter((h) => !h.isActive).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <LoginHistoryFilters
        onSearchChange={setSearchQuery}
        onDateRangeChange={handleDateRangeChange}
        onStatusChange={handleStatusChange}
        searchQuery={searchQuery}
        startDate={startDate}
        endDate={endDate}
        statusFilter={statusFilter}
      />

      {/* Table */}
      <LoginHistoryTable loginHistories={filteredHistories} />

      {/* Pagination */}
      {data?.data && (
        <Pagination
          currentPage={data.data.currentPage}
          totalPages={data.data.totalPages}
          onPageChange={setPage}
          totalElements={data.data.totalElements}
          pageSize={data.data.pageSize}
        />
      )}
    </div>
  );
};
