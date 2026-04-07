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
  Briefcase,
} from 'lucide-react';
import { usePreReports } from '../../../hooks/prereport/usePreReports';
import apiClient from '../../../services/api/apiClient';
import { StatusDropdown } from '../StatusDropdown';
import { RequestChangesModal } from '../RequestChangesModal';
import { ReportStatus } from '../../../utils/constants';
import CreateCaseModal from '../../operations/Cases/CreateCaseModal';
import { useAuthStore } from '../../../stores/authStore';
import { toast } from 'sonner';


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

  const [creatingCaseForReportId, setCreatingCaseForReportId] = useState<number | null>(null);
  const [modalReport, setModalReport] = useState<{
    id: number;
    reportId: string;
    clientName: string;
  } | null>(null);

  const { user } = useAuthStore();

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

  // Modal state
  const [selectedReportForChanges, setSelectedReportForChanges] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = usePreReports({ page, size });

  // ✅ Build employee name map from already-loaded employees — zero extra API calls
  const employeeNamesMap = useMemo<Record<number, string>>(() => {
    return employees.reduce((map, emp) => {
      map[emp.id] = emp.name;
      return map;
    }, {} as Record<number, string>);
  }, [employees]);

  // Fetch all clients for dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoadingClients(true);
        const res = await apiClient.get('/admin/clients');
        const list = (res.data?.data || []) as any[];
        setClients(
          list.map((c) => ({
            id: c.id,
            name: c.name,
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

  // Fetch employees for dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoadingEmployees(true);
        const res = await apiClient.get('/auth/employees', {
          params: { page: 0, size: 1000, sort: 'empId', direction: 'ASC' },
        });
        const list = (res.data?.data?.content || []) as any[];
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
    setAppliedFilters({ clientName, createdBy, leadType, dateFrom, dateTo });
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
    setAppliedFilters({ clientName: '', createdBy: '', leadType: '', dateFrom: '', dateTo: '' });
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
      setCreatedBy(employee.id.toString());
      setEmployeeSearchQuery(employee.name);
    }
    setShowEmployeeDropdown(false);
  };

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    try {
      await apiClient.patch(`/operation/prereport/${reportId}/status`, {
        reportStatus: newStatus,
      });
      toast.success('Status updated successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
      throw error;
    }
  };

  const handleRequestChanges = async (reportId: string, changeComments: string) => {
    try {
      await apiClient.post(`/operation/prereport/${reportId}/request-changes`, {
        changeComments,
      });
      toast.success('Changes requested successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request changes');
      throw error;
    }
  };

  const handleCreateCase = async (
    prereportId: number,
    assignedEmployeeEmpIds: string[]
  ) => {
    try {
      setCreatingCaseForReportId(prereportId);
      const response = await apiClient.post(
        `/operation/cases/from-prereport/${prereportId}`,
        { assignedEmployees: assignedEmployeeEmpIds },
        {
          headers: {
            'X-Username': user?.empId || user?.fullName || 'admin',
          },
        }
      );
      const caseData = response.data?.data;
      toast.success(`Case ${caseData?.caseNumber} created successfully!`);
      setModalReport(null);
      refetch();
      navigate(`/admin/cases/${caseData?.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create case');
    } finally {
      setCreatingCaseForReportId(null);
    }
  };

  const getFilteredReports = () => {
    let reports = data?.reports || [];

    if (appliedFilters.clientName) {
      reports = reports.filter((r) =>
        r.clientName?.toLowerCase().includes(appliedFilters.clientName.toLowerCase())
      );
    }

    if (appliedFilters.createdBy) {
      reports = reports.filter((r) => r.createdBy === parseInt(appliedFilters.createdBy));
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
      {/* Header — matches dashboard template */}
      <div className="flex items-center justify-between">
        <div className="ml-4 mt-5">
          <h1 className="text-2xl font-bold text-white uppercase tracking-wide">
            Preliminary Reports
          </h1>
          <p className="text-sm text-white/70 mt-1 tracking-wider">
            View and manage all pre-investigation reports
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Total count badge — inline, not a separate box */}
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-200">
            {pagination?.totalReports ?? filteredReports.length} Reports
          </span>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${showFilters || hasActiveFilters
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {Object.values(appliedFilters).filter(Boolean).length}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate('/admin/pre-report/create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Create Report
          </button>
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
                  placeholder={isLoadingClients ? 'Loading clients...' : 'Search client name...'}
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
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${clientName === c.name
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
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${createdBy === e.id.toString()
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
                  {filteredReports.map((report, index) => (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-50 transition-colors"
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
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${report.leadType === 'CLIENT_LEAD'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                            }`}
                        >
                          {report.leadType === 'CLIENT_LEAD' ? 'Client Lead' : 'TrueBuddy Lead'}
                        </span>
                      </td>
                      <td
                        className={`px-6 whitespace-nowrap ${index >= filteredReports.length - 2 ? 'py-4 pb-32' : 'py-4'
                          }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {report.reportStatus === 'CASE_GENERATED' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                            <Briefcase className="w-3 h-3" />
                            Case Generated
                          </span>
                        ) : (
                          <StatusDropdown
                            currentStatus={report.reportStatus as ReportStatus}
                            reportId={report.reportId}
                            onStatusChange={(newStatus) =>
                              handleStatusChange(report.reportId, newStatus)
                            }
                            onRequestChanges={() =>
                              setSelectedReportForChanges(report.reportId)
                            }
                          />
                        )}
                      </td>

                      {/* ✅ FIXED: Resolved from local employees map — zero API calls */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {employeeNamesMap[report.createdBy] || `Employee ${report.createdBy}`}
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
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              navigate(`/operations/pre-report/${report.reportId}`)
                            }
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            View Details
                          </button>

                          {report.reportStatus === 'READY_FOR_CREATE_CASE' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setModalReport({
                                  id: report.id,
                                  reportId: report.reportId,
                                  clientName: report.clientName || 'Unknown Client',
                                });
                              }}
                              disabled={creatingCaseForReportId === report.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {creatingCaseForReportId === report.id ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Creating...
                                </>
                              ) : (
                                <>
                                  <Briefcase className="w-3 h-3" />
                                  Create Case
                                </>
                              )}
                            </button>
                          )}

                          {report.reportStatus === 'CASE_GENERATED' && report.caseNumber && (
                            <button
                              onClick={() => navigate(`/admin/cases/${report.caseId}`)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-lg hover:bg-indigo-100 hover:border-indigo-400 transition-colors"
                              title="Click to open case details"
                            >
                              <Briefcase className="w-3 h-3" />
                              {report.caseNumber}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
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

      {/* Request Changes Modal */}
      <RequestChangesModal
        isOpen={selectedReportForChanges !== null}
        reportId={selectedReportForChanges || ''}
        onClose={() => setSelectedReportForChanges(null)}
        onSubmit={(changeComments) =>
          handleRequestChanges(selectedReportForChanges!, changeComments)
        }
      />

      {/* Create Case Modal */}
      {modalReport && (
        <CreateCaseModal
          prereportId={modalReport.id}
          reportId={modalReport.reportId}
          clientName={modalReport.clientName}
          onConfirm={handleCreateCase}
          onClose={() => {
            setModalReport(null);
            setCreatingCaseForReportId(null);
          }}
          isCreating={creatingCaseForReportId === modalReport.id}
        />
      )}
    </div>
  );
};