import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateClientLeadStep1,
  updateClientLeadStep2,
  updateClientLeadStep3,
  updateClientLeadStep4,
  updateClientLeadStep5,
  updateClientLeadStep6,
  updateClientLeadStep7,
  updateClientLeadStep8,
  updateClientLeadStep9,
  updateClientLeadStep10,
  updateTrueBuddyLeadStep1,
  updateTrueBuddyLeadStep2,
  updateTrueBuddyLeadStep3,
  updateTrueBuddyLeadStep4,
  updateTrueBuddyLeadStep5,
  updateTrueBuddyLeadStep6,
  updateTrueBuddyLeadStep7,
  updateTrueBuddyLeadStep8,
  updateTrueBuddyLeadStep9,
  updateTrueBuddyLeadStep10,
  updateTrueBuddyLeadStep11,
} from '../../services/api/prereport.service';
import { QUERY_KEYS, LeadType } from '../../utils/constants';
import type { LeadType as LeadTypeType } from '../../utils/constants';

interface UpdateStepParams {
  prereportId: number;
  stepNumber: number;
  data: any;
  leadType: LeadTypeType;
  reportId: string;
}

export const useUpdateStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ prereportId, stepNumber, data, leadType }: UpdateStepParams) => {
      if (leadType === LeadType.CLIENT_LEAD) {
        switch (stepNumber) {
          case 1:
            return updateClientLeadStep1(prereportId, data);
          case 2:
            return updateClientLeadStep2(prereportId, data);
          case 3:
            return updateClientLeadStep3(prereportId, data);
          case 4:
            return updateClientLeadStep4(prereportId, data);
          case 5:
            return updateClientLeadStep5(prereportId, data);
          case 6:
            return updateClientLeadStep6(prereportId, data);
          case 7:
            return updateClientLeadStep7(prereportId, data);
          case 8:
            return updateClientLeadStep8(prereportId, data);
          case 9:
            return updateClientLeadStep9(prereportId, data);
          case 10:
            return updateClientLeadStep10(prereportId, data);
          default:
            throw new Error(`Invalid step number: ${stepNumber}`);
        }
      } else {
        switch (stepNumber) {
          case 1:
            return updateTrueBuddyLeadStep1(prereportId, data);
          case 2:
            return updateTrueBuddyLeadStep2(prereportId, data);
          case 3:
            return updateTrueBuddyLeadStep3(prereportId, data);
          case 4:
            return updateTrueBuddyLeadStep4(prereportId, data);
          case 5:
            return updateTrueBuddyLeadStep5(prereportId, data);
          case 6:
            return updateTrueBuddyLeadStep6(prereportId, data);
          case 7:
            return updateTrueBuddyLeadStep7(prereportId, data);
          case 8:
            return updateTrueBuddyLeadStep8(prereportId, data);
          case 9:
            return updateTrueBuddyLeadStep9(prereportId, data);
          case 10:
            return updateTrueBuddyLeadStep10(prereportId, data);
          case 11:
            return updateTrueBuddyLeadStep11(prereportId, data);
          default:
            throw new Error(`Invalid step number: ${stepNumber}`);
        }
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.PREREPORT_DETAIL(variables.reportId) 
      });
    },
  });
};
