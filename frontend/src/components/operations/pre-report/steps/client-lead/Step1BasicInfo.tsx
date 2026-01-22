import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep1Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType } from '../../../../../utils/constants';
import type { ClientLeadStep1Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';

interface Step1BasicInfoProps {
  prereportId: number;
  reportId: string;
  data?: ClientLeadData | null;
  onNext: () => void;
  onPrevious?: () => void;
}

export const Step1BasicInfo = ({
  prereportId,
  reportId,
  data,
  onNext,
}: Step1BasicInfoProps) => {
  const updateMutation = useUpdateStep();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientLeadStep1Input>({
    resolver: zodResolver(clientLeadStep1Schema),
    defaultValues: {
      dateInfoReceived: data?.dateInfoReceived || '',
      clientSpocName: data?.clientSpocName || '',
      clientSpocContact: data?.clientSpocContact || '',
    },
  });

  const onSubmit = async (formData: ClientLeadStep1Input) => {
    try {
      await updateMutation.mutateAsync({
        prereportId,
        stepNumber: 1,
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
      {/* Date Info Received */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date Information Received <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register('dateInfoReceived')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.dateInfoReceived && (
          <p className="text-red-500 text-sm mt-1">{errors.dateInfoReceived.message}</p>
        )}
      </div>

      {/* Client SPOC Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client SPOC Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('clientSpocName')}
          placeholder="Enter SPOC name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.clientSpocName && (
          <p className="text-red-500 text-sm mt-1">{errors.clientSpocName.message}</p>
        )}
      </div>

      {/* Client SPOC Contact */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client SPOC Contact <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          {...register('clientSpocContact')}
          placeholder="+91-XXXXXXXXXX"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.clientSpocContact && (
          <p className="text-red-500 text-sm mt-1">{errors.clientSpocContact.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
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
              <Save className="w-5 h-5" />
              Save & Continue
            </>
          )}
        </button>
      </div>
    </form>
  );
};


export default Step1BasicInfo;