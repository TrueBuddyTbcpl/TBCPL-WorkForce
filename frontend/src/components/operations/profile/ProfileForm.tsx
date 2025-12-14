import { useState } from 'react';
import { ChevronLeft, ChevronRight, Save, CheckCircle } from 'lucide-react';
import PersonalInfoStep from './steps/PersonalInfo';
import PhysicalAttributesStep from './steps/PhysicalAttributes';
import AddressInfoStep from './steps/AddressInfo';
import ContactInfoStep from './steps/ContactInfo';
import IdentificationDocsStep from './steps/IdentificationDocs';
import AdditionalInfoStep from './steps/AdditionalInfo';
import type { CulpritProfile } from './types/profile.types';

interface ProfileFormProps {
  onComplete: (data: CulpritProfile) => void;
  initialData?: CulpritProfile | null;
}

const ProfileForm = ({ onComplete, initialData }: ProfileFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personal: initialData?.personal || null,
    physical: initialData?.physical || null,
    address: initialData?.address || null,
    contact: initialData?.contact || null,
    identification: initialData?.identification || null,
    additional: initialData?.additional || null,
  });

  const steps = [
    { id: 1, name: 'Personal Info', key: 'personal', component: PersonalInfoStep },
    { id: 2, name: 'Physical Attributes', key: 'physical', component: PhysicalAttributesStep },
    { id: 3, name: 'Address', key: 'address', component: AddressInfoStep },
    { id: 4, name: 'Contact Info', key: 'contact', component: ContactInfoStep },
    { id: 5, name: 'Identification', key: 'identification', component: IdentificationDocsStep },
    { id: 6, name: 'Additional Info', key: 'additional', component: AdditionalInfoStep },
  ];

  const handleStepComplete = (stepKey: string, data: any) => {
    setFormData(prev => ({ ...prev, [stepKey]: data }));
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    const profile: CulpritProfile = {
      id: initialData?.id || `PROF-${Date.now()}`,
      personal: formData.personal!,
      physical: formData.physical!,
      address: formData.address!,
      contact: formData.contact!,
      identification: formData.identification!,
      additional: formData.additional!,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      createdBy: initialData?.createdBy || 'Admin User',
      lastUpdated: new Date().toISOString(),
      status: 'Active',
    };
    onComplete(profile);
  };

  const CurrentStepComponent = steps[currentStep - 1].component;
  const currentStepKey = steps[currentStep - 1].key;

  const isStepComplete = (stepId: number) => {
    const stepKey = steps[stepId - 1].key;
    return formData[stepKey as keyof typeof formData] !== null;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Progress Stepper */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <button
                  type="button"
                  onClick={() => isStepComplete(step.id - 1) || currentStep >= step.id ? setCurrentStep(step.id) : null}
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
          onBack={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === 6}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Previous Step
        </button>
        
        {currentStep === 6 && formData.additional ? (
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
            onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))}
            disabled={!isStepComplete(currentStep)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
          >
            Next Step <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
