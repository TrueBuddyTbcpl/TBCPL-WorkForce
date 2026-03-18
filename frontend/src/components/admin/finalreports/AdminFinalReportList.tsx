import { useState } from 'react';
import {
    Search,
    Eye,
    FileDown,
    Send,
    Loader2,
    AlertCircle,
    RefreshCcw,
    ChevronDown,
    Pencil,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../services/api/apiClient';
import { toast } from 'sonner';
import { format } from 'date-fns';

// ── Types ────────────────────────────────────────────────────────────────────
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
    updatedAt: string;     // ✅ already exists
    updatedBy: string | null;
}

// ── API Calls ────────────────────────────────────────────────────────────────
const fetchAllFinalReports = async (): Promise<FinalReportListItem[]> => {
    const res = await apiClient.get('/admin/finalreports', {
        params: { page: 0, size: 100 },
    });
    return res.data.data.content;
};

const updateReportStatus = async ({
    reportId,
    reportStatus,
    changeComments,
    username,
}: {
    reportId: number;
    reportStatus: ReportStatus;
    changeComments?: string | null;
    username: string;
}) => {
    const res = await apiClient.patch(
        `/operation/finalreport/${reportId}/status`,
        { reportStatus, changeComments },
        { headers: { 'X-Username': username } }
    );
    return res.data;
};

const sendReportMail = async ({
    reportId,
    username,
}: {
    reportId: number;
    username: string;
}) => {
    const res = await apiClient.post(
        `/operation/finalreport/${reportId}/send`,
        {},
        { headers: { 'X-Username': username } }
    );
    return res.data;
};

const generateReportPdf = async (reportId: number) => {
    const res = await apiClient.get(`/operation/finalreport/${reportId}/pdf`, {
        responseType: 'blob',
    });
    return res.data;
};

// ── Status Config ─────────────────────────────────────────────────────────────
const STATUS_OPTIONS: { value: ReportStatus; label: string }[] = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'WAITING_FOR_APPROVAL', label: 'Waiting for Approval' },
    { value: 'REQUEST_CHANGES', label: 'Request Changes' },
    { value: 'APPROVED', label: 'Approved' },
];

const statusBadgeClass = (status: ReportStatus) => {
    switch (status) {
        case 'APPROVED': return 'bg-green-100 text-green-800 border-green-300';
        case 'WAITING_FOR_APPROVAL': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'REQUEST_CHANGES': return 'bg-red-100 text-red-800 border-red-300';
        case 'DRAFT':
        default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};

const statusLabel = (status: ReportStatus) =>
    STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;

// ── Component ────────────────────────────────────────────────────────────────
const AdminFinalReportList = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('ALL');
    const [editingStatusId, setEditingStatusId] = useState<number | null>(null);
    const [changeCommentModal, setChangeCommentModal] = useState<{
        reportId: number;
        newStatus: ReportStatus;
    } | null>(null);
    const [changeCommentText, setChangeCommentText] = useState('');
    const [pdfLoadingId, setPdfLoadingId] = useState<number | null>(null);
    const [mailLoadingId, setMailLoadingId] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);


    // ── Queries & Mutations ───────────────────────────────────────────────────
    const {
        data: reports = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['admin-final-reports'],
        queryFn: fetchAllFinalReports,
    });

    const statusMutation = useMutation({
        mutationFn: updateReportStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-final-reports'] });
            toast.success('Report status updated');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message ?? 'Failed to update status');
        },
    });

    const mailMutation = useMutation({
        mutationFn: sendReportMail,
        onSuccess: () => toast.success('Report sent to client successfully'),
        onError: (err: any) => {
            toast.error(err.response?.data?.message ?? 'Failed to send report');
        },
    });

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleStatusChange = (report: FinalReportListItem, newStatus: ReportStatus) => {
        setEditingStatusId(null);
        if (newStatus === 'REQUEST_CHANGES') {
            setChangeCommentModal({ reportId: report.id, newStatus });
            return;
        }
        statusMutation.mutate({
            reportId: report.id,
            reportStatus: newStatus,
            changeComments: null,
            username: 'admin',
        });
    };

    const handleConfirmChangeComment = () => {
        if (!changeCommentModal) return;
        if (!changeCommentText.trim()) {
            toast.error('Please provide change comments');
            return;
        }
        statusMutation.mutate({
            reportId: changeCommentModal.reportId,
            reportStatus: changeCommentModal.newStatus,
            changeComments: changeCommentText,
            username: 'admin',
        });
        setChangeCommentModal(null);
        setChangeCommentText('');
    };

    const handleSendMail = async (report: FinalReportListItem) => {
        setMailLoadingId(report.id);
        try {
            await mailMutation.mutateAsync({ reportId: report.id, username: 'admin' });
        } finally {
            setMailLoadingId(null);
        }
    };

    const handleGeneratePdf = async (report: FinalReportListItem) => {
        setPdfLoadingId(report.id);
        try {
            const blob = await generateReportPdf(report.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${report.reportNumber}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('PDF downloaded');
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Failed to generate PDF');
        } finally {
            setPdfLoadingId(null);
        }
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

    const previewEnabled = (status: ReportStatus) =>
        ['WAITING_FOR_APPROVAL', 'REQUEST_CHANGES', 'APPROVED'].includes(status);

    const approvedActionsEnabled = (status: ReportStatus) => status === 'APPROVED';

    // ── Loading / Error States ────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Loading final reports…</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-semibold">Failed to load reports</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-screen-xl mx-auto">

            {/* ── Header ───────────────────────────────────────────────────── */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Final Reports</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Manage, review and approve all final investigation reports
                </p>
            </div>

            {/* ── Stats Bar ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
                    <div className="text-sm text-gray-600 mt-1">Total</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                        {reports.filter((r) => r.reportStatus === 'WAITING_FOR_APPROVAL').length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Waiting Approval</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {reports.filter((r) => r.reportStatus === 'APPROVED').length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Approved</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                        {reports.filter((r) => r.reportStatus === 'REQUEST_CHANGES').length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Changes Requested</div>
                </div>
            </div>

            {/* ── Search & Filter ───────────────────────────────────────────── */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row gap-3">
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
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* ── Table ─────────────────────────────────────────────────────── */}
            {/* overflow-visible on the wrapper so dropdowns are not clipped */}
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
                                <th className="text-left px-4 py-3 font-semibold text-gray-700">Last Updated</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-16 text-gray-400">
                                        <AlertCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                                        <p>No reports found</p>
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

                                        {/* Case Number */}
                                        <td className="px-4 py-4 font-mono text-xs text-gray-500">
                                            {report.caseNumber}
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 py-4 text-gray-500 text-xs whitespace-nowrap">
                                            {format(new Date(report.reportDate), 'dd MMM yyyy')}
                                        </td>
                                        {/* Last Updated */}
                                        <td className="px-4 py-4 text-xs text-gray-500">
                                            <div className="whitespace-nowrap">
                                                {format(new Date(report.updatedAt), 'dd MMM yyyy')}
                                            </div>
                                            <div
                                                className="text-gray-400 truncate max-w-[120px] mt-0.5"
                                                title={report.updatedBy ?? '—'}
                                            >
                                                {report.updatedBy ?? '—'}
                                            </div>
                                        </td>


                                        {/* ── Status Inline Dropdown ───────────────────── */}
                                        <td className="px-4 py-4">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={(e) => {
                                                        if (editingStatusId === report.id) {
                                                            setEditingStatusId(null);
                                                            setDropdownPosition(null);
                                                        } else {
                                                            const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                                                            setDropdownPosition({
                                                                top: rect.bottom + window.scrollY + 4,
                                                                left: rect.left + window.scrollX,
                                                            });
                                                            setEditingStatusId(report.id);
                                                        }
                                                    }}
                                                    disabled={statusMutation.isPending}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors hover:opacity-80 ${statusBadgeClass(report.reportStatus)}`}
                                                >
                                                    {statusLabel(report.reportStatus)}
                                                    <ChevronDown
                                                        className={`w-3 h-3 transition-transform ${editingStatusId === report.id ? 'rotate-180' : ''
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </td>


                                        {/* ── Actions ─────────────────────────────────── */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-1">

                                                <button
                                                    title="Edit Report"
                                                    onClick={() => navigate(`/admin/finalreport/${report.id}/edit?adminEdit=1`)}
                                                    className="p-2 rounded-lg transition-colors text-orange-500 hover:bg-orange-50 cursor-pointer"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>

                                                {/* Preview */}
                                                <button
                                                    title="Preview Report"
                                                    disabled={!previewEnabled(report.reportStatus)}
                                                    onClick={() =>
                                                        navigate(`/admin/finalreport/${report.id}/preview`)
                                                    }
                                                    className={`p-2 rounded-lg transition-colors ${previewEnabled(report.reportStatus)
                                                        ? 'text-blue-600 hover:bg-blue-50 cursor-pointer'
                                                        : 'text-gray-300 cursor-not-allowed'
                                                        }`}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                {/* Generate PDF */}
                                                <button
                                                    title="Generate PDF"
                                                    disabled={
                                                        !approvedActionsEnabled(report.reportStatus) ||
                                                        pdfLoadingId === report.id
                                                    }
                                                    onClick={() => handleGeneratePdf(report)}
                                                    className={`p-2 rounded-lg transition-colors ${approvedActionsEnabled(report.reportStatus)
                                                        ? 'text-green-600 hover:bg-green-50 cursor-pointer'
                                                        : 'text-gray-300 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {pdfLoadingId === report.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <FileDown className="w-4 h-4" />
                                                    )}
                                                </button>

                                                {/* Send Mail */}
                                                <button
                                                    title="Send Report to Client"
                                                    disabled={
                                                        !approvedActionsEnabled(report.reportStatus) ||
                                                        mailLoadingId === report.id
                                                    }
                                                    onClick={() => handleSendMail(report)}
                                                    className={`p-2 rounded-lg transition-colors ${approvedActionsEnabled(report.reportStatus)
                                                        ? 'text-purple-600 hover:bg-purple-50 cursor-pointer'
                                                        : 'text-gray-300 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {mailLoadingId === report.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Send className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 text-xs text-gray-500 flex items-center justify-between flex-wrap gap-2">
                    <span>
                        Showing {filtered.length} of {reports.length} reports
                    </span>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-blue-500" />
                            Preview — from Waiting for Approval onwards
                        </span>
                        <span className="flex items-center gap-1">
                            <FileDown className="w-3 h-3 text-green-500" />
                            <Send className="w-3 h-3 text-purple-500" />
                            PDF & Send — Approved only
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Status Dropdown Portal — renders outside overflow container ── */}
            {editingStatusId !== null && dropdownPosition && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0"
                        style={{ zIndex: 9998 }}
                        onClick={() => {
                            setEditingStatusId(null);
                            setDropdownPosition(null);
                        }}
                    />
                    {/* Dropdown */}
                    <div
                        className="fixed bg-white border border-gray-200 rounded-xl shadow-2xl w-56 py-2"
                        style={{
                            zIndex: 9999,
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                        }}
                    >
                        <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Change Status
                        </p>
                        {(() => {
                            const report = filtered.find((r) => r.id === editingStatusId);
                            if (!report) return null;
                            return STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        handleStatusChange(report, opt.value);
                                        setDropdownPosition(null);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${report.reportStatus === opt.value
                                        ? 'font-semibold text-blue-600 bg-blue-50'
                                        : 'text-gray-700'
                                        }`}
                                >
                                    <span>{opt.label}</span>
                                    {report.reportStatus === opt.value && (
                                        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block flex-shrink-0" />
                                    )}
                                </button>
                            ));
                        })()}
                    </div>
                </>
            )}


            {/* ── Change Comment Modal ──────────────────────────────────────── */}
            {changeCommentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Request Changes</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Provide clear comments so the employee knows what to fix.
                        </p>
                        <textarea
                            value={changeCommentText}
                            onChange={(e) => setChangeCommentText(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 mb-4"
                            placeholder="Describe what needs to be changed…"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setChangeCommentModal(null);
                                    setChangeCommentText('');
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmChangeComment}
                                disabled={statusMutation.isPending}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                            >
                                {statusMutation.isPending && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                Send for Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminFinalReportList;
