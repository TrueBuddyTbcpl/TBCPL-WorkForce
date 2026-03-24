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
  onStepClick,             // ← now consumed
}) => {
  const totalSteps = leadType === 'CLIENT_LEAD' ? 10 : 11;

  const completedSteps = stepStatuses.filter(s => s.status === 'COMPLETED').length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  const getStepStatus = (step: number): 'PENDING' | 'COMPLETED' => {
    const tracked = stepStatuses.find(s => s.stepNumber === step);
    return tracked?.status || 'PENDING';
  };

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

        {/* Step Status — each step is now a clickable button */}
        <div className="pt-2 border-t">
          <span className="text-xs text-gray-500 uppercase mb-3 block">Steps</span>
          <div className="space-y-1">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
              const status    = getStepStatus(step);
              const stepName  = getStepName(step);
              const isActive    = step === currentStep;
              const isCompleted = status === 'COMPLETED';

              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => onStepClick?.(step)}   // ← navigate on click
                  title={`Go to ${stepName}`}
                  className={`
                    w-full flex items-center gap-2 p-2 rounded text-left
                    transition-all duration-200
                    ${onStepClick ? 'cursor-pointer' : 'cursor-default'}
                    ${isActive
                      ? 'bg-blue-50 scale-105 ring-1 ring-blue-200'
                      : isCompleted
                        ? 'hover:bg-green-50'
                        : 'hover:bg-gray-50'
                    }
                  `}
                >
                  {/* Icon */}
                  {isActive ? (
                    <Circle className={`flex-shrink-0 text-blue-500 fill-blue-500 ${isCompleted ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  )}

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`block truncate transition-all ${
                        isActive
                          ? isCompleted
                            ? 'text-sm font-bold text-blue-600'
                            : 'text-sm font-semibold text-blue-600'
                          : isCompleted
                            ? 'text-sm font-bold text-green-700'
                            : 'text-xs text-gray-400'
                      }`}
                      title={stepName}
                    >
                      {stepName}
                    </span>
                  </div>

                  {/* Completed checkmark */}
                  {isCompleted && !isActive && (
                    <span className="text-sm font-bold text-green-600 flex-shrink-0">✓</span>
                  )}

                  {/* Active dot */}
                  {isActive && (
                    <span className="text-xs px-1.5 py-0.5 bg-blue-500 text-white rounded font-medium flex-shrink-0">
                      •
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreReportDetailsSidebar;
