// src/components/admin/cases/AdminCaseList.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  FileText,
  FolderOpen,
  AlertCircle,
  Search,
} from 'lucide-react';
import { useCases } from '../../../hooks/cases/useCases';
import type { CaseListItem } from '../../operations/Cases/types/case.types';

const AdminCaseList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size] = useState(15);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useCases({
    page,
    size,
    status: statusFilter || undefined,
  });

  const cases = data?.cases || [];
  const pagination = data?.pagination;

  const filteredCases = searchQuery
    ? cases.filter(
        (c) =>
          c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cases;

  const handleViewCase = (c: CaseListItem) => {
    navigate(`/admin/cases/${c.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading cases...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-semibold">Error loading cases</p>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FolderOpen className="w-7 h-7 text-blue-600" />
          All Cases (Admin View)
        </h1>
        <p className="text-gray-600 mt-1">Manage and track all investigation cases</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{pagination?.totalCases ?? 0}</div>
          <div className="text-sm text-gray-600 mt-1">Total Cases</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {cases.filter((c) => c.status?.toLowerCase() === 'in-progress').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Under Investigation</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {cases.filter((c) => c.status?.toLowerCase() === 'closed').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Closed Cases</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">
            {cases.filter((c) => c.priority?.toLowerCase() === 'critical').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Critical Priority</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by case number, client, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="on-hold">On Hold</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Cases List */}
      {filteredCases.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <FileText className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Cases Found</h3>
          <p className="text-gray-600">Cases will appear here once created from Pre-Reports</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                All Cases ({pagination?.totalCases ?? filteredCases.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredCases.map((c) => (
                <div
                  key={c.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleViewCase(c)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{c.clientName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(c.priority)}`}>
                          {c.priority}
                        </span>
                      </div>
                      <p className="text-sm text-blue-600 font-medium mb-1">
                        Product: {c.clientProduct}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">{c.caseTitle}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Case #: {c.caseNumber}</span>
                        <span>•</span>
                        <span>Type: {c.caseType || 'N/A'}</span>
                        <span>•</span>
                        <span>Lead: {c.leadType}</span>
                        <span>•</span>
                        <span>Opened: {new Date(c.dateOpened).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleViewCase(c); }}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Showing {page * size + 1} to{' '}
                {Math.min((page + 1) * size, pagination.totalCases)} of{' '}
                {pagination.totalCases} results
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {page + 1} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages - 1, p + 1))}
                  disabled={page >= pagination.totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCaseList;
