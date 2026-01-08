import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, RotateCcw } from 'lucide-react';
import BasicInfo from './steps/BasicInfo';
import TeamAssignment from './steps/TeamAssignment';
import type { BasicInfoFormData, InvestigationFormData } from './utils/caseValidation';
import type { Case } from '../dashboard/types/dashboard.types';
import { useBrowserNavigation } from '../../../hooks/useBrowserNavigation';

interface FormDataState {
  basicInfo: BasicInfoFormData | null;
  investigation: InvestigationFormData | null;
}

interface CaseFormProps {
  onComplete?: (data: any) => void;
  initialData?: Case | null;
}

const CaseForm = ({ onComplete, initialData }: CaseFormProps) => {
  // ✅ Convert initialData from Case to FormDataState
  const convertCaseToFormData = (caseData: Case | null): FormDataState => {
    if (!caseData) {
      return {
        basicInfo: null,
        investigation: null,
      };
    }

    return {
      basicInfo: {
        caseType: 'investigation',  // ✅ Now matches type
        caseNumber: caseData.caseNumber,
        caseTitle: caseData.title,
        clientName: caseData.client.name,
        clientProduct: caseData.client.productName,
        clientLogo: caseData.client.logo,  // ✅ Now matches type
        priority: caseData.priority as 'low' | 'medium' | 'high' | 'critical',
        status: caseData.status as 'open' | 'in-progress' | 'on-hold' | 'closed',
        description: caseData.description,
        dateOpened: caseData.createdDate,
        dateClosed: caseData.status === 'closed' ? caseData.lastUpdated : undefined,
      },
      investigation: {
        leadType: 'Client Lead',
        assignedEmployees: [caseData.assignedTo.id],
        assignedEmployeesDetails: [{  // ✅ Now matches type
          id: caseData.assignedTo.id,
          name: caseData.assignedTo.name,
          email: caseData.assignedTo.email,
          phone: caseData.assignedTo.phone,
          role: caseData.assignedTo.role,
        }],
        linkedCulprits: [],
      },
    };
  };

  const [formData, setFormData] = useState<FormDataState>(() => {
    if (initialData) {
      return convertCaseToFormData(initialData);
    }

    const savedData = localStorage.getItem('case-form-draft');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Failed to parse saved form data');
      }
    }

    return {
      basicInfo: null,
      investigation: null,
    };
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false);

  const steps = [
    { id: 1, name: 'Basic Information', key: 'basicInfo', component: BasicInfo },
    { id: 2, name: 'Team Assignment', key: 'investigation', component: TeamAssignment },
  ] as const;

  const { navigateToStep, clearHistory } = useBrowserNavigation({
    currentStep,
    totalSteps: steps.length,
    onStepChange: setCurrentStep,
  });

  const formDataRef = useRef(formData);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    if (initialData) {
      const converted = convertCaseToFormData(initialData);
      setFormData(converted);
    }
  }, [initialData]);

  useEffect(() => {
    if ((formData.basicInfo || formData.investigation) && !initialData) {
      localStorage.setItem('case-form-draft', JSON.stringify(formData));
      setAutoSaveIndicator(true);
      const timer = setTimeout(() => setAutoSaveIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [formData, initialData]);

  const handleStepComplete = (stepKey: string, data: any) => {
    setFormData(prev => ({ ...prev, [stepKey]: data }));

    if (currentStep === steps.length) {
      handleSubmit({ ...formData, [stepKey]: data });
    } else {
      navigateToStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      navigateToStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length && isStepComplete(currentStep)) {
      navigateToStep(currentStep + 1);
    }
  };

  const handleSubmit = (finalData?: FormDataState) => {
    const dataToSubmit = finalData || formData;

    if (!dataToSubmit.basicInfo || !dataToSubmit.investigation) {
      alert('Please complete all steps before submitting');
      return;
    }

    // ✅ Fix: Add department and joinDate to match Employee type
    const caseData: Case = {
      id: initialData?.id || `CASE-${Date.now()}`,
      caseNumber: dataToSubmit.basicInfo.caseNumber,
      title: dataToSubmit.basicInfo.caseTitle,
      description: dataToSubmit.basicInfo.description || '',
      status: dataToSubmit.basicInfo.status,
      priority: dataToSubmit.basicInfo.priority,
      client: {
        id: initialData?.client.id || `CLIENT-${Date.now()}`,
        name: dataToSubmit.basicInfo.clientName,
        productName: dataToSubmit.basicInfo.clientProduct,
        logo: dataToSubmit.basicInfo.clientLogo || '',
      },
      assignedTo: dataToSubmit.investigation.assignedEmployeesDetails?.[0]
        ? {
          ...dataToSubmit.investigation.assignedEmployeesDetails[0],
          department: initialData?.assignedTo.department || 'Investigation',  // ✅ Added
          joinDate: initialData?.assignedTo.joinDate || new Date().toISOString(),  // ✅ Added
        }
        : {
          id: dataToSubmit.investigation.assignedEmployees[0] || 'EMP-001',
          name: 'Unknown Employee',
          email: 'unknown@example.com',
          phone: 'N/A',
          role: 'Investigator',
          department: 'Investigation',  // ✅ Added
          joinDate: new Date().toISOString(),  // ✅ Added
        },
      profilesLinked: initialData?.profilesLinked || 0,
      reportsGenerated: initialData?.reportsGenerated || 0,
      createdDate: initialData?.createdDate || dataToSubmit.basicInfo.dateOpened,
      lastUpdated: new Date().toISOString(),
    };

    const existingCases = JSON.parse(localStorage.getItem('dashboard_cases') || '[]');

    if (initialData) {
      const updatedCases = existingCases.map((c: Case) =>
        c.id === initialData.id ? caseData : c
      );
      localStorage.setItem('dashboard_cases', JSON.stringify(updatedCases));
      console.log('Case updated successfully:', caseData);
      alert('Case updated successfully!');
    } else {
      const newCases = [...existingCases, caseData];
      localStorage.setItem('dashboard_cases', JSON.stringify(newCases));
      console.log('Case created successfully:', caseData);
      alert('Case created successfully!');
    }

    localStorage.removeItem('case-form-draft');
    clearHistory();

    if (onComplete) {
      onComplete(caseData);
    } else {
      setFormData({
        basicInfo: null,
        investigation: null,
      });
      navigateToStep(1);
    }
  };


  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
      localStorage.removeItem('case-form-draft');
      setFormData({
        basicInfo: null,
        investigation: null,
      });
      navigateToStep(1);
    }
  };

  const isStepComplete = (stepId: number) => {
    const stepKey = steps[stepId - 1].key as keyof FormDataState;
    return formData[stepKey] !== null;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {autoSaveIndicator && !initialData && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Auto-saved</span>
        </div>
      )}

      {initialData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium text-blue-900">
              Editing Case: <span className="font-mono">{initialData.caseNumber}</span> - {initialData.title}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">
            {initialData ? 'Edit Case' : 'Case Creation Progress'}
          </h3>
          {!initialData && (
            <button
              type="button"
              onClick={handleClearForm}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Clear All
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <button
                  type="button"
                  onClick={() => {
                    if (isStepComplete(step.id) || currentStep >= step.id) {
                      navigateToStep(step.id);
                    }
                  }}
                  disabled={step.id > 1 && !isStepComplete(step.id - 1) && currentStep < step.id}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep === step.id
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
                <span className={`text-xs mt-2 text-center font-medium ${currentStep === step.id ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 transition-all ${isStepComplete(step.id) ? 'bg-green-500' : 'bg-gray-300'
                  }`} style={{ marginBottom: '2.5rem' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {currentStep === 1 && (
          <BasicInfo
            initialData={formData.basicInfo}
            onComplete={(data) => handleStepComplete('basicInfo', data)}
            onBack={handlePreviousStep}
            isFirstStep={true}
            isLastStep={false}
          />
        )}
        {currentStep === 2 && (
          <TeamAssignment
            initialData={formData.investigation}
            onComplete={(data) => handleStepComplete('investigation', data)}
            onBack={handlePreviousStep}
            isFirstStep={false}
            isLastStep={true}
          />
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Previous Step
        </button>

        {currentStep < steps.length && (
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

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💾 <strong>{initialData ? 'Edit Mode:' : 'Auto-save enabled:'}</strong>
          {initialData
            ? ' Changes will be saved when you complete the form.'
            : ' Your progress is automatically saved. You can safely use browser back/forward buttons to navigate between steps.'}
        </p>
      </div>
    </div>
  );
};

export default CaseForm;
