import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep7Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType, AssessmentType } from '../../../../../utils/constants';
import type { ClientLeadStep7Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';

interface Step7AssessmentProps {
  prereportId: number;
  reportId: string;
  data?: ClientLeadData | null;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step7Assessment = ({
  prereportId,
  reportId,
  data,
  onNext,
  onPrevious,
}: Step7AssessmentProps) => {
  const updateMutation = useUpdateStep();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientLeadStep7Input>({
    resolver: zodResolver(clientLeadStep7Schema),
    defaultValues: {
      assessmentOverall: data?.assessmentOverall || AssessmentType.HOLD,
      assessmentRationale: data?.assessmentRationale || '',
    },
  });

  const onSubmit = async (formData: ClientLeadStep7Input) => {
    try {
      await updateMutation.mutateAsync({
        prereportId,
        stepNumber: 7,
        data: formData,
        leadType: LeadType.CLIENT_LEAD,
        reportId,
      });
      onNext();
    } catch (error) {
      console.error('Error saving step:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Overall Assessment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Overall Assessment <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {Object.values(AssessmentType).map((type) => (
            <label
              key={type}
              className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                value={type}
                {...register('assessmentOverall')}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-gray-900">{type.replace(/_/g, ' ')}</p>
                <p className="text-sm text-gray-600">
                  {type === AssessmentType.ACTIONABLE && 
                    'Lead is ready for immediate action with sufficient evidence'}
                  {type === AssessmentType.NOT_ACTIONABLE && 
                    'Lead lacks sufficient merit or evidence for action'}
                  {type === AssessmentType.ACTIONABLE_AFTER_VALIDATION && 
                    'Lead requires additional validation before action'}
                  {type === AssessmentType.HOLD && 
                    'Lead requires further assessment or monitoring'}
                </p>
              </div>
            </label>
          ))}
        </div>
        {errors.assessmentOverall && (
          <p className="text-red-500 text-sm mt-1">{errors.assessmentOverall.message}</p>
        )}
      </div>

      {/* Assessment Rationale */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assessment Rationale <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('assessmentRationale')}
          rows={6}
          placeholder="Provide detailed reasoning for the assessment decision. Include key factors, evidence quality, risks, and recommendations."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.assessmentRationale && (
          <p className="text-red-500 text-sm mt-1">{errors.assessmentRationale.message}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Minimum 20 characters required. Be specific and comprehensive.
        </p>
      </div>

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

export default Step7Assessment;
