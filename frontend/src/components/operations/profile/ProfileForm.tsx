import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Save, CheckCircle, RotateCcw, Clock, Trash2 } from 'lucide-react';
import PersonalInfoStep from './steps/PersonalInfo';
import AddressInfoStep from './steps/AddressInfo';
import ContactInfoStep from './steps/ContactInfo';
import AdditionalInfoStep from './steps/AdditionalInfo';
import type { CulpritProfile } from './types/profile.types';
import { useFormAutosave } from '../../../hooks/useFormAutosave';
import { useBrowserNavigation } from '../../../hooks/useBrowserNavigation';

interface ProfileFormProps {
  onComplete: (data: CulpritProfile) => void;
  initialData?: CulpritProfile | null;
}

const ProfileForm = ({ onComplete, initialData }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    personal: initialData?.personal || null,
    address: initialData?.address || null,
    contact: initialData?.contact || null,
    additional: initialData?.additional || null,
  });

  // ✅ Memoize the restore callback
  const handleRestore = useCallback((savedData: any) => {
    if (!initialData) {
      setFormData(savedData);
    }
  }, [initialData]);

  // Use autosave hook
  const {
    currentStep,
    setCurrentStep,
    autoSave,
    autoSaveIndicator,
    clearFormData,
    getLastSaved,
  } = useFormAutosave({
    formId: 'culprit-profile',
    debounceMs: 1000,
    onRestore: handleRestore,
  });

  const steps = [
    { id: 1, name: 'Personal Info', key: 'personal', component: PersonalInfoStep },
    { id: 2, name: 'Address', key: 'address', component: AddressInfoStep },
    { id: 3, name: 'Contact Info', key: 'contact', component: ContactInfoStep },
    { id: 4, name: 'Additional Info', key: 'additional', component: AdditionalInfoStep },
  ];

  // Use browser navigation hook
  const { navigateToStep, clearHistory } = useBrowserNavigation({
    currentStep,
    totalSteps: steps.length,
    onStepChange: setCurrentStep,
  });

  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  // ✅ Autosave with useRef to prevent dependency issues
  const formDataRef = useRef(formData);
  
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    const data = formDataRef.current;
    if (data.personal || data.address || data.contact || data.additional) {
      autoSave(data);
    }
  }, [formData, autoSave]);

  // Update last saved time
  useEffect(() => {
    const updateLastSaved = () => {
      const lastSaved = getLastSaved();
      setLastSavedTime(lastSaved);
    };

    updateLastSaved();
    const interval = setInterval(updateLastSaved, 60000);
    return () => clearInterval(interval);
  }, [getLastSaved, autoSaveIndicator]);

  const handleStepComplete = (stepKey: string, data: any) => {
    setFormData(prev => ({ ...prev, [stepKey]: data }));
    if (currentStep < 4) {
      navigateToStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      navigateToStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4 && isStepComplete(currentStep)) {
      navigateToStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    // Validate linkedCases before submission
    

    const profile: CulpritProfile = {
      id: initialData?.id || `PROF-${Date.now()}`,
      personal: formData.personal!,
      address: formData.address!,
      contact: formData.contact!,
      additional: formData.additional!,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      createdBy: initialData?.createdBy || 'Admin User',
      lastUpdated: new Date().toISOString(),
      status: 'Active',
    };
    
    clearFormData();
    clearHistory();
    onComplete(profile);
  };

  const handleClearAllForm = () => {
    if (window.confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
      clearFormData();
      setFormData({
        personal: null,
        address: null,
        contact: null,
        additional: null,
      });
      navigateToStep(1);
    }
  };

  const handleResetCurrentStep = () => {
    const currentStepKey = steps[currentStep - 1].key;
    
    if (window.confirm(`Are you sure you want to reset the ${steps[currentStep - 1].name}? All data in this step will be cleared.`)) {
      setFormData(prev => ({ ...prev, [currentStepKey]: null }));
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;
  const currentStepKey = steps[currentStep - 1].key;

  const isStepComplete = (stepId: number) => {
    const stepKey = steps[stepId - 1].key;
    const data = formData[stepKey as keyof typeof formData];
    
    // Special validation for additional info - linkedCases must be present
    if (stepKey === 'additional' && data) {
      return (data as any).linkedCases && (data as any).linkedCases.length > 0;
    }
    
    return data !== null;
  };

  const getRelativeTime = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleString();
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Autosave Indicator */}
      {autoSaveIndicator && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Auto-saved</span>
        </div>
      )}

      {/* Progress Stepper */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Form Progress</h3>
          <div className="flex gap-2">
            {/* Reset Current Step Button */}
            {isStepComplete(currentStep) && (
              <button
                type="button"
                onClick={handleResetCurrentStep}
                className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 px-3 py-1 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Reset This Step
              </button>
            )}
            
            {/* Clear All Form Button */}
            <button
              type="button"
              onClick={handleClearAllForm}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Clear All
            </button>
          </div>
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
          onComplete={(data: any) => handleStepComplete(currentStepKey, data)}
          onBack={handlePreviousStep}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === 4}
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
        
        {currentStep === 4 && formData.additional ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-lg transition-all hover:shadow-xl"
          >
            <Save className="w-5 h-5" /> Complete Profile
          </button>
        ) : (
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
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-blue-800">
              💾 <strong>Auto-save enabled:</strong> Your progress is automatically saved. You can safely use browser back/forward buttons to navigate between form steps.
            </p>
          </div>
          {lastSavedTime && (
            <div className="flex items-center gap-1 text-xs text-blue-700 ml-4 whitespace-nowrap">
              <Clock className="w-3 h-3" />
              <span>Saved {getRelativeTime(lastSavedTime)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
