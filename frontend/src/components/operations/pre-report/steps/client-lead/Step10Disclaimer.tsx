import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, Check } from 'lucide-react';
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep10Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType } from '../../../../../utils/constants';
import type { ClientLeadStep10Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';

interface Step10DisclaimerProps {
  prereportId: number;
  reportId: string;
  data?: ClientLeadData | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

const DEFAULT_DISCLAIMER = `This pre-investigation report is prepared based on information available at the time of assessment. The findings and recommendations are preliminary in nature and subject to change based on additional intelligence or field investigation.

TBCPL Workforce makes no warranties or guarantees regarding the accuracy, completeness, or reliability of the information contained herein. This report should be used for internal decision-making purposes only and should not be shared with third parties without proper authorization.

All information contained in this report is confidential and proprietary to TBCPL Workforce and the client. Unauthorized disclosure, distribution, or use of this report is strictly prohibited.

The recommendations provided are based on professional assessment and do not guarantee specific outcomes. Actual results may vary based on ground realities and execution factors.`;

export const Step10Disclaimer = ({
  prereportId,
  reportId,
  data,
  onNext,
  onPrevious,
  onSkip,
}: Step10DisclaimerProps) => {
  const updateMutation = useUpdateStep();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientLeadStep10Input>({
    resolver: zodResolver(clientLeadStep10Schema),
    defaultValues: {
      customDisclaimer: data?.customDisclaimer || DEFAULT_DISCLAIMER,
    },
  });

  const disclaimerValue = watch('customDisclaimer');
  const charCount = disclaimerValue?.length || 0;

  const onSubmit = async (formData: ClientLeadStep10Input) => {
    try {
      await updateMutation.mutateAsync({
        prereportId,
        stepNumber: 10,
        data: formData,
        leadType: LeadType.CLIENT_LEAD,
        reportId,
      });
      onNext();
    } catch (error) {
      console.error('Error saving step:', error);
    }
  };

  const handleUseDefault = () => {
    setValue('customDisclaimer', DEFAULT_DISCLAIMER);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-medium text-purple-900 mb-2">Report Disclaimer</h3>
        <p className="text-sm text-purple-800">
          This is the final step. The disclaimer will appear at the end of the report and sets the legal and operational context for the document.
        </p>
      </div>

      {/* Custom Disclaimer */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Disclaimer Text <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={handleUseDefault}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Use Default Template
          </button>
        </div>
        <textarea
          {...register('customDisclaimer')}
          rows={12}
          placeholder="Enter custom disclaimer text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        />
        {errors.customDisclaimer && (
          <p className="text-red-500 text-sm mt-1">{errors.customDisclaimer.message}</p>
        )}
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-500">Minimum 20 characters required</p>
          <p className={`text-sm ${charCount < 20 ? 'text-red-500' : 'text-gray-500'}`}>
            {charCount} characters
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Disclaimer Should Include:</h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Preliminary nature of the report</li>
          <li>Limitations of information and assessment</li>
          <li>Confidentiality requirements</li>
          <li>Usage restrictions</li>
          <li>No warranty or guarantee clauses</li>
          <li>Professional liability limitations</li>
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
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Complete Report
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default Step10Disclaimer;