// src/components/operations/pre-report/steps/truebuddy-lead/Step9Confidentiality.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  TrueBuddyLeadStep9Input,
} from '../../../../../schemas/prereport.schemas';
import { trueBuddyLeadStep9Schema } from '../../../../../schemas/prereport.schemas';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';

interface Step9Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack: () => void;
  onSkip: () => void;
}

const TrueBuddyStep9Confidentiality: React.FC<Step9Props> = ({ data, onNext, onBack, onSkip }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep9Input>({
    resolver: zodResolver(trueBuddyLeadStep9Schema),
    defaultValues: {
      confidentialityNote: data.confidentialityNote || '',
    },
  });

  const onSubmit = async (formData: TrueBuddyLeadStep9Input) => {
    try {
      await onNext(formData);
    } catch (error) {
      console.error('Error submitting Step 9:', error);
    }
  };

  const confidentialityNote = watch('confidentialityNote');
  const charCount = confidentialityNote?.length || 0;

  const suggestedPoints = [
    'Source protection requirements',
    'Internal distribution restrictions',
    'Client disclosure limitations',
    'Operational security measures',
    'Information handling protocols',
    'Access control requirements',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Step 9: Confidentiality & Ring-Fencing Note
            </h2>
            <p className="text-gray-600 mt-2">
              Document specific confidentiality requirements and handling protocols for this TrueBuddy lead.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Alert Box */}
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Confidential Information - Restricted Access
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    TrueBuddy leads contain highly sensitive information. Ensure proper confidentiality measures
                    are documented and followed throughout the investigation lifecycle.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Points */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Consider Including:
            </h3>
            <ul className="space-y-2">
              {suggestedPoints.map((point, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Confidentiality Note */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Confidentiality Note *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Provide detailed confidentiality instructions and handling requirements for this intelligence.
            </p>
            <Controller
              name="confidentialityNote"
              control={control}
              render={({ field }) => (
                <div>
                  <textarea
                    {...field}
                    rows={10}
                    placeholder="Document confidentiality requirements...

Example:
• This intelligence is classified as HIGHLY CONFIDENTIAL - TrueBuddy Lead
• Distribution limited to: [specify roles/individuals]
• Source protection: [specify measures]
• Client disclosure: [specify what can/cannot be shared]
• Operational security: [specify handling protocols]
• Information retention: [specify storage and access controls]
• Breach reporting: [specify escalation procedures]"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm ${errors.confidentialityNote ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {errors.confidentialityNote && (
                        <p className="text-sm text-red-600">{errors.confidentialityNote.message}</p>
                      )}
                    </div>
                    <p className={`text-xs font-medium ${charCount < 10
                        ? 'text-red-600'
                        : charCount < 50
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}>
                      {charCount} characters (minimum 10 required)
                    </p>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Preview Box */}
          {charCount >= 10 && (
            <div className="border-2 border-red-300 bg-red-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-800 mb-2">
                    Confidentiality Note Preview
                  </h4>
                  <div className="text-sm text-red-700 whitespace-pre-wrap bg-white rounded p-3 border border-red-200">
                    {confidentialityNote}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
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
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Next Step'}
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="bg-gray-900 text-white rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-white">Security Reminder</h3>
            <div className="mt-2 text-sm text-gray-300">
              <p>
                <strong>TrueBuddy leads are highly confidential.</strong> Unauthorized disclosure may compromise
                investigations, endanger sources, damage client relationships, and violate legal obligations.
                Ensure all team members handling this intelligence understand and follow the documented protocols.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueBuddyStep9Confidentiality;
