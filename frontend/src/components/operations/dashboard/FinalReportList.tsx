// src/components/operations/final-reports/FinalReportList.tsx
import { useState } from 'react';
import {
  Search,
  Eye,
  Loader2,
  AlertCircle,
  RefreshCcw,
  ClipboardList,
  Briefcase,
  Pencil,
  MessageSquare,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // ✅ added useQueryClient
import apiClient from '../../../services/api/apiClient';
import { format } from 'date-fns';
import DashboardLayout from '../dashboard/DashboardLayout';

// ── Types ─────────────────────────────────────────────────────────────────────
type ReportStatus =
  | 'DRAFT'
  | 'WAITING_FOR_APPROVAL'
  | 'REQUEST_CHANGES'
  | 'APPROVED';

interface FinalReportListItem {
  id: number;
  reportNumber: string;
  reportTitle: string;
  preparedFor: string;
  reportStatus: ReportStatus;
  reportDate: string;
  caseId: number;
  caseNumber: string;
  createdAt: string;
  updatedAt: string;
  changeComments?: string | null;
}

// ── API ───────────────────────────────────────────────────────────────────────
const fetchFinalReports = async (): Promise<FinalReportListItem[]> => {
  const res = await apiClient.get('/operation/finalreport', {
    params: { page: 0, size: 100 },
  });
  return res.data.data.content;
};

// ── Status Helpers ────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<ReportStatus, string> = {
  DRAFT: 'Draft',
  WAITING_FOR_APPROVAL: 'Waiting for Approval',
  REQUEST_CHANGES: 'Changes Requested',
  APPROVED: 'Approved',
};

const statusBadgeClass = (status: ReportStatus): string => {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-100 text-green-800 border border-green-300';
    case 'WAITING_FOR_APPROVAL':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case 'REQUEST_CHANGES':
      return 'bg-red-100 text-red-800 border border-red-300';
    case 'DRAFT':
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-300';
  }
};

// ── Component ─────────────────────────────────────────────────────────────────
const FinalReportList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // ✅ added

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('ALL');
  const [changeNoteReport, setChangeNoteReport] = useState<FinalReportListItem | null>(null);

  const {
    data: reports = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['operations-final-reports'],
    queryFn: fetchFinalReports,
    // ✅ Auto-refetch every 30 seconds so status stays live without manual refresh
    refetchInterval: 30_000,
    // ✅ Refetch when user returns to this tab/window
    refetchOnWindowFocus: true,
  });

  // ✅ Called from outside (e.g. navigating back) — force fresh data
  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['operations-final-reports'] });
  };

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = reports.filter((r) => {
    const matchSearch =
      search === '' ||
      r.reportNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.reportTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.preparedFor.toLowerCase().includes(search.toLowerCase()) ||
      r.caseNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.reportStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const canPreview = (status: ReportStatus) =>
    ['WAITING_FOR_APPROVAL', 'REQUEST_CHANGES', 'APPROVED'].includes(status);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading final reports…</span>
        </div>
      </DashboardLayout>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-semibold mb-4">Failed to load reports</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <RefreshCcw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Final Reports</h1>
          <p className="text-sm text-gray-500 mt-1">
            View all finalized investigation reports
          </p>
        </div>

        {/* ── Stats Bar ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{reports.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {reports.filter((r) => r.reportStatus === 'WAITING_FOR_APPROVAL').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Waiting Approval</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {reports.filter((r) => r.reportStatus === 'APPROVED').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Approved</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {reports.filter((r) => r.reportStatus === 'REQUEST_CHANGES').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Changes Requested</p>
          </div>
        </div>

        {/* ── Search & Filter ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by report number, title, client or case…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReportStatus | 'ALL')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ALL">All Statuses</option>
            {(Object.keys(STATUS_LABELS) as ReportStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          {/* ✅ Refresh button now invalidates cache for instant update */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* ── Table ───────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Report #</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Client</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Case #</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">
                      <ClipboardList className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No final reports found</p>
                      <p className="text-xs mt-1">
                        {search || statusFilter !== 'ALL'
                          ? 'Try adjusting your search or filter'
                          : 'Finalized reports will appear here once generated'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">

                      {/* Report Number */}
                      <td className="px-4 py-4 font-mono font-medium text-blue-700">
                        {report.reportNumber}
                      </td>

                      {/* Title */}
                      <td className="px-4 py-4 max-w-[200px]">
                        <p
                          className="truncate text-gray-900 font-medium"
                          title={report.reportTitle}
                        >
                          {report.reportTitle}
                        </p>
                      </td>

                      {/* Client */}
                      <td className="px-4 py-4 text-gray-700">{report.preparedFor}</td>

                      {/* Case Number — clickable */}
                      <td className="px-4 py-4">
                        <button
                          onClick={() => navigate(`/operations/cases/${report.caseId}`)}
                          className="flex items-center gap-1.5 text-xs font-mono text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                          title="Open case details"
                        >
                          <Briefcase className="w-3 h-3 flex-shrink-0" />
                          {report.caseNumber}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 text-gray-500 text-xs whitespace-nowrap">
                        {format(new Date(report.reportDate), 'dd MMM yyyy')}
                      </td>

                      {/* Status — read-only badge */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(
                            report.reportStatus
                          )}`}
                        >
                          {STATUS_LABELS[report.reportStatus] ?? report.reportStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-1">

                          {/* Edit — disabled when APPROVED */}
                          <button
                            title={
                              report.reportStatus === 'APPROVED'
                                ? 'Cannot edit an approved report'
                                : 'Edit Report'
                            }
                            disabled={report.reportStatus === 'APPROVED'}
                            onClick={() =>
                              navigate(`/operations/finalreport/${report.id}/edit`)
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              report.reportStatus === 'APPROVED'
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-orange-500 hover:bg-orange-50 cursor-pointer'
                            }`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Preview */}
                          <button
                            title={
                              canPreview(report.reportStatus)
                                ? 'Preview Report'
                                : 'Preview available from Waiting for Approval onwards'
                            }
                            disabled={!canPreview(report.reportStatus)}
                            onClick={() =>
                              navigate(`/operations/finalreport/${report.id}/preview`)
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              canPreview(report.reportStatus)
                                ? 'text-blue-600 hover:bg-blue-50 cursor-pointer'
                                : 'text-gray-300 cursor-not-allowed'
                            }`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Change Note — only when REQUEST_CHANGES + has comment */}
                          {report.reportStatus === 'REQUEST_CHANGES' &&
                            report.changeComments && (
                              <button
                                title="View requested changes"
                                onClick={() => setChangeNoteReport(report)}
                                className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-50 cursor-pointer"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            )}

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
            <span>
              Showing {filtered.length} of {reports.length} reports
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-blue-500" />
              Preview available from Waiting for Approval onwards
            </span>
          </div>
        </div>

      </div>

      {/* ── Change Comments Modal ─────────────────────────────────────────── */}
      {changeNoteReport && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setChangeNoteReport(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Changes Requested
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {changeNoteReport.reportNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChangeNoteReport(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comment */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 leading-relaxed whitespace-pre-wrap">
                {changeNoteReport.changeComments}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-5 flex justify-between items-center">
              <button
                onClick={() => {
                  setChangeNoteReport(null);
                  navigate(`/operations/finalreport/${changeNoteReport.id}/edit`);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Edit Report
              </button>
              <button
                onClick={() => setChangeNoteReport(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default FinalReportList;
