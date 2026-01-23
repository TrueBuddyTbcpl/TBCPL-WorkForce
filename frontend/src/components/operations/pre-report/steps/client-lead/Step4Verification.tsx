import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useUpdateStep } from '../../../../../hooks/prereport/useUpdateStep';
import { clientLeadStep4Schema } from '../../../../../schemas/prereport.schemas';
import { LeadType, VerificationStatus } from '../../../../../utils/constants';
import type { ClientLeadStep4Input } from '../../../../../schemas/prereport.schemas';
import type { ClientLeadData } from '../../../../../types/prereport.types';

interface Step4VerificationProps {
  prereportId: number;
  reportId: string;
  data?: ClientLeadData | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

export const Step4Verification = ({
  prereportId,
  reportId,
  data,
  onNext,
  onPrevious,
  onSkip,
}: Step4VerificationProps) => {
  const updateMutation = useUpdateStep();

  const {
    register,
    handleSubmit,
  } = useForm<ClientLeadStep4Input>({
    resolver: zodResolver(clientLeadStep4Schema),
    defaultValues: {
      verificationClientDiscussion: data?.verificationClientDiscussion || VerificationStatus.NOT_DONE,
      verificationClientDiscussionNotes: data?.verificationClientDiscussionNotes || '',
      verificationOsint: data?.verificationOsint || VerificationStatus.NOT_DONE,
      verificationOsintNotes: data?.verificationOsintNotes || '',
      verificationMarketplace: data?.verificationMarketplace || VerificationStatus.NOT_DONE,
      verificationMarketplaceNotes: data?.verificationMarketplaceNotes || '',
      verificationPretextCalling: data?.verificationPretextCalling || VerificationStatus.NOT_DONE,
      verificationPretextCallingNotes: data?.verificationPretextCallingNotes || '',
      verificationProductReview: data?.verificationProductReview || VerificationStatus.NOT_DONE,
      verificationProductReviewNotes: data?.verificationProductReviewNotes || '',
    },
  });

  const onSubmit = async (formData: ClientLeadStep4Input) => {
    try {
      await updateMutation.mutateAsync({
        prereportId,
        stepNumber: 4,
        data: formData,
        leadType: LeadType.CLIENT_LEAD,
        reportId,
      });
      onNext();
    } catch (error) {
      console.error('Error saving step:', error);
    }
  };

  const verificationItems = [
    {
      name: 'Case Discussion with Client Team',
      statusField: 'verificationClientDiscussion',
      notesField: 'verificationClientDiscussionNotes',
    },
    {
      name: 'Internet / OSINT Search',
      statusField: 'verificationOsint',
      notesField: 'verificationOsintNotes',
    },
    {
      name: 'Marketplace Verification (IndiaMART / Social Media)',
      statusField: 'verificationMarketplace',
      notesField: 'verificationMarketplaceNotes',
    },
    {
      name: 'Pretext Calling (if applicable)',
      statusField: 'verificationPretextCalling',
      notesField: 'verificationPretextCallingNotes',
    },
    {
      name: 'Preliminary Product Image Review',
      statusField: 'verificationProductReview',
      notesField: 'verificationProductReviewNotes',
    },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {verificationItems.map((item) => (
        <div key={item.statusField} className="p-4 border border-gray-300 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">{item.name}</h3>
          
          <div className="space-y-3">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register(item.statusField as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.values(VerificationStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                {...register(item.notesField as any)}
                rows={3}
                placeholder="Enter verification notes"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

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

export default Step4Verification;
