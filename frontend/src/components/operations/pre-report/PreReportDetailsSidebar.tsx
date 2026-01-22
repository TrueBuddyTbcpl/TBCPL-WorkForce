// src/components/operations/pre-report/PreReportDetailsSidebar.tsx
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface PreReportDetailsSidebarProps {
  currentStep: number;
  leadType: string;
  clientName?: string;
  productCount?: number;
  onStepClick?: (step: number) => void;
}

export const PreReportDetailsSidebar: React.FC<PreReportDetailsSidebarProps> = ({
  currentStep,
  leadType,
  clientName,
  productCount,
}) => {
  // ✅ Calculate totalSteps based on leadType
  const totalSteps = leadType === 'CLIENT_LEAD' ? 10 : 11;
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Details</h3>
      
      <div className="space-y-4">
        {/* Lead Type */}
        <div>
          <span className="text-xs text-gray-500 uppercase">Lead Type</span>
          <p className="text-sm font-medium text-gray-900 mt-1">
            {leadType === 'CLIENT_LEAD' ? 'Client Lead' : 'TrueBuddy Lead'}
          </p>
        </div>

        {/* Client Name */}
        {clientName && (
          <div>
            <span className="text-xs text-gray-500 uppercase">Client</span>
            <p className="text-sm font-medium text-gray-900 mt-1">{clientName}</p>
          </div>
        )}

        {/* Product Count */}
        {productCount !== undefined && (
          <div>
            <span className="text-xs text-gray-500 uppercase">Products</span>
            <p className="text-sm font-medium text-gray-900 mt-1">{productCount} selected</p>
          </div>
        )}

        {/* Progress */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase">Progress</span>
            <span className="text-sm font-semibold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Step Status */}
        <div className="pt-2 border-t">
          <span className="text-xs text-gray-500 uppercase mb-3 block">Steps</span>
          <div className="space-y-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center gap-2">
                {step < currentStep ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : step === currentStep ? (
                  <Circle className="w-4 h-4 text-blue-500 fill-blue-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300" />
                )}
                <span
                  className={`text-xs ${
                    step <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-400'
                  }`}
                >
                  Step {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PreReportDetailsSidebar;