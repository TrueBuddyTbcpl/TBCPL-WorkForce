import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { PROPOSAL_STEP_LABELS } from '../../../../utils/constants';
import type { ProposalStepStatusResponse } from '../../../../types/proposal.types';

interface Props {
  steps:        ProposalStepStatusResponse[];
  currentStep:  number;
  onStepClick:  (index: number) => void;
}

const ProposalBreadcrumb: React.FC<Props> = ({ steps, currentStep, onStepClick }) => (
  <div className="flex items-center gap-1 flex-wrap mb-6">
    {steps.map((step, index) => {
      const isCompleted = step.status === 'COMPLETED';
      const isCurrent   = index === currentStep;
      return (
        <React.Fragment key={step.stepName}>
          <button
            type="button"
            onClick={() => onStepClick(index)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition
              ${isCurrent    ? 'bg-blue-600 text-white'
              : isCompleted  ? 'bg-green-100 text-green-700 hover:bg-green-200'
              :                'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {isCompleted
              ? <CheckCircle className="w-3.5 h-3.5" />
              : <Circle className="w-3.5 h-3.5" />}
            {PROPOSAL_STEP_LABELS[step.stepName] ?? step.stepName}
          </button>
          {index < steps.length - 1 && (
            <span className="text-gray-300 text-xs">›</span>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default ProposalBreadcrumb;
