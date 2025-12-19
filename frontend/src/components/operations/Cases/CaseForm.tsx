import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, RotateCcw } from 'lucide-react';
import BasicInfo from './steps/BasicInfo';
import ClientDetailsStep from './steps/ClientDetails';
import TeamAssignment from './steps/TeamAssignment';
import type { CaseData } from './types/case.types';
import { useBrowserNavigation } from '../../../hooks/useBrowserNavigation';

interface CaseFormProps {
  onComplete: (data: CaseData) => void;
  initialData?: CaseData | null;
}

const CaseForm = ({ onComplete, initialData }: CaseFormProps) => {
  const [formData, setFormData] = useState({
    basicInfo: initialData?.basicInfo || null,
    clientDetails: initialData?.clientDetails || null,
    investigation: initialData?.investigation || null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false);

  const steps = [
    { id: 1, name: 'Basic Info', key: 'basicInfo', component: BasicInfo },
    { id: 2, name: 'Client Details', key: 'clientDetails', component: ClientDetailsStep },
    { id: 3, name: 'Team Assignment', key: 'investigation', component: TeamAssignment },
  ];

  // Use browser navigation hook
  const { navigateToStep, clearHistory } = useBrowserNavigation({
    currentStep,
    totalSteps: steps.length,
    onStepChange: setCurrentStep,
  });

  // Auto-save to localStorage
  const formDataRef = useRef(formData);
  
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    const savedData = localStorage.getItem('case-form-draft');
    if (savedData && !initialData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (e) {
        console.error('Failed to parse saved form data');
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.basicInfo || formData.clientDetails || formData.investigation) {
      localStorage.setItem('case-form-draft', JSON.stringify(formData));
      setAutoSaveIndicator(true);
      const timer = setTimeout(() => setAutoSaveIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [formData]);

  const handleStepComplete = (stepKey: string, data: any) => {
    setFormData(prev => ({ ...prev, [stepKey]: data }));
    if (currentStep < 3) {
      navigateToStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      navigateToStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3 && isStepComplete(currentStep)) {
      navigateToStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    if (!formData.basicInfo || !formData.clientDetails || !formData.investigation) {
      alert('Please complete all steps before submitting');
      return;
    }

    const caseData: CaseData = {
      id: initialData?.id || `CASE-${Date.now()}`,
      basicInfo: formData.basicInfo,
      clientDetails: formData.clientDetails,
      investigation: formData.investigation,
      documents: initialData?.documents || [],
      updates: initialData?.updates || [],
      createdAt: initialData?.createdAt || new Date().toISOString(),
      createdBy: initialData?.createdBy || 'Current User',
      lastUpdated: new Date().toISOString(),
    };

    localStorage.removeItem('case-form-draft');
    clearHistory();
    onComplete(caseData);
  };

  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
      localStorage.removeItem('case-form-draft');
      setFormData({
        basicInfo: null,
        clientDetails: null,
        investigation: null,
      });
      navigateToStep(1);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;
  const currentStepKey = steps[currentStep - 1].key;

  const isStepComplete = (stepId: number) => {
    const stepKey = steps[stepId - 1].key;
    return formData[stepKey as keyof typeof formData] !== null;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Auto-save Indicator */}
      {autoSaveIndicator && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Auto-saved</span>
        </div>
      )}

      {/* Progress Stepper */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Case Creation Progress</h3>
          <button
            type="button"
            onClick={handleClearForm}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <button
                  type="button"
                  onClick={() => (isStepComplete(step.id - 1) || currentStep >= step.id) ? navigateToStep(step.id) : null}
                  disabled={step.id > 1 && !isStepComplete(step.id - 1) && currentStep < step.id}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep === step.id
                      ? 'bg-blue-600 text-white shadow-lg scale-110'
                      : isStepComplete(step.id)
                      ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                      : 'bg-gray-200 text-gray-600'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {isStepComplete(step.id) && currentStep !== step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step.id
                  )}
                </button>
                <span className={`text-xs mt-2 text-center font-medium ${
                  currentStep === step.id ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 transition-all ${
                  isStepComplete(step.id) ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Form */}
      <div className="bg-white rounded-lg shadow-sm border">
        <CurrentStepComponent
          initialData={formData[currentStepKey as keyof typeof formData] as any}
          onComplete={(data: any) => {
            handleStepComplete(currentStepKey, data);
            if (currentStep === 3) {
              handleSubmit();
            }
          }}
          onBack={handlePreviousStep}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === 3}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Previous Step
        </button>
        
        {currentStep < 3 && (
          <button
            type="button"
            onClick={handleNextStep}
            disabled={!isStepComplete(currentStep)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
          >
            Next Step <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💾 <strong>Auto-save enabled:</strong> Your progress is automatically saved. You can safely use browser back/forward buttons to navigate between steps.
        </p>
      </div>
    </div>
  );
};

export default CaseForm;
