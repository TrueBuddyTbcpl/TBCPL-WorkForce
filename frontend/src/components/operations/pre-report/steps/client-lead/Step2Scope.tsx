import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep2Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType } from '../../../../../utils/constants';
import type { ClientLeadStep2Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';

interface Step2ScopeProps {
  prereportId: number;
  reportId: string;
  data: ClientLeadData | null | undefined;
  onNext: (stepData?: any) => Promise<void>;
  onPrevious: () => Promise<void>;
  onSkip?: () => Promise<void> | void; // ✅ add this line
}


export const Step2Scope = ({
  prereportId,
  reportId,
  data,
  onNext,
  onPrevious,
}: Step2ScopeProps) => {
  const updateMutation = useUpdateStep();

  const {
    register,
    handleSubmit,
  } = useForm<ClientLeadStep2Input>({
    resolver: zodResolver(clientLeadStep2Schema),
    defaultValues: {
      scopeDueDiligence: data?.scopeDueDiligence || false,
      scopeIprRetailer: data?.scopeIprRetailer || false,
      scopeIprSupplier: data?.scopeIprSupplier || false,
      scopeIprManufacturer: data?.scopeIprManufacturer || false,
      scopeOnlinePurchase: data?.scopeOnlinePurchase || false,
      scopeOfflinePurchase: data?.scopeOfflinePurchase || false,
      scopeCustomIds: data?.scopeCustomIds || [],
    },
  });

  const onSubmit = async (formData: ClientLeadStep2Input) => {
    try {
      await updateMutation.mutateAsync({
        prereportId,
        stepNumber: 2,
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
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            {...register('scopeDueDiligence')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Due Diligence</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            {...register('scopeIprRetailer')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">IPR - Retailer/ Wholesaler</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            {...register('scopeIprSupplier')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">IPR - Supplier</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            {...register('scopeIprManufacturer')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">IPR - Manufacturer / Packager / Warehouse</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            {...register('scopeOnlinePurchase')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Online Sample Purchase</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            {...register('scopeOfflinePurchase')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Offline Sample Purchase</span>
        </label>
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

export default Step2Scope;