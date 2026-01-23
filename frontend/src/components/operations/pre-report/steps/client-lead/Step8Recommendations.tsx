import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep8Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType } from '../../../../../utils/constants';
import type { ClientLeadStep8Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';

interface Step8RecommendationsProps {
  prereportId: number;
  reportId: string;
  data?: ClientLeadData | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

export const Step8Recommendations = ({
  prereportId,
  reportId,
  data,
  onNext,
  onPrevious,
  onSkip,
}: Step8RecommendationsProps) => {
  const updateMutation = useUpdateStep();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientLeadStep8Input>({
    resolver: zodResolver(clientLeadStep8Schema),
    defaultValues: {
      recMarketSurvey: data?.recMarketSurvey || false,
      recCovertInvestigation: data?.recCovertInvestigation || false,
      recTestPurchase: data?.recTestPurchase || false,
      recEnforcementAction: data?.recEnforcementAction || false,
      recAdditionalInfo: data?.recAdditionalInfo || false,
      recClosureHold: data?.recClosureHold || false,
    },
  });

  const onSubmit = async (formData: ClientLeadStep8Input) => {
    try {
      await updateMutation.mutateAsync({
        prereportId,
        stepNumber: 8,
        data: formData,
        leadType: LeadType.CLIENT_LEAD,
        reportId,
      });
      onNext();
    } catch (error) {
      console.error('Error saving step:', error);
    }
  };

  const recommendations = [
    {
      field: 'recMarketSurvey',
      label: 'Market Survey',
      description: 'Conduct comprehensive market survey to assess product distribution',
    },
    {
      field: 'recCovertInvestigation',
      label: 'Covert Investigation',
      description: 'Initiate undercover investigation to gather additional intelligence',
    },
    {
      field: 'recTestPurchase',
      label: 'Test Purchase',
      description: 'Execute controlled test purchase for evidence collection',
    },
    {
      field: 'recEnforcementAction',
      label: 'Enforcement Action',
      description: 'Proceed with immediate enforcement action (raid/seizure)',
    },
    {
      field: 'recAdditionalInfo',
      label: 'Additional Information Required',
      description: 'Request additional information from client before proceeding',
    },
    {
      field: 'recClosureHold',
      label: 'Closure/Hold',
      description: 'Close the lead or place on hold pending further developments',
    },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Select all recommended actions based on the assessment. Multiple selections are allowed.
        </p>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <label
            key={rec.field}
            className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="checkbox"
              {...register(rec.field as keyof ClientLeadStep8Input)}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{rec.label}</p>
              <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
            </div>
          </label>
        ))}
      </div>

      {errors.root && (
        <p className="text-red-500 text-sm">{errors.root.message}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>
        {/* Skip Button */}
        <button
          type="button"
          onClick={onSkip}
          className="px-6 py-3 border-2 border-yellow-400 text-yellow-700 font-medium rounded-lg hover:bg-yellow-50 transition-colors"
        >
          Skip Step
        </button>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Save & Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default Step8Recommendations;