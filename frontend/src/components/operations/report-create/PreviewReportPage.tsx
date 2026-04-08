import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2,
  AlertCircle,
  Send,
  FileDown,
  Edit,
  CheckCircle,
  RefreshCcw,
  AlertTriangle,
} from 'lucide-react';
import { useGetFinalReport } from '../../../hooks/finalreport/useGetFinalReport';
import { useSubmitForApproval } from '../../../hooks/finalreport/useSubmitForApproval';
import { useUpdateReportStatus } from '../../../hooks/finalreport/useUpdateReportStatus';
import { useAuthStore } from '../../../stores/authStore';
import { toast } from 'sonner';
import ReportPreview from './ReportPreview';
import type {
  ReportData,
  FinalReportStatusUpdateRequest,
} from './types/report.types';

const PreviewReportPage = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const parsedId =
    reportId && !isNaN(Number(reportId)) ? Number(reportId) : null;

  const {
    data: report,
    isLoading,
    isError,
    refetch,
  } = useGetFinalReport(parsedId);

  const submitMutation = useSubmitForApproval(parsedId ?? 0);
  const statusMutation = useUpdateReportStatus(parsedId ?? 0);

  const [changeComments, setChangeComments] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    'REQUEST_CHANGES' | 'APPROVED' | null
  >(null);

  const isAdmin =
    user?.roleName === 'SUPER_ADMIN' || user?.roleName === 'HR_MANAGER';

  if (!parsedId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <AlertCircle className="w-10 h-10 text-red-500 mr-3" />
        <p className="text-red-600 font-semibold">Invalid Report ID</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading report…</span>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">Error loading report</p>
        </div>
      </div>
    );
  }

  const reportData: ReportData = {
    reportId: report.id,
    reportNumber: report.reportNumber,
    reportStatus: report.reportStatus,
    caseId: report.caseId,
    clientLogoUrl: report.clientLogoUrl,
    header: {
      title: report.reportTitle,
      subtitle: report.reportSubtitle,
      preparedFor: report.preparedFor,
      preparedBy: report.preparedBy,
      date: report.reportDate,
      clientLogo: report.clientLogoUrl ?? undefined,
    },
    tableOfContents: report.tableOfContents,
    sections: report.sections,
  };

  const statusBadgeClass = () => {
    switch (report.reportStatus) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'WAITING_FOR_APPROVAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'REQUEST_CHANGES':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitForApproval = async () => {
    const username = user?.empId || user?.fullName || 'unknown';

    try {
      await submitMutation.mutateAsync(username);
      toast.success('Report submitted for approval');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to submit report');
    }
  };

  const handleAdminStatusUpdate = async () => {
    if (!pendingStatus) return;

    if (pendingStatus === 'REQUEST_CHANGES' && !changeComments.trim()) {
      toast.error('Please provide change comments');
      return;
    }

    const username = user?.empId || user?.fullName || 'unknown';

    const payload: FinalReportStatusUpdateRequest = {
      reportStatus: pendingStatus,
      changeComments:
        pendingStatus === 'REQUEST_CHANGES' ? changeComments : null,
    };

    try {
      await statusMutation.mutateAsync({ payload, username });

      toast.success(
        pendingStatus === 'APPROVED'
          ? 'Report approved'
          : 'Report sent back for changes'
      );

      setShowStatusModal(false);
      setChangeComments('');
      setPendingStatus(null);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to update status');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              {report.reportNumber}
            </span>

            <span
              className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadgeClass()}`}
            >
              {report.reportStatus.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(report.reportStatus === 'DRAFT' ||
              report.reportStatus === 'REQUEST_CHANGES') && (
              <button
                onClick={() =>
                  navigate(`/operations/finalreport/${parsedId}/edit`)
                }
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit Report
              </button>
            )}

            {!isAdmin &&
              (report.reportStatus === 'DRAFT' ||
                report.reportStatus === 'REQUEST_CHANGES') && (
                <button
                  onClick={handleSubmitForApproval}
                  disabled={submitMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
                >
                  {submitMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Submit for Approval
                </button>
              )}

            {isAdmin && report.reportStatus === 'WAITING_FOR_APPROVAL' && (
              <>
                <button
                  onClick={() => {
                    setPendingStatus('REQUEST_CHANGES');
                    setShowStatusModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-orange-300 text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100 text-sm font-medium"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Request Changes
                </button>

                <button
                  onClick={() => {
                    setPendingStatus('APPROVED');
                    setShowStatusModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
              </>
            )}

            {/* Optional admin shortcuts; actual PDF generation is handled inside ReportPreview */}
            {isAdmin && report.generatePdfEnabled && (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                onClick={() => {
                  const pdfBtn = document.querySelector(
                    'button[data-generate-pdf]'
                  ) as HTMLButtonElement | null;
                  pdfBtn?.click();
                }}
              >
                <FileDown className="w-4 h-4" />
                Generate PDF
              </button>
            )}

            {isAdmin && report.sendReportEnabled && (
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
                <Send className="w-4 h-4" />
                Send Report
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Employee Changes Requested Banner */}
      {!isAdmin &&
        report.reportStatus === 'REQUEST_CHANGES' &&
        report.changeComments && (
          <div className="max-w-5xl mx-auto px-4 pt-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900 mb-1">
                  Changes Requested
                </p>
                <p className="text-sm text-amber-800">
                  {report.changeComments}
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Report Preview */}
      <ReportPreview
        data={reportData}
        onEdit={() => navigate(`/operations/finalreport/${parsedId}/edit`)}
        onUpdate={() => {}}
      />

      {/* Admin Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {pendingStatus === 'APPROVED'
                ? 'Approve Report'
                : 'Request Changes'}
            </h3>

            {pendingStatus === 'REQUEST_CHANGES' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Change Comments *
                </label>
                <textarea
                  value={changeComments}
                  onChange={(e) => setChangeComments(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what needs to be changed…"
                />
              </div>
            )}

            {pendingStatus === 'APPROVED' && (
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to approve this report? This will allow
                PDF generation and sending.
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setChangeComments('');
                  setPendingStatus(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleAdminStatusUpdate}
                disabled={statusMutation.isPending}
                className={`px-4 py-2 text-white rounded-lg text-sm font-medium disabled:opacity-50 ${
                  pendingStatus === 'APPROVED'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {statusMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                )}
                {pendingStatus === 'APPROVED'
                  ? 'Confirm Approve'
                  : 'Send for Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewReportPage;