// components/operation/report-create/index.tsx
import { useState, useEffect } from 'react';
import ReportForm from './ReportForm';
import ReportPreview from './ReportPreview';
import type { ReportData } from './types/report.types';
import { RotateCcw } from 'lucide-react';

const STORAGE_KEYS = {
    STEP: 'report_current_step',
    DATA: 'report_data',
    TIMESTAMP: 'report_timestamp'
};

const ReportCreate = () => {
    const [step, setStep] = useState<'form' | 'preview'>('form');
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load saved data on mount
    useEffect(() => {
        try {
            const savedStep = localStorage.getItem(STORAGE_KEYS.STEP);
            const savedData = localStorage.getItem(STORAGE_KEYS.DATA);
            const savedTimestamp = localStorage.getItem(STORAGE_KEYS.TIMESTAMP);

            // Check if data is not too old (24 hours expiry)
            if (savedTimestamp) {
                const timestamp = parseInt(savedTimestamp);
                const now = Date.now();
                const hoursDiff = (now - timestamp) / (1000 * 60 * 60);

                if (hoursDiff > 24) {
                    handleResetAll();
                    setIsLoading(false);
                    return;
                }
            }

            if (savedStep) {
                setStep(savedStep as 'form' | 'preview');
            }

            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setReportData(parsedData);
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (event.state?.step) {
                setStep(event.state.step);
            }
        };

        window.addEventListener('popstate', handlePopState);

        // Set initial state
        if (!window.history.state?.step) {
            window.history.replaceState({ step: 'form' }, '', window.location.pathname);
        }

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // Save step to localStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(STORAGE_KEYS.STEP, step);
            localStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
        }
    }, [step, isLoading]);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        if (reportData && !isLoading) {
            localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(reportData));
            localStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
        }
    }, [reportData, isLoading]);

    const handleFormComplete = (data: ReportData) => {
        setReportData(data);
        setStep('preview');
        // Push to browser history
        window.history.pushState({ step: 'preview' }, '', window.location.pathname);
    };

    const handleEdit = () => {
        setStep('form');
        // Push to browser history
        window.history.pushState({ step: 'form' }, '', window.location.pathname);
    };

    const handleUpdateReport = (updatedData: ReportData) => {
        setReportData(updatedData);
    };

    // Reset all data and return to step 1
    const handleResetAll = () => {
        if (confirm('Are you sure you want to reset everything? All your progress will be lost.')) {
            localStorage.removeItem(STORAGE_KEYS.STEP);
            localStorage.removeItem(STORAGE_KEYS.DATA);
            localStorage.removeItem(STORAGE_KEYS.TIMESTAMP);
            localStorage.removeItem('report_form_step');
            
            setStep('form');
            setReportData(null);
            
            window.location.reload();
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {/* Reset Button - Always Visible */}
            <div className="fixed top-4 right-4 z-50">
                <button
                    onClick={handleResetAll}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg font-medium"
                    title="Reset all progress and start fresh"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset All
                </button>
            </div>

            {/* Auto-save indicator */}
            <div className="fixed top-4 left-4 z-50">
                <div className="bg-green-100 border border-green-300 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Auto-saved
                </div>
            </div>

            {step === 'form' ? (
                <ReportForm 
                    onComplete={handleFormComplete} 
                    initialData={reportData || undefined}
                />
            ) : (
                <ReportPreview 
                    data={reportData!} 
                    onEdit={handleEdit}
                    onUpdate={handleUpdateReport}
                />
            )}
        </div>
    );
};

export default ReportCreate;
