import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep5Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType } from '../../../../../utils/constants';
import type { ClientLeadStep5Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';

interface Step5ObservationsProps {
  prereportId: number;
  reportId: string;
  data?: ClientLeadData | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

export const Step5Observations = ({
  prereportId,
  reportId,
  data,
  onNext,
  onPrevious,
  onSkip,
}: Step5ObservationsProps) => {
  const updateMutation = useUpdateStep();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientLeadStep5Input>({
    resolver: zodResolver(clientLeadStep5Schema),
    defaultValues: {
      obsIdentifiableTarget: data?.obsIdentifiableTarget || '',
      obsTraceability: data?.obsTraceability || '',
      obsProductVisibility: data?.obsProductVisibility || '',
      obsCounterfeitingIndications: data?.obsCounterfeitingIndications || '',
      obsEvidentiary_gaps: data?.obsEvidentiary_gaps || '',
    },
  });

  const onSubmit = async (formData: ClientLeadStep5Input) => {
    try {
      await updateMutation.mutateAsync({
        prereportId,
        stepNumber: 5,
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
      {/* Identifiable Target */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Availability of Identifiable Target <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('obsIdentifiableTarget')}
          rows={4}
          placeholder="Observations about target identification"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.obsIdentifiableTarget && (
          <p className="text-red-500 text-sm mt-1">{errors.obsIdentifiableTarget.message}</p>
        )}
      </div>

      {/* Traceability */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Traceability of Entity / Contact <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('obsTraceability')}
          rows={4}
          placeholder="Observations about product traceability"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.obsTraceability && (
          <p className="text-red-500 text-sm mt-1">{errors.obsTraceability.message}</p>
        )}
      </div>

      {/* Product Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Visibility / Market Presence <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('obsProductVisibility')}
          rows={4}
          placeholder="Observations about product visibility in market"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.obsProductVisibility && (
          <p className="text-red-500 text-sm mt-1">{errors.obsProductVisibility.message}</p>
        )}
      </div>

      {/* Counterfeiting Indications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Indications of Counterfeiting / Lookalike <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('obsCounterfeitingIndications')}
          rows={4}
          placeholder="Observations about counterfeiting indicators"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.obsCounterfeitingIndications && (
          <p className="text-red-500 text-sm mt-1">{errors.obsCounterfeitingIndications.message}</p>
        )}
      </div>

      {/* Evidentiary Gaps */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Evidentiary Gaps Identified <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('obsEvidentiary_gaps')}
          rows={4}
          placeholder="Observations about gaps in evidence"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.obsEvidentiary_gaps && (
          <p className="text-red-500 text-sm mt-1">{errors.obsEvidentiary_gaps.message}</p>
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

export default Step5Observations;
