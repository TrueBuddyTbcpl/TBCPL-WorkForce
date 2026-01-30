// src/components/operations/pre-report/utils/stepValidation.ts
import { LeadType } from '../../../../utils/constants';

export const getTotalSteps = (leadType: string): number => {
  return leadType === LeadType.CLIENT_LEAD ? 10 : 11;
};

export const isStepValid = (step: number, leadType: string): boolean => {
  const totalSteps = getTotalSteps(leadType);
  return step >= 1 && step <= totalSteps;
};

export const getStepTitle = (step: number, leadType: string): string => {
  if (leadType === LeadType.CLIENT_LEAD) {
    const titles = [
      'Case Details',
      'Mandate / Scope Requested',
      'Information Received from Client',
      'Preliminary Verification Conducted by True Buddy',
      'Key Observations',
      'Information Quality Assessment',
      'True Buddy’s Preliminary Assessment',
      'Recommended Way Forward',
      'Remarks',
      'Disclaimer',
    ];
    return titles[step - 1] || '';
  } else {
    const titles = [
      'Case Reference',
      'Mandate / Scope Proposed',
      'High-Level Lead Description (Sanitised)',
      'Preliminary Verification Conducted by True Buddy',
      'Key Observations (Client-Safe)',
      'Information Integrity & Risk Assessment',
      'True Buddy’s Preliminary Assessment',
      'Recommended Way Forward',
      'Confidentiality & Ring-Fencing Note',
      'Remarks',
      'Disclaimer',
    ];
    return titles[step - 1] || '';
  }
};

export const getNextStep = (currentStep: number, totalSteps: number): number => {
  return Math.min(currentStep + 1, totalSteps);
};

export const getPreviousStep = (currentStep: number): number => {
  return Math.max(currentStep - 1, 1);
};

export const canProceedToNextStep = (currentStep: number, totalSteps: number): boolean => {
  return currentStep < totalSteps;
};

export const isLastStep = (currentStep: number, totalSteps: number): boolean => {
  return currentStep === totalSteps;
};
