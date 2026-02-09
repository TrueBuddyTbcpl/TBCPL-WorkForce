import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  FileText,
  Calendar,
  User,
  AlertCircle,
  Search,
  Filter,
  X,
  ChevronDown,
} from 'lucide-react';
import { usePreReports } from '../../../hooks/prereport/usePreReports';
import apiClient from '../../../services/api/apiClient';


interface ClientOption {
  id: number;
  name: string;
}

interface EmployeeOption {
  id: number;
  name: string;
  empId: string;
}

export const AdminPreReportList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size] = useState(15);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [clientName, setClientName] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [leadType, setLeadType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Dropdown search states
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  // Data for dropdowns
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    clientName: '',
    createdBy: '',
    leadType: '',
    dateFrom: '',
    dateTo: '',
  });

  const { data, isLoading, isError } = usePreReports({ page, size });

  // Fetch all clients for dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoadingClients(true);
        const res = await apiClient.get('/api/v1/admin/clients');
        const list = (res.data?.data || []) as any[];
        setClients(
          list.map((c) => ({
            id: c.id,
            name: c.name, // adjust if your field is different (e.g. clientName)
          }))
        );
      } catch (error) {
        console.error('Failed to load clients', error);
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  // Fetch employees for dropdown (first page, large size)
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoadingEmployees(true);
        const res = await apiClient.get('/api/v1/auth/employees', {
          params: { page: 0, size: 1000, sort: 'empId', direction: 'ASC' },
        });
        const list = (res.data?.data?.employees || []) as any[];
        setEmployees(
          list.map((e) => ({
            id: e.id,
            name: e.fullName || e.name,
            empId: e.empId,
          }))
        );
      } catch (error) {
        console.error('Failed to load employees', error);
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredClients = useMemo(() => {
    if (!clientSearchQuery) return clients;
    return clients.filter((c) =>
      c.name.toLowerCase().includes(clientSearchQuery.toLowerCase())
    );
  }, [clients, clientSearchQuery]);

  const filteredEmployees = useMemo(() => {
    if (!employeeSearchQuery) return employees;
    return employees.filter((e) =>
      e.name.toLowerCase().includes(employeeSearchQuery.toLowerCase())
    );
  }, [employees, employeeSearchQuery]);

  const handleSearch = () => {
    setAppliedFilters({
      clientName,
      createdBy,
      leadType,
      dateFrom,
      dateTo,
    });
    setPage(0);
  };

  const handleClearFilters = () => {
    setClientName('');
    setCreatedBy('');
    setLeadType('');
    setDateFrom('');
    setDateTo('');
    setClientSearchQuery('');
    setEmployeeSearchQuery('');
    setAppliedFilters({
      clientName: '',
      createdBy: '',
      leadType: '',
      dateFrom: '',
      dateTo: '',
    });
    setPage(0);
  };

  const handleClientSelect = (client: ClientOption | null) => {
    if (!client) {
      setClientName('');
      setClientSearchQuery('');
    } else {
      setClientName(client.name);
      setClientSearchQuery(client.name);
    }
    setShowClientDropdown(false);
  };

  const handleEmployeeSelect = (employee: EmployeeOption | null) => {
    if (!employee) {
      setCreatedBy('');
      setEmployeeSearchQuery('');
    } else {
      setCreatedBy(employee.name);
      setEmployeeSearchQuery(employee.name);
    }
    setShowEmployeeDropdown(false);
  };

  const getFilteredReports = () => {
    let reports = data?.reports || [];

    if (appliedFilters.clientName) {
      reports = reports.filter((r) =>
        r.clientName?.toLowerCase().includes(appliedFilters.clientName.toLowerCase())
      );
    }

    if (appliedFilters.createdBy) {
      reports = reports.filter((r) =>
        r.createdBy.toLowerCase().includes(appliedFilters.createdBy.toLowerCase())
      );
    }

    if (appliedFilters.leadType) {
      reports = reports.filter((r) => r.leadType === appliedFilters.leadType);
    }

    if (appliedFilters.dateFrom) {
      const from = new Date(appliedFilters.dateFrom);
      reports = reports.filter((r) => new Date(r.createdAt) >= from);
    }

    if (appliedFilters.dateTo) {
      const to = new Date(appliedFilters.dateTo + 'T23:59:59');
      reports = reports.filter((r) => new Date(r.createdAt) <= to);
    }

    return reports;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading reports...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-semibold mb-2">Error loading reports</p>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  const filteredReports = getFilteredReports();
  const pagination = data?.pagination;
  const hasActiveFilters =
    appliedFilters.clientName ||
    appliedFilters.createdBy ||
    appliedFilters.leadType ||
    appliedFilters.dateFrom ||
    appliedFilters.dateTo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Preliminary Reports</h2>
          <p className="text-sm text-gray-600 mt-1">
            View and manage all pre-investigation reports
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {Object.values(appliedFilters).filter(Boolean).length}
              </span>
            )}
          </button>

          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Total Reports</p>
            <p className="text-2xl font-bold text-blue-600">{filteredReports.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Reports</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Client dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={clientSearchQuery}
                  onChange={(e) => {
                    setClientSearchQuery(e.target.value);
                    setShowClientDropdown(true);
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  placeholder={
                    isLoadingClients ? 'Loading clients...' : 'Search client name...'
                  }
                  disabled={isLoadingClients}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

                {showClientDropdown && !isLoadingClients && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowClientDropdown(false)}
                    />
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredClients.length > 0 ? (
                        <>
                          <button
                            onClick={() => handleClientSelect(null)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-gray-500"
                          >
                            All Clients
                          </button>
                          {filteredClients.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => handleClientSelect(c)}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                                clientName === c.name
                                  ? 'bg-blue-50 text-blue-700 font-medium'
                                  : 'text-gray-900'
                              }`}
                            >
                              {c.name}
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No clients found
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Employee dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created By (Employee)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={employeeSearchQuery}
                  onChange={(e) => {
                    setEmployeeSearchQuery(e.target.value);
                    setShowEmployeeDropdown(true);
                  }}
                  onFocus={() => setShowEmployeeDropdown(true)}
                  placeholder={
                    isLoadingEmployees ? 'Loading employees...' : 'Search employee name...'
                  }
                  disabled={isLoadingEmployees}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

                {showEmployeeDropdown && !isLoadingEmployees && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowEmployeeDropdown(false)}
                    />
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredEmployees.length > 0 ? (
                        <>
                          <button
                            onClick={() => handleEmployeeSelect(null)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-gray-500"
                          >
                            All Employees
                          </button>
                          {filteredEmployees.map((e) => (
                            <button
                              key={e.id}
                              onClick={() => handleEmployeeSelect(e)}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                                createdBy === e.name
                                  ? 'bg-blue-50 text-blue-700 font-medium'
                                  : 'text-gray-900'
                              }`}
                            >
                              {e.name} ({e.empId})
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No employees found
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Lead type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lead Type
              </label>
              <select
                value={leadType}
                onChange={(e) => setLeadType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Lead Types</option>
                <option value="CLIENT_LEAD">Client Lead</option>
                <option value="TRUEBUDDY_LEAD">TrueBuddy Lead</option>
              </select>
            </div>

            {/* Date from */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date to */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {filteredReports.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/operations/pre-report/${report.reportId}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-blue-500 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {report.reportId}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {report.clientName || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            report.leadType === 'CLIENT_LEAD'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {report.leadType === 'CLIENT_LEAD'
                            ? 'Client Lead'
                            : 'TrueBuddy Lead'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            report.reportStatus === 'DRAFT'
                              ? 'bg-gray-100 text-gray-800'
                              : report.reportStatus === 'PENDING_APPROVAL'
                              ? 'bg-yellow-100 text-yellow-800'
                              : report.reportStatus === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : report.reportStatus === 'CHANGES_REQUESTED'
                              ? 'bg-orange-100 text-orange-800'
                              : report.reportStatus === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {report.reportStatus
                            ? report.reportStatus.replace(/_/g, ' ')
                            : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {report.createdBy}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">
                            {new Date(report.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/operations/pre-report/${report.reportId}`);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Showing {page * size + 1} to{' '}
                  {Math.min((page + 1) * size, pagination.totalReports)} of{' '}
                  {pagination.totalReports} results
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {page + 1} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages - 1, p + 1))
                  }
                  disabled={page >= pagination.totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No reports found</p>
          <p className="text-gray-400 text-sm mt-2">
            {hasActiveFilters
              ? 'Try adjusting or clearing your filters'
              : 'Pre-investigation reports will appear here'}
          </p>
        </div>
      )}
    </div>
  );
};
