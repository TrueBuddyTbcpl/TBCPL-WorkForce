// src/components/operations/pre-report/steps/truebuddy-lead/Step11Disclaimer.tsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  TrueBuddyLeadStep11Input,
} from '../../../../../schemas/prereport.schemas';
import { trueBuddyLeadStep11Schema } from '../../../../../schemas/prereport.schemas';
import type { TrueBuddyLeadData } from '../../../../../types/prereport.types';

interface Step11Props {
  data: TrueBuddyLeadData;
  onNext: (data: Partial<TrueBuddyLeadData>) => Promise<void>;
  onBack: () => void;
  onSkip: () => void;
}

const TrueBuddyStep11Disclaimer: React.FC<Step11Props> = ({ data, onNext, onBack, onSkip, }) => {
  const [useDefaultDisclaimer, setUseDefaultDisclaimer] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TrueBuddyLeadStep11Input>({
    resolver: zodResolver(trueBuddyLeadStep11Schema),
    defaultValues: {
      customDisclaimer: data.customDisclaimer || '',
    },
  });

  const onSubmit = async (formData: TrueBuddyLeadStep11Input) => {
    try {
      await onNext(formData);
    } catch (error) {
      console.error('Error submitting Step 11:', error);
    }
  };

  const customDisclaimer = watch('customDisclaimer');
  const charCount = customDisclaimer?.length || 0;

  const defaultDisclaimerText = `DISCLAIMER

This Pre-Report is based on intelligence received through TrueBuddy internal channels and is intended solely for internal assessment and strategic planning purposes. The information contained herein is classified as HIGHLY CONFIDENTIAL and is subject to the following terms:

1. INTELLIGENCE NATURE
   This report is based on unverified or partially verified intelligence that requires controlled validation before any operational actions are undertaken.

2. CONFIDENTIALITY
   All information contained in this report is strictly confidential and proprietary. Unauthorized disclosure, distribution, or use of this information is prohibited and may result in legal action.

3. LIMITATION OF LIABILITY
   The assessments, observations, and recommendations provided in this report are based on available intelligence at the time of preparation. The Company makes no warranties regarding the accuracy, completeness, or reliability of the information provided.

4. NO GUARANTEE
   This report does not guarantee any specific outcome or result. Any actions taken based on this report are at the sole discretion and risk of the authorized parties.

5. SOURCE PROTECTION
   Source identities and methodologies are protected and shall not be disclosed to any external parties, including clients, without explicit written authorization from senior management.

6. OPERATIONAL SECURITY
   All stakeholders handling this report must adhere to established operational security protocols. Failure to maintain confidentiality may compromise ongoing and future operations.

7. INTERNAL USE ONLY
   This report is for internal use only and shall not be shared with clients, external agencies, or unauthorized personnel without proper approval through the designated chain of command.

Date: ${new Date().toLocaleDateString('en-IN')}
Classification: HIGHLY CONFIDENTIAL - TRUEBUDDY LEAD
Distribution: RESTRICTED`;

  const handleUseDefault = () => {
    setValue('customDisclaimer', defaultDisclaimerText);
    setUseDefaultDisclaimer(true);
  };

  const handleCustomize = () => {
    setUseDefaultDisclaimer(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Step 11: Disclaimer
            </h2>
            <p className="text-gray-600 mt-2">
              Add a disclaimer to define the scope, limitations, and confidentiality requirements of this pre-report.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Final Step
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-blue-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleUseDefault}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Use Default Disclaimer
              </button>
              <button
                type="button"
                onClick={handleCustomize}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Write Custom Disclaimer
              </button>
            </div>
          </div>

          {/* Disclaimer Textarea */}
          <div className="border border-gray-200 rounded-lg p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Disclaimer Text *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              {useDefaultDisclaimer
                ? 'Default disclaimer loaded. You can edit it as needed.'
                : 'Enter a custom disclaimer or use the default template above.'}
            </p>
            <Controller
              name="customDisclaimer"
              control={control}
              render={({ field }) => (
                <div>
                  <textarea
                    {...field}
                    rows={16}
                    placeholder="Enter disclaimer text here...

Your disclaimer should cover:
• Report purpose and scope
• Confidentiality requirements
• Limitations and liability
• Source protection measures
• Distribution restrictions
• Operational security requirements"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm ${errors.customDisclaimer ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {errors.customDisclaimer && (
                        <p className="text-sm text-red-600">{errors.customDisclaimer.message}</p>
                      )}
                    </div>
                    <p className={`text-xs font-medium ${charCount < 20
                        ? 'text-red-600'
                        : charCount < 100
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}>
                      {charCount} characters (minimum 20 required)
                    </p>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Preview */}
          {charCount >= 20 && (
            <div className="border-2 border-purple-300 bg-purple-50 rounded-lg p-5">
              <h4 className="text-sm font-semibold text-purple-900 mb-3 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Disclaimer Preview
              </h4>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">
                  {customDisclaimer}
                </pre>
              </div>
            </div>
          )}

          {/* Completion Message */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-green-900 mb-2">
                  Ready to Complete
                </h4>
                <p className="text-sm text-green-800">
                  This is the final step of the TrueBuddy Lead pre-report. Once you submit this form,
                  your complete pre-report will be saved and ready for review. You can edit it later if needed.
                </p>
              </div>
            </div>
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
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Complete Pre-Report
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Final Info Box */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-lg p-5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">What Happens Next?</h3>
            <ul className="text-sm space-y-2 text-indigo-100">
              <li className="flex items-start gap-2">
                <span className="text-yellow-300">1.</span>
                <span>Your pre-report will be saved and marked as complete</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300">2.</span>
                <span>It will be available for review by authorized personnel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300">3.</span>
                <span>You can edit the report if needed before final submission</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300">4.</span>
                <span>Based on your assessment, appropriate actions will be initiated</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueBuddyStep11Disclaimer;
