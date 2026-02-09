import React, { useState } from 'react';
import { ShieldAlert, TrendingDown, TrendingUp } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Pagination } from '../../components/common/Pagination';
import { LoginAttemptsTable } from '../../components/loginHistory/LoginAttemptsTable';
import { LoginHistoryFilters } from '../../components/loginHistory/LoginHistoryFilters';
import { useLoginAttempts } from '../../hooks/useLoginHistory';
import { getErrorMessage } from '../../utils/errorHandler';
import type { LoginAttempt } from '../../types/loginHistory.types';

export const LoginAttemptsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error } = useLoginAttempts({
    page,
    size,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    isSuccess: statusFilter === 'success' ? true : statusFilter === 'failed' ? false : undefined,
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

  // Filter login attempts by search query (client-side)
  const filteredAttempts = data?.data?.loginAttempts?.filter((attempt: LoginAttempt) => {
    const searchLower = searchQuery.toLowerCase();
    return attempt.email.toLowerCase().includes(searchLower);
  }) || [];

  const successCount = filteredAttempts.filter((a) => a.isSuccess).length;
  const failedCount = filteredAttempts.filter((a) => !a.isSuccess).length;
  const successRate = filteredAttempts.length > 0 
    ? ((successCount / filteredAttempts.length) * 100).toFixed(1)
    : '0';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading login attempts..." />
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
          <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Login Attempts</h2>
            <p className="text-sm text-gray-600 mt-1">
              Monitor all login attempts including failed attempts
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 font-medium">Total Attempts</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {data?.data?.totalElements || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <p className="text-sm text-gray-600 font-medium">Successful</p>
          </div>
          <p className="text-3xl font-bold text-green-600 mt-2">{successCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <p className="text-sm text-gray-600 font-medium">Failed</p>
          </div>
          <p className="text-3xl font-bold text-red-600 mt-2">{failedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 font-medium">Success Rate</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{successRate}%</p>
        </div>
      </div>

      {/* Security Alert */}
      {failedCount > 5 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">Security Alert</p>
              <p className="text-sm text-red-800 mt-1">
                High number of failed login attempts detected ({failedCount} failures). 
                Please review suspicious activity.
              </p>
            </div>
          </div>
        </div>
      )}

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
      <LoginAttemptsTable loginAttempts={filteredAttempts} />

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
