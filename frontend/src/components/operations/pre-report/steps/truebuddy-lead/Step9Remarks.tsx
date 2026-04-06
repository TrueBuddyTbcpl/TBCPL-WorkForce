// src/components/operations/pre-report/steps/truebuddy-lead/Step9Remarks.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TrueBuddyLeadStep9Input } from '../../../../../schemas/prereport.schemas';
import { trueBuddyLeadStep9Schema } from '../../../../../schemas/prereport.schemas';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';


interface Step9Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack: () => void;
  onSkip: () => void;
}


const TrueBuddyStep9Remarks: React.FC<Step9Props> = ({ data, onNext, onBack, onSkip }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep9Input>({
    resolver: zodResolver(trueBuddyLeadStep9Schema),
    defaultValues: {
      remarks: data.remarks || '',    // ← CHANGED from confidentialityNote
    },
  });

  const remarks = watch('remarks');   // ← CHANGED from confidentialityNote
  const charCount = remarks?.trim().length || 0;

  const onSubmit = async (formData: TrueBuddyLeadStep9Input) => {
    try {
      await onNext(formData);
    } catch (error) {
      console.error('Error submitting Step 9:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Step 9: Remarks
            </h2>
            <p className="text-gray-600 mt-2">
              Add any additional remarks, notes, or observations relevant to this TrueBuddy lead.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* ── Remarks Textarea ─────────────────────────────────────────── */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Remarks
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Document any supplementary notes, follow-up actions, or contextual information
              that does not fit elsewhere in this report.
            </p>
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <div>
                  <textarea
                    {...field}
                    rows={10}
                    placeholder="Enter any additional remarks or notes here..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500
                                focus:border-transparent resize-none text-sm ${
                      errors.remarks ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {errors.remarks && (
                        <p className="text-sm text-red-600">{errors.remarks.message}</p>
                      )}
                    </div>
                    <p className={`text-xs font-medium ${
                      charCount === 0
                        ? 'text-gray-400'
                        : charCount < 10
                          ? 'text-yellow-600'
                          : 'text-green-600'
                    }`}>
                      {charCount} characters
                    </p>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Preview Box — only shown when content exists */}
          {charCount >= 10 && (
            <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
                         -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">
                    Remarks Preview
                  </h4>
                  <div className="text-sm text-blue-700 whitespace-pre-wrap bg-white
                                  rounded p-3 border border-blue-200">
                    {remarks}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Form Actions ─────────────────────────────────────────────── */}
          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="px-6 py-3 border-2 border-yellow-400 text-yellow-700 font-medium rounded-lg hover:bg-yellow-50 transition-colors"
            >
              Skip Step
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Next Step'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Info Box ─────────────────────────────────────────────────────── */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9
                   9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Remarks Guidelines</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Use this section to capture any observations, follow-up actions, or notes
                that provide additional context to this TrueBuddy lead but are not covered
                in other sections. This field is optional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueBuddyStep9Remarks;