import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep6Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType, QACompleteness, QAAccuracy, YesNoUnknown, RiskLevel } from '../../../../../utils/constants';
import type { ClientLeadStep6Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';

interface Step6QualityProps {
  prereportId: number;
  reportId: string;
  data?: ClientLeadData | null;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step6Quality = ({
  prereportId,
  reportId,
  data,
  onNext,
  onPrevious,
}: Step6QualityProps) => {
  const updateMutation = useUpdateStep();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientLeadStep6Input>({
    resolver: zodResolver(clientLeadStep6Schema),
    defaultValues: {
      qaCompleteness: data?.qaCompleteness || QACompleteness.INCOMPLETE,
      qaAccuracy: data?.qaAccuracy || QAAccuracy.UNCERTAIN,
      qaIndependentInvestigation: data?.qaIndependentInvestigation || YesNoUnknown.UNKNOWN,
      qaPriorConfrontation: data?.qaPriorConfrontation || YesNoUnknown.UNKNOWN,
      qaContaminationRisk: data?.qaContaminationRisk || RiskLevel.MEDIUM,
    },
  });

  const onSubmit = async (formData: ClientLeadStep6Input) => {
    try {
      await updateMutation.mutateAsync({
        prereportId,
        stepNumber: 6,
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
      {/* Completeness */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Completeness of Initial Information <span className="text-red-500">*</span>
        </label>
        <select
          {...register('qaCompleteness')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.values(QACompleteness).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {errors.qaCompleteness && (
          <p className="text-red-500 text-sm mt-1">{errors.qaCompleteness.message}</p>
        )}
      </div>

      {/* Accuracy */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Accuracy of Case Description (prima facie) <span className="text-red-500">*</span>
        </label>
        <select
          {...register('qaAccuracy')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.values(QAAccuracy).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {errors.qaAccuracy && (
          <p className="text-red-500 text-sm mt-1">{errors.qaAccuracy.message}</p>
        )}
      </div>

      {/* Independent Investigation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Any Independent Client Investigation Conducted <span className="text-red-500">*</span>
        </label>
        <select
          {...register('qaIndependentInvestigation')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.values(YesNoUnknown).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {errors.qaIndependentInvestigation && (
          <p className="text-red-500 text-sm mt-1">{errors.qaIndependentInvestigation.message}</p>
        )}
      </div>

      {/* Prior Confrontation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Any Prior Confrontation with Seller / Suspect <span className="text-red-500">*</span>
        </label>
        <select
          {...register('qaPriorConfrontation')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.values(YesNoUnknown).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {errors.qaPriorConfrontation && (
          <p className="text-red-500 text-sm mt-1">{errors.qaPriorConfrontation.message}</p>
        )}
      </div>

      {/* Contamination Risk */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Risk of Information Contamination <span className="text-red-500">*</span>
        </label>
        <select
          {...register('qaContaminationRisk')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.values(RiskLevel).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {errors.qaContaminationRisk && (
          <p className="text-red-500 text-sm mt-1">{errors.qaContaminationRisk.message}</p>
        )}
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

export default Step6Quality;