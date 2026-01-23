// src/components/operations/pre-report/EditPreReport.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { usePreReportDetail } from '../../../hooks/prereport/usePreReportDetail';
import { useUpdatePreReportStep } from '../../../hooks/prereport/useUpdatePreReportStep';
import { useSubmitPreReport } from '../../../hooks/prereport/useSubmitPreReport';
import { PreReportDetailsSidebar } from './PreReportDetailsSidebar';
import { getStepTitle } from '../../../utils/helpers';
import { toast } from 'sonner';

// Import Client Lead step components
import { Step1BasicInfo as ClientLeadStep1BasicInfo } from './steps/client-lead/Step1BasicInfo';
import { Step2Scope as ClientLeadStep2Scope } from './steps/client-lead/Step2Scope';
import { Step3TargetDetails as ClientLeadStep3TargetDetails } from './steps/client-lead/Step3TargetDetails';
import { Step4Verification as ClientLeadStep4Verification } from './steps/client-lead/Step4Verification';
import { Step5Observations as ClientLeadStep5Observations } from './steps/client-lead/Step5Observations';
import { Step6Quality as ClientLeadStep6Quality } from './steps/client-lead/Step6Quality';
import { Step7Assessment as ClientLeadStep7Assessment } from './steps/client-lead/Step7Assessment';
import { Step8Recommendations as ClientLeadStep8Recommendations } from './steps/client-lead/Step8Recommendations';
import { Step9Remarks as ClientLeadStep9Remarks } from './steps/client-lead/Step9Remarks';
import { Step10Disclaimer as ClientLeadStep10Disclaimer } from './steps/client-lead/Step10Disclaimer';

// Import TrueBuddy Lead step components
import TrueBuddyStep1BasicInfo from './steps/truebuddy-lead/Step1BasicInfo';
import TrueBuddyStep2Scope from './steps/truebuddy-lead/Step2Scope';
import TrueBuddyStep3Intelligence from './steps/truebuddy-lead/Step3Intelligence';
import TrueBuddyStep4Verification from './steps/truebuddy-lead/Step4Verification';
import TrueBuddyStep5Observations from './steps/truebuddy-lead/Step5Observations';
import TrueBuddyStep6Risk from './steps/truebuddy-lead/Step6Risk';
import TrueBuddyStep7Assessment from './steps/truebuddy-lead/Step7Assessment';
import TrueBuddyStep8Recommendations from './steps/truebuddy-lead/Step8Recommendations';
import TrueBuddyStep9Confidentiality from './steps/truebuddy-lead/Step9Confidentiality';
import TrueBuddyStep10Remarks from './steps/truebuddy-lead/Step10Remarks';
import TrueBuddyStep11Disclaimer from './steps/truebuddy-lead/Step11Disclaimer';

export const EditPreReport = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError } = usePreReportDetail(reportId!);
  const updateStepMutation = useUpdatePreReportStep();
  const submitReportMutation = useSubmitPreReport();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-semibold mb-2">Error loading report</p>
          <p className="text-gray-600 mb-4">Unable to fetch report details</p>
          <button
            onClick={() => navigate('/operations/pre-report')}
            className="text-blue-600 hover:underline"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const { preReport, clientLeadData, trueBuddyLeadData } = data;
  const totalSteps = preReport.leadType === 'CLIENT_LEAD' ? 10 : 11;
  const isLastStep = currentStep === totalSteps;

  // ✅ Handle step navigation and data saving
  const handleNext = async (stepData?: any) => {
    console.log('handleNext called', {
      currentStep,
      totalSteps,
      isLastStep,
      stepData,
      hasData: stepData && Object.keys(stepData).length > 0
    });

    setError(null);

    try {
      // ✅ Save step data if provided (not skipped)
      if (stepData && Object.keys(stepData).length > 0) {
        console.log('Saving step data to backend...');

        await updateStepMutation.mutateAsync({
          reportId: reportId!,
          step: currentStep,
          leadType: preReport.leadType,
          data: stepData,
        });

        console.log('Step saved successfully');
        toast.success(`Step ${currentStep} saved successfully`);
      } else {
        console.log('Step skipped - no data to save');
      }

      // ✅ If it's the last step, submit the entire report
      if (isLastStep) {
        console.log('Submitting final report...');

        await submitReportMutation.mutateAsync(reportId!);

        toast.success('Pre-report submitted successfully!');
        navigate(`/operations/pre-report/${reportId}`);
      } else {
        // ✅ Otherwise, move to next step
        console.log('Moving to next step...');
        setCurrentStep((s) => Math.min(totalSteps, s + 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
      console.error('Error in handleNext:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to save. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handlePrevious = async () => {
    setCurrentStep((s) => Math.max(1, s - 1));
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ Handle skip step
  const handleSkip = async () => {
    console.log('Skipping step', currentStep);

    if (isLastStep) {
      toast.warning('Cannot skip the last step', {
        description: 'Please review and submit your pre-report'
      });
      return;
    }

    // Move to next without saving
    setCurrentStep((s) => Math.min(totalSteps, s + 1));
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    toast.info(`Step ${currentStep} skipped`, {
      description: 'You can come back to fill this step later'
    });
  };

  const renderStepContent = () => {
    if (preReport.leadType === 'CLIENT_LEAD') {
      const stepComponents = {
        1: ClientLeadStep1BasicInfo,
        2: ClientLeadStep2Scope,
        3: ClientLeadStep3TargetDetails,
        4: ClientLeadStep4Verification,
        5: ClientLeadStep5Observations,
        6: ClientLeadStep6Quality,
        7: ClientLeadStep7Assessment,
        8: ClientLeadStep8Recommendations,
        9: ClientLeadStep9Remarks,
        10: ClientLeadStep10Disclaimer,
      };
      const StepComponent = stepComponents[currentStep as keyof typeof stepComponents];

      return StepComponent ? (
        <StepComponent
          prereportId={preReport.id}
          reportId={preReport.reportId}
          data={clientLeadData || undefined}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />
      ) : null;
    } else {
      const stepComponents = {
        1: TrueBuddyStep1BasicInfo,
        2: TrueBuddyStep2Scope,
        3: TrueBuddyStep3Intelligence,
        4: TrueBuddyStep4Verification,
        5: TrueBuddyStep5Observations,
        6: TrueBuddyStep6Risk,
        7: TrueBuddyStep7Assessment,
        8: TrueBuddyStep8Recommendations,
        9: TrueBuddyStep9Confidentiality,
        10: TrueBuddyStep10Remarks,
        11: TrueBuddyStep11Disclaimer,
      };
      const StepComponent = stepComponents[currentStep as keyof typeof stepComponents];
      return StepComponent ? (
        <StepComponent
          data={trueBuddyLeadData ?? {}}
          onNext={handleNext}
          onBack={handlePrevious}
          onSkip={handleSkip}
        />
      ) : null;
    }
  };


  const isProcessing = updateStepMutation.isPending || submitReportMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-700 font-medium">
              {submitReportMutation.isPending ? 'Submitting report...' : 'Saving step...'}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/operations/pre-report/${reportId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Details
          </button>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{preReport.reportId}</h1>
              <p className="text-gray-600 mt-1">{preReport.clientName}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 font-medium">
                Step {currentStep} of {totalSteps}
              </div>
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                {preReport.status}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="h-2 bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <PreReportDetailsSidebar
              currentStep={currentStep}
              leadType={preReport.leadType}
              clientName={preReport.clientName}
              productCount={preReport.productIds?.length || 0}
              onStepClick={(step) => setCurrentStep(step)}
            />
          </div>

          {/* Step Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {getStepTitle(preReport.leadType, currentStep)}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {isLastStep
                    ? '⚠️ Review and submit your pre-report'
                    : '✏️ Fill in the details or skip to continue'}
                </p>
              </div>
              <div className="p-6">
                {renderStepContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPreReport;
