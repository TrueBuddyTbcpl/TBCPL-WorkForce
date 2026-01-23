// src/components/operations/pre-report/steps/truebuddy-lead/Step10Remarks.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  TrueBuddyLeadStep10Input,
} from '../../../../../schemas/prereport.schemas';
import {trueBuddyLeadStep10Schema} from '../../../../../schemas/prereport.schemas';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';

interface Step10Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack: () => void;
  onSkip: () => void;
}

const TrueBuddyStep10Remarks: React.FC<Step10Props> = ({ data, onNext, onBack,onSkip, }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep10Input>({
    resolver: zodResolver(trueBuddyLeadStep10Schema),
    defaultValues: {
      remarks: data.remarks || '',
    },
  });

  const onSubmit = async (formData: TrueBuddyLeadStep10Input) => {
    try {
      await onNext(formData);
    } catch (error) {
      console.error('Error submitting Step 10:', error);
    }
  };

  const remarks = watch('remarks');
  const charCount = remarks?.length || 0;
  const wordCount = remarks?.trim().split(/\s+/).filter(Boolean).length || 0;

  const remarksSuggestions = [
    {
      category: 'Context & Background',
      examples: [
        'Historical context of the target or location',
        'Previous interactions or intelligence on this entity',
        'Relevant market dynamics or competitive landscape',
      ],
    },
    {
      category: 'Operational Considerations',
      examples: [
        'Logistical challenges or considerations',
        'Resource requirements or constraints',
        'Timeline considerations',
      ],
    },
    {
      category: 'Stakeholder Notes',
      examples: [
        'Client expectations or specific concerns',
        'Internal team coordination requirements',
        'External agency involvement or considerations',
      ],
    },
    {
      category: 'Additional Observations',
      examples: [
        'Unusual patterns or anomalies',
        'Potential complications or red flags',
        'Opportunities or strategic considerations',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Step 10: Additional Remarks
        </h2>

        <p className="text-gray-600 mb-6">
          Document any additional observations, context, or considerations that don't fit in previous sections 
          but are relevant to this TrueBuddy lead.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Suggestions Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-blue-900 mb-4 flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              What to Include in Remarks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {remarksSuggestions.map((section, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    {section.category}
                  </h4>
                  <ul className="space-y-1">
                    {section.examples.map((example, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks Textarea */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Remarks *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Provide comprehensive remarks covering relevant context, observations, and considerations.
            </p>
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <div>
                  <textarea
                    {...field}
                    rows={12}
                    placeholder="Enter your remarks here...

You may include:
• Additional context or background information
• Observations not covered in previous sections
• Operational considerations or challenges
• Coordination requirements
• Strategic recommendations
• Follow-up actions or next steps
• Any other relevant information"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      errors.remarks ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {errors.remarks && (
                        <p className="text-sm text-red-600">{errors.remarks.message}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`font-medium ${
                        charCount < 10 
                          ? 'text-red-600' 
                          : charCount < 50 
                          ? 'text-yellow-600' 
                          : 'text-green-600'
                      }`}>
                        {charCount} characters
                      </span>
                      <span className="text-gray-500">
                        {wordCount} words
                      </span>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Progress Indicator */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Completion Progress</span>
              <span className={`text-sm font-semibold ${
                charCount >= 100 ? 'text-green-600' : 
                charCount >= 50 ? 'text-yellow-600' : 
                'text-gray-500'
              }`}>
                {charCount >= 10 ? (charCount >= 100 ? 'Well detailed' : 'Good') : 'Needs more detail'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  charCount >= 100 ? 'bg-green-500' : 
                  charCount >= 50 ? 'bg-yellow-500' : 
                  charCount >= 10 ? 'bg-blue-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${Math.min((charCount / 200) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Minimum 10 characters required • 100+ characters recommended for comprehensive remarks
            </p>
          </div>

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
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-purple-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-800">Writing Effective Remarks</h3>
            <div className="mt-2 text-sm text-purple-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Be specific and factual - avoid vague statements</li>
                <li>Include relevant dates, locations, or reference numbers</li>
                <li>Highlight critical information that impacts decision-making</li>
                <li>Note any dependencies or prerequisites for recommended actions</li>
                <li>Document assumptions or uncertainties where applicable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Final Step Indicator */}
      <div className="bg-blue-600 text-white rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold">Almost Done!</h3>
            <p className="text-sm mt-1 text-blue-100">
              One more step remaining: Disclaimer. After completing the next step, your TrueBuddy Lead 
              pre-report will be ready for review and submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueBuddyStep10Remarks;
