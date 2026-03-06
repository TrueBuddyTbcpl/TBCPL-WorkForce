import { useState, useEffect } from 'react';
import ReportForm from './ReportForm';
import ReportPreview from './ReportPreview';
import type { ReportData } from './types/report.types';
import { RotateCcw, Loader2 } from 'lucide-react';
import { useCreateFinalReport } from '../../../hooks/finalreport/useCreateFinalReport';
import { useAuthStore } from '../../../stores/authStore';
import { toast } from 'sonner';
import apiClient from '../../../services/api/apiClient';

const STORAGE_KEYS = {
    STEP: 'report_current_step',
    DATA: 'report_data',
    TIMESTAMP: 'report_timestamp',
};

const submitForApproval = async (reportId: number, username: string) => {
    const res = await apiClient.post(
        `/operation/finalreport/${reportId}/submit`,
        {},
        { headers: { 'X-Username': username } }
    );
    return res.data;
};

const ReportCreate = () => {
    const { user } = useAuthStore();
    const createMutation = useCreateFinalReport();

    const [step, setStep] = useState<'form' | 'preview'>('form');
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load saved data on mount
    useEffect(() => {
        try {
            const savedStep = localStorage.getItem(STORAGE_KEYS.STEP);
            const savedData = localStorage.getItem(STORAGE_KEYS.DATA);
            const savedTimestamp = localStorage.getItem(STORAGE_KEYS.TIMESTAMP);

            if (savedTimestamp) {
                const hoursDiff =
                    (Date.now() - parseInt(savedTimestamp)) / (1000 * 60 * 60);
                if (hoursDiff > 24) {
                    clearStorage();
                    setIsLoading(false);
                    return;
                }
            }

            if (savedStep) setStep(savedStep as 'form' | 'preview');
            if (savedData) setReportData(JSON.parse(savedData));
        } catch (e) {
            console.error('Error loading saved data:', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearStorage = () => {
        Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
        localStorage.removeItem('report_form_step');
    };

    const handleFormComplete = async (data: ReportData) => {
        setReportData(data);
        setIsSaving(true);

        const username = user?.empId || user?.fullName || 'unknown';

        // If report already has an ID (edit mode) skip create
        if (data.reportId) {
            setStep('preview');
            window.history.pushState({ step: 'preview' }, '', window.location.pathname);
            setIsSaving(false);
            return;
        }

        if (!data.caseId) {
            toast.error('Case ID is missing — cannot save report');
            setIsSaving(false);
            return;
        }

        try {
            const payload = {
                caseId: data.caseId,
                reportTitle: data.header.title,
                reportSubtitle: data.header.subtitle,
                preparedFor: data.header.preparedFor,
                preparedBy: data.header.preparedBy,
                reportDate: data.header.date, // already "YYYY-MM-DD"
                sections: data.sections,
                tableOfContents: data.tableOfContents,
            };

            const saved = await createMutation.mutateAsync({ payload, username });

            // Store reportId for further edits
            const updatedData: ReportData = {
                ...data,
                reportId: saved.id,
                reportNumber: saved.reportNumber,
                reportStatus: saved.reportStatus,
            };
            setReportData(updatedData);
            localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(updatedData));

            toast.success(`Report ${saved.reportNumber} created successfully`);
            setStep('preview');
            window.history.pushState({ step: 'preview' }, '', window.location.pathname);
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Failed to save report');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitForApproval = async () => {
        if (!reportData?.reportId) {
            toast.error('Report not saved yet');
            return;
        }
        const username = user?.empId || user?.fullName || 'unknown';
        setIsSubmitting(true);
        try {
            await submitForApproval(reportData.reportId, username);
            toast.success('Report submitted for approval!');
            clearStorage();
            // Navigate back to cases or show success
            window.location.href = '/operations/cases';
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Failed to submit report');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = () => {
        setStep('form');
        window.history.pushState({ step: 'form' }, '', window.location.pathname);
    };

    const handleUpdateReport = (updatedData: ReportData) => {
        setReportData(updatedData);
    };

    const handleResetAll = () => {
        if (
            confirm('Are you sure you want to reset everything? All progress will be lost.')
        ) {
            clearStorage();
            setStep('form');
            setReportData(null);
            window.location.reload();
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {/* Reset Button */}
            <div className="fixed top-4 right-4 z-50">
                <button
                    onClick={handleResetAll}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg font-medium"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset All
                </button>
            </div>

            {/* Auto-save indicator */}
            <div className="fixed top-4 left-4 z-50">
                <div className="bg-green-100 border border-green-300 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Auto-saved
                </div>
            </div>

            {/* Saving overlay */}
            {isSaving && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-gray-700 font-medium">Saving report to server…</p>
                    </div>
                </div>
            )}

            {step === 'form' ? (
                <ReportForm
                    onComplete={handleFormComplete}
                    initialData={reportData || undefined}
                />
            ) : (
                <div className="min-h-screen bg-gray-50">
                    {/* ✅ Submit for Approval Banner */}
                    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Report ready for submission
                            </p>
                            <p className="text-xs text-gray-500">
                                Review the preview below, then submit for admin approval
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                            >
                                ← Edit Report
                            </button>
                            <button
                                onClick={handleSubmitForApproval}
                                disabled={isSubmitting || reportData?.reportStatus === 'WAITING_FOR_APPROVAL'}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : null}
                                {reportData?.reportStatus === 'WAITING_FOR_APPROVAL'
                                    ? '✓ Already Submitted'
                                    : isSubmitting
                                        ? 'Submitting…'
                                        : 'Submit for Approval'}
                            </button>
                        </div>
                    </div>

                    <ReportPreview
                        data={reportData!}
                        onEdit={handleEdit}
                        onUpdate={handleUpdateReport}
                    />
                </div>
            )}

        </div>
    );
};

export default ReportCreate;
