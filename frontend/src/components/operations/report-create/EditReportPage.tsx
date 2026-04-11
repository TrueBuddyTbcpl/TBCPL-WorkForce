import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Loader2, AlertCircle, MessageSquare } from 'lucide-react';

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
    const location = useLocation();
    const { user } = useAuthStore();

    const parsedId = reportId && !isNaN(Number(reportId)) ? Number(reportId) : null;
    const isAdminEdit = new URLSearchParams(location.search).get('adminEdit') === '1';

    const { data: report, isLoading, isError } = useGetFinalReport(parsedId);
    const updateMutation = useUpdateFinalReport(parsedId ?? 0);

    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // ✅ CHANGE 1: Add photographicEvidence to initialData
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
        // ✅ ADD THIS — load from API response so old images are never lost
        photographicEvidence: report.photographicEvidence ?? {
            showHeading: false,
            heading: '',
            images: [],
        },
    };



    // ✅ Single handler: Save → Submit for Approval → Navigate to Preview
    const handleFormComplete = async (data: ReportData) => {
        setReportData(data);
        const username = user?.empId || user?.fullName || 'unknown';
        setIsSubmitting(true);
        try {
            // Step 1: Save the report
            await updateMutation.mutateAsync({
                payload: {
                    reportTitle: data.header.title,
                    reportSubtitle: data.header.subtitle,
                    preparedFor: data.header.preparedFor,
                    preparedBy: data.header.preparedBy,
                    reportDate: data.header.date,
                    sections: data.sections,
                    tableOfContents: data.tableOfContents,
                    photographicEvidence: data.photographicEvidence, // ✅ ADD THIS
                },
                username,
                isAdminEdit,
            });

            // Step 2: Submit for approval (skip if admin edit or already approved)
            if (!isAdminEdit && report.reportStatus !== 'APPROVED') {
                await apiClient.post(
                    `/operation/finalreport/${parsedId}/submit`,
                    {},
                    { headers: { 'X-Username': username } }
                );
            }

            // Step 3: Refetch & redirect to preview
            await queryClient.invalidateQueries({ queryKey: ['final-report', parsedId] });
            toast.success('Report saved and submitted successfully');
            navigate(`/operations/finalreport/${parsedId}/preview`);

        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Failed to save report');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Top Banner — info + back button only (no submit button) */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-900">
                        {report.reportNumber} — Editing
                    </p>
                    <p className="text-xs text-gray-500">
                        {isAdminEdit
                            ? 'Admin edit mode — changes save directly'
                            : 'Fill in the details, then click Preview to save & submit'}
                    </p>
                </div>
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
            </div>

            {/* Change Comments Banner — visible only when REQUESTCHANGES */}
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

            {/* ReportForm — its bottom Next/Preview button triggers handleFormComplete */}
            // ✅ CHANGE 2: Fix setPhotographicEvidence to never spread null
            <ReportForm
                onComplete={handleFormComplete}
                initialData={initialData}
                reportId={parsedId}
                caseId={report.caseId}
                photographicEvidence={initialData.photographicEvidence}
                setPhotographicEvidence={(data) =>
                    setReportData((prev) => ({
                        // ✅ Use initialData as base when prev is null — preserves all fields
                        ...(prev ?? initialData),
                        photographicEvidence: data,
                    }))
                }
            />

            {/* Global loading overlay while saving + submitting */}
            {isSubmitting && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[99999]">
                    <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex items-center gap-4">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        <p className="text-sm font-semibold text-gray-700">
                            Saving & submitting report…
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EditReportPage;