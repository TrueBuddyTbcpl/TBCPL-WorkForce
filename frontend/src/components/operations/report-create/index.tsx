// components/operation/report-create/index.tsx
import { useState } from 'react';
import ReportForm from './ReportForm';
import ReportPreview from './ReportPreview';
import type { ReportData } from './types/report.types';

const ReportCreate = () => {
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const handleFormComplete = (data: ReportData) => {
    setReportData(data);
    setStep('preview');
  };

  const handleEdit = () => {
    setStep('form');
  };

  // Add this new function to update report data
  const handleUpdateReport = (updatedData: ReportData) => {
    setReportData(updatedData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
