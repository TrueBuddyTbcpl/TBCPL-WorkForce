import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep9Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType } from '../../../../../utils/constants';
import type { ClientLeadStep9Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';

interface Step9RemarksProps {
  prereportId: number;
  reportId: string;
  data?: ClientLeadData | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

export const Step9Remarks = ({
  prereportId,
  reportId,
  data,
  onNext,
  onPrevious,
  onSkip,
}: Step9RemarksProps) => {
  const updateMutation = useUpdateStep();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ClientLeadStep9Input>({
    resolver: zodResolver(clientLeadStep9Schema),
    defaultValues: {
      remarks: data?.remarks || '',
    },
  });

  const remarksValue = watch('remarks');
  const charCount = remarksValue?.length || 0;

  const onSubmit = async (formData: ClientLeadStep9Input) => {
    try {
      await updateMutation.mutateAsync({
        prereportId,
        stepNumber: 9,
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
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-medium text-amber-900 mb-2">Additional Remarks</h3>
        <p className="text-sm text-amber-800">
          Include any additional observations, concerns, or contextual information that may be relevant to this pre-report but not covered in previous sections.
        </p>
      </div>

      {/* Remarks */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Remarks <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('remarks')}
          rows={8}
          placeholder="Enter any additional remarks, observations, or notes that provide context to this pre-report..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.remarks && (
          <p className="text-red-500 text-sm mt-1">{errors.remarks.message}</p>
        )}
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-500">Minimum 10 characters required</p>
          <p className={`text-sm ${charCount < 10 ? 'text-red-500' : 'text-gray-500'}`}>
            {charCount} characters
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Suggestions for Remarks:</h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Unique characteristics of this case</li>
          <li>Coordination requirements with other teams</li>
          <li>Timeline sensitivities or urgency factors</li>
          <li>Client-specific considerations or concerns</li>
          <li>Resource requirements or constraints</li>
          <li>Any red flags or areas requiring special attention</li>
        </ul>
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

export default Step9Remarks;