import type { ClientLeadData, TrueBuddyLeadData } from '../types/prereport.types';
import type { LeadType } from '../utils/constants';

// Check if a specific step is completed
export const isStepComplete = (
  stepNumber: number,
  leadType: LeadType,
  clientLeadData?: ClientLeadData | null,
  trueBuddyLeadData?: TrueBuddyLeadData | null
): boolean => {
  if (leadType === 'CLIENT_LEAD' && clientLeadData) {
    switch (stepNumber) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        return true; // ✅ All steps are optional
      default:
        return false;
        return false;
    }
  } else if (leadType === 'TRUEBUDDY_LEAD' && trueBuddyLeadData) {
    switch (stepNumber) {
      case 1:
        return true;
      case 2:
        return true; // Scope is optional checkboxes
      case 3:
        return !!(
          trueBuddyLeadData.intelNature &&
          trueBuddyLeadData.suspectedActivity &&
          trueBuddyLeadData.productSegment &&
          trueBuddyLeadData.supplyChainStage &&
          trueBuddyLeadData.repeatIntelligence &&
          trueBuddyLeadData.multiBrandRisk
        );
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        return true; // Recommendations are optional checkboxes
      case 9:
        return !!trueBuddyLeadData.confidentialityNote;
      case 10:
        return !!trueBuddyLeadData.remarks;
      case 11:
        return !!trueBuddyLeadData.customDisclaimer;
      default:
        return false;
    }
  }
  return false;
};

// Get completion percentage
export const getCompletionPercentage = (
  leadType: LeadType,
  clientLeadData?: ClientLeadData | null,
  trueBuddyLeadData?: TrueBuddyLeadData | null
): number => {
  const totalSteps = leadType === 'CLIENT_LEAD' ? 10 : 11;
  let completedSteps = 0;

  for (let i = 1; i <= totalSteps; i++) {
    if (isStepComplete(i, leadType, clientLeadData, trueBuddyLeadData)) {
      completedSteps++;
    }
  }

  return Math.round((completedSteps / totalSteps) * 100);
};
