import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { usePreReportDetail } from '../../../hooks/prereport/usePreReportDetail';
import { PreReportDetailsSidebar } from './PreReportDetailsSidebar';
import { getStepTitle } from '../../../utils/helpers';
import { isStepComplete } from '../../../utils/stepValidation';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isError } = usePreReportDetail(reportId!);

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
          <p className="text-red-600 text-lg font-semibold mb-2">Error loading report</p>
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

  // ✅ Check if this is the last step
  const isLastStep = currentStep === totalSteps;

  const handleNext = async (stepData?: any) => {
    console.log('handleNext called', { currentStep, totalSteps, isLastStep, stepData });

    try {
      setIsSubmitting(true);

      // ✅ If it's the last step, submit the entire report
      if (isLastStep) {
        console.log('Submitting final report...');
        
        // TODO: Replace with actual API call
        // await submitPreReport(preReport.id);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert('Pre-report submitted successfully!');
        navigate(`/operations/pre-report/${reportId}`);
      } else {
        // ✅ Otherwise, just move to next step
        console.log('Moving to next step...');
        setCurrentStep((s) => Math.min(totalSteps, s + 1));
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = async () => {
    setCurrentStep((s) => Math.max(1, s - 1));
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
        />
      ) : null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-700 font-medium">
              {isLastStep ? 'Submitting report...' : 'Saving...'}
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{preReport.reportId}</h1>
              <p className="text-gray-600 mt-1">{preReport.clientName}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 font-medium">
                Step {currentStep} of {totalSteps}
              </div>
              <div className="flex items-center gap-2 text-sm">
                {isStepComplete(currentStep, preReport.leadType, clientLeadData, trueBuddyLeadData) ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">Completed</span>
                  </>
                ) : (
                  <span className="text-yellow-600 font-medium">In Progress</span>
                )}
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
                    ? 'Review and submit your pre-report' 
                    : 'Complete this step to proceed to the next'}
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
