// src/components/operations/pre-report/PreReportDetailsSidebar.tsx
import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface StepStatus {
  stepNumber: number;
  stepName: string;
  status: 'PENDING' | 'COMPLETED';
}

interface PreReportDetailsSidebarProps {
  currentStep: number;
  leadType: string;
  clientName?: string;
  productCount?: number;
  stepStatuses?: StepStatus[];
  onStepClick?: (step: number) => void;
}

export const PreReportDetailsSidebar: React.FC<PreReportDetailsSidebarProps> = ({
  currentStep,
  leadType,
  clientName,
  productCount,
  stepStatuses = [],
}) => {
  const totalSteps = leadType === 'CLIENT_LEAD' ? 10 : 11;

  // Calculate progress based on COMPLETED steps
  const completedSteps = stepStatuses.filter(s => s.status === 'COMPLETED').length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  // Helper to get step status
  const getStepStatus = (step: number): 'PENDING' | 'COMPLETED' => {
    const tracked = stepStatuses.find(s => s.stepNumber === step);
    return tracked?.status || 'PENDING';
  };

  // Helper to get step name
  const getStepName = (step: number): string => {
    const tracked = stepStatuses.find(s => s.stepNumber === step);
    return tracked?.stepName || `Step ${step}`;
  };

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
            {completedSteps} of {totalSteps} steps completed
          </p>
        </div>

        {/* Step Status */}
        <div className="pt-2 border-t">
          <span className="text-xs text-gray-500 uppercase mb-3 block">Steps</span>
          <div className="space-y-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
              const status = getStepStatus(step);
              const stepName = getStepName(step);
              const isActive = step === currentStep;
              const isCompleted = status === 'COMPLETED';

              return (
                <div
                  key={step}
                  className={`flex items-center gap-2 p-2 rounded transition-all duration-200 ${isActive ? 'bg-blue-50 scale-105' : ''
                    }`}
                >
                  {/* Icon */}
                  {isActive ? (
                    <Circle className={`flex-shrink-0 text-blue-500 fill-blue-500 ${isCompleted ? 'w-5 h-5' : 'w-4 h-4'
                      }`} />
                  ) : status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <span
                      className={`block truncate transition-all ${isActive
                          ? isCompleted
                            ? 'text-sm font-bold text-blue-600'  // Active + Completed
                            : 'text-sm font-semibold text-blue-600'  // Active only
                          : status === 'COMPLETED'
                            ? 'text-sm font-bold text-green-700'  // Completed but not active
                            : 'text-xs text-gray-400'  // Pending
                        }`}
                      title={stepName}
                    >
                      {stepName}
                    </span>
                  </div>

                  {/* Status indicators */}
                  {status === 'COMPLETED' && !isActive && (
                    <span className="text-sm font-bold text-green-600 flex-shrink-0">✓</span>
                  )}

                  {isActive && (
                    <span className="text-xs px-1.5 py-0.5 bg-blue-500 text-white rounded font-medium flex-shrink-0">
                      •
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PreReportDetailsSidebar;
