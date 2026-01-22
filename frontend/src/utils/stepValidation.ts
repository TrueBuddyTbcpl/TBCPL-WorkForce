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
        return !!(
          clientLeadData.dateInfoReceived &&
          clientLeadData.clientSpocName &&
          clientLeadData.clientSpocContact
        );
      case 2:
        return true; // Scope is optional checkboxes
      case 3:
        return !!(
          clientLeadData.entityName &&
          clientLeadData.suspectName &&
          clientLeadData.contactNumbers &&
          clientLeadData.addressLine1 &&
          clientLeadData.city &&
          clientLeadData.state &&
          clientLeadData.pincode &&
          clientLeadData.productDetails &&
          clientLeadData.sourceNarrative
        );
      case 4:
        return !!(
          clientLeadData.verificationClientDiscussion &&
          clientLeadData.verificationOsint &&
          clientLeadData.verificationMarketplace &&
          clientLeadData.verificationPretextCalling &&
          clientLeadData.verificationProductReview
        );
      case 5:
        return !!(
          clientLeadData.obsIdentifiableTarget &&
          clientLeadData.obsTraceability &&
          clientLeadData.obsProductVisibility &&
          clientLeadData.obsCounterfeitingIndications &&
          clientLeadData.obsEvidentiary_gaps
        );
      case 6:
        return !!(
          clientLeadData.qaCompleteness &&
          clientLeadData.qaAccuracy &&
          clientLeadData.qaIndependentInvestigation &&
          clientLeadData.qaPriorConfrontation &&
          clientLeadData.qaContaminationRisk
        );
      case 7:
        return !!(
          clientLeadData.assessmentOverall &&
          clientLeadData.assessmentRationale
        );
      case 8:
        return true; // Recommendations are optional checkboxes
      case 9:
        return !!clientLeadData.remarks;
      case 10:
        return !!clientLeadData.customDisclaimer;
      default:
        return false;
    }
  } else if (leadType === 'TRUEBUDDY_LEAD' && trueBuddyLeadData) {
    switch (stepNumber) {
      case 1:
        return !!(
          trueBuddyLeadData.dateInternalLeadGeneration &&
          trueBuddyLeadData.productCategory &&
          trueBuddyLeadData.infringementType &&
          trueBuddyLeadData.broadGeography &&
          trueBuddyLeadData.clientSpocName &&
          trueBuddyLeadData.clientSpocDesignation &&
          trueBuddyLeadData.natureOfEntity
        );
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
        return !!(
          trueBuddyLeadData.verificationIntelCorroboration &&
          trueBuddyLeadData.verificationOsint &&
          trueBuddyLeadData.verificationPatternMapping &&
          trueBuddyLeadData.verificationJurisdiction &&
          trueBuddyLeadData.verificationRiskAssessment
        );
      case 5:
        return !!(
          trueBuddyLeadData.obsOperationScale &&
          trueBuddyLeadData.obsCounterfeitLikelihood &&
          trueBuddyLeadData.obsBrandExposure &&
          trueBuddyLeadData.obsEnforcementSensitivity &&
          trueBuddyLeadData.obsLeakageRisk
        );
      case 6:
        return !!(
          trueBuddyLeadData.riskSourceReliability &&
          trueBuddyLeadData.riskClientConflict &&
          trueBuddyLeadData.riskImmediateAction &&
          trueBuddyLeadData.riskControlledValidation &&
          trueBuddyLeadData.riskPrematureDisclosure
        );
      case 7:
        return !!(
          trueBuddyLeadData.assessmentOverall &&
          trueBuddyLeadData.assessmentRationale
        );
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
