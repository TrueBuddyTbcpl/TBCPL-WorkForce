import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
// Add MessageSquare to existing imports
import { Loader2, AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react';

import { useGetFinalReport } from '../../../hooks/finalreport/useGetFinalReport';
import ReportForm from '../report-create/ReportForm';
import type { ReportData } from '../report-create/types/report.types';
import { useUpdateFinalReport } from '../../../hooks/finalreport/useUpdateFinalReport';
import { useAuthStore } from '../../../stores/authStore';
import { toast } from 'sonner';
import { apiClient } from '../../../lib/api-client';
import { queryClient } from '../../../lib/queryClient';

const EditReportPage = () => {
    const { reportId } = useParams<{ reportId: string }>();
    const navigate = useNavigate();
    const location = useLocation();                                          // ✅ added
    const { user } = useAuthStore();

    const parsedId = reportId && !isNaN(Number(reportId)) ? Number(reportId) : null;

    // ✅ detect admin edit from query param
    const isAdminEdit = new URLSearchParams(location.search).get('adminEdit') === '1';

    const { data: report, isLoading, isError } = useGetFinalReport(parsedId);
    const updateMutation = useUpdateFinalReport(parsedId ?? 0);

    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);              // ✅ added

const handleSubmitForApproval = async () => {
  if (!parsedId) return;
  const username = user?.empId || user?.fullName || 'unknown';
  setIsSubmitting(true);
  try {
    await apiClient.post(
      `/operation/finalreport/${parsedId}/submit`,
      {},
      { headers: { 'X-Username': username } }
    );
    // ✅ Refetch latest report data so status updates live
    await queryClient.invalidateQueries({ queryKey: ['final-report', parsedId] });
    setSubmitSuccess(true);
  } catch (err: any) {
    toast.error(err.response?.data?.message ?? 'Failed to submit');
  } finally {
    setIsSubmitting(false);
  }
};


    // ✅ called when user clicks OK in success modal
    const handleSuccessOk = () => {
        setSubmitSuccess(false);
        // redirect based on role
        const role = (user as any)?.role ?? (user as any)?.roleName ?? (user as any)?.authorities ?? '';
        if (role === 'SUPER_ADMIN' || role === 'DEPARTMENT_ADMIN') {
            navigate('/admin');
        } else {
            navigate('/operations/dashboard');
        }
    };

    if (!parsedId) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-semibold">Invalid Report ID</p>
                </div>
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
                    <button
                        onClick={() => navigate('/operations/cases')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Back to Cases
                    </button>
                </div>
            </div>
        );
    }

    // Map FinalReportResponse → ReportData for the form
    const initialData: ReportData = reportData ?? {
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

const handleFormComplete = async (data: ReportData) => {
  setReportData(data);
  const username = user?.empId || user?.fullName || 'unknown';
  try {
    await updateMutation.mutateAsync({
      payload: {
        reportTitle: data.header.title,
        reportSubtitle: data.header.subtitle,
        preparedFor: data.header.preparedFor,
        preparedBy: data.header.preparedBy,
        reportDate: data.header.date,
        sections: data.sections,
        tableOfContents: data.tableOfContents,
      },
      username,
      isAdminEdit,
    });
    // ✅ Refetch latest report data after save
    await queryClient.invalidateQueries({ queryKey: ['final-report', parsedId] });
    toast.success('Report updated successfully');
    navigate(`/operations/finalreport/${parsedId}/preview`);
  } catch (err: any) {
    toast.error(err.response?.data?.message ?? 'Failed to update report');
  }
};


    return (
        <div className="min-h-screen bg-gray-50">

            {/* ✅ Submit for Approval Banner */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-900">
                        {report.reportNumber} — Editing
                    </p>
                    <p className="text-xs text-gray-500">
                        Save your changes, then submit for admin approval
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() =>
                            isAdminEdit
                                ? navigate('/admin/finalreports')
                                : navigate('/operations/cases')
                        }
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                    >
                        {isAdminEdit ? '← Back to Reports' : '← Back to Cases'}
                    </button>

                    {/* ✅ hide submit button for admin edit */}
                    {!isAdminEdit && (
                        <button
                            onClick={handleSubmitForApproval}
                            disabled={
                                isSubmitting ||
                                report.reportStatus === 'APPROVED'          // ✅ removed WAITING_FOR_APPROVAL
                            }
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {report.reportStatus === 'WAITING_FOR_APPROVAL'
                                ? '↺ Re-Submit for Approval'                // ✅ allow resubmit
                                : report.reportStatus === 'APPROVED'
                                    ? '✓ Approved'
                                    : isSubmitting
                                        ? 'Submitting…'
                                        : 'Submit for Approval'}
                        </button>
                    )}
                </div>
            </div>

            {/* ✅ Change Comments Banner — visible only when REQUEST_CHANGES */}
            {report.reportStatus === 'REQUEST_CHANGES' && report.changeComments && (
                <div className="bg-red-50 border-b border-red-200 px-6 py-3">
                    <div className="flex items-start gap-3 max-w-4xl mx-auto">
                        <div className="p-1.5 bg-red-100 rounded-lg flex-shrink-0 mt-0.5">
                            <MessageSquare className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-red-800">
                                Changes Requested by Admin
                            </p>
                            <p className="text-sm text-red-700 mt-0.5 leading-relaxed whitespace-pre-wrap">
                                {report.changeComments}
                            </p>
                        </div>
                    </div>
                </div>
            )}



            <ReportForm
                onComplete={handleFormComplete}
                initialData={initialData}
                reportId={parsedId}
                caseId={report.caseId}
            />

            {/* ✅ Success Modal — shows after submit, user clicks OK to redirect */}
            {submitSuccess && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-green-100 rounded-full p-4">
                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Report Submitted!
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Your report <span className="font-semibold text-gray-700">{report.reportNumber}</span> has been submitted for admin approval successfully.
                        </p>
                        <button
                            onClick={handleSuccessOk}
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-sm transition-colors"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EditReportPage;
