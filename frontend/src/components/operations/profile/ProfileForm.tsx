import { useState, useEffect } from 'react';
import { Check, Save, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PersonalInfo from './steps/PersonalInfo';
import AddressInfo from './steps/AddressInfo';
import ContactInfo from './steps/ContactInfo';
import AdditionalInfo from './steps/AdditionalInfo';
import BusinessActivities from './steps/BusinessActivities';
import EntityOrganization from './steps/EntityOrganization';
import GeographicExposure from './steps/GeographicExposure';
import RelatedFIRsCases from './steps/RelatedFIRsCases';
import MaterialSeized from './steps/MaterialSeized';
import Assets from './steps/Assets';
import KnownAssociates from './steps/KnownAssociates';
import KnownEmployees from './steps/KnownEmployees';
import ProductsOperations from './steps/ProductsOperations';
import FamilyBackground from './steps/FamilyBackground';
import InfluentialLinks from './steps/InfluentialLinks';
import CurrentStatus from './steps/CurrentStatus';
import { useFormAutosave } from '../../../hooks/useFormAutosave';
import { useBrowserNavigation } from '../../../hooks/useBrowserNavigation';
import type { 
  CulpritProfile, 
  ProfileData, 
  PersonalInfo as PersonalInfoType,
  AddressInfo as AddressInfoType,
  ContactInfo as ContactInfoType,
  AdditionalInfo as AdditionalInfoType,
  BusinessActivities as BusinessActivitiesType,
  EntityOrganization as EntityOrganizationType,
  GeographicExposure as GeographicExposureType,
  RelatedFIRsCases as RelatedFIRsCasesType,
  Assets as AssetsType,
  ProductsOperations as ProductsOperationsType,
  FamilyBackground as FamilyBackgroundType,
  CurrentStatus as CurrentStatusType
} from './types/profile.types';

// ✅ FIXED: Made props optional
interface Props {
  initialData?: ProfileData;
  onSubmit?: (data: CulpritProfile) => void;
  onCancel?: () => void;
}

const steps = [
  { id: 1, name: 'Personal Info', component: 'personal' },
  { id: 2, name: 'Address', component: 'address' },
  { id: 3, name: 'Contact Info', component: 'contact' },
  { id: 4, name: 'Business Activities', component: 'businessActivities' },
  { id: 5, name: 'Entity & Organization', component: 'entityOrganization' },
  { id: 6, name: 'Geographic Exposure', component: 'geographicExposure' },
  { id: 7, name: 'Related FIRs', component: 'relatedFIRsCases' },
  { id: 8, name: 'Material Seized', component: 'materialSeized' },
  { id: 9, name: 'Assets', component: 'assets' },
  { id: 10, name: 'Known Associates', component: 'knownAssociates' },
  { id: 11, name: 'Known Employees', component: 'knownEmployees' },
  { id: 12, name: 'Products & Operations', component: 'productsOperations' },
  { id: 13, name: 'Family Background', component: 'familyBackground' },
  { id: 14, name: 'Influential Links', component: 'influentialLinks' },
  { id: 15, name: 'Current Status', component: 'currentStatus' },
  { id: 16, name: 'Additional Info', component: 'additional' },
];

const ProfileForm = ({ initialData, onSubmit, onCancel }: Props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileData>(initialData || {});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  // Initialize autosave hook
  const {
    currentStep,
    setCurrentStep,
    autoSave,
    autoSaveIndicator,
    clearFormData,
    hasSavedData,
    getLastSaved,
  } = useFormAutosave({
    formId: 'culprit-profile-form',
    onRestore: (savedData) => {
      // Only show restore prompt if there's saved data and no initial data
      if (!initialData && savedData) {
        setShowRestorePrompt(true);
      }
    },
  });

  // Initialize browser navigation
  const { navigateToStep, clearHistory } = useBrowserNavigation({
    currentStep,
    totalSteps: steps.length,
    onStepChange: setCurrentStep,
    baseUrl: '/operations/profile/create',
  });

  // Auto-save form data whenever it changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      autoSave(formData);
    }
  }, [formData, autoSave]);

  // Check for saved data on mount
  useEffect(() => {
    if (!initialData && hasSavedData()) {
      setShowRestorePrompt(true);
    }
  }, []);

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleNext = (section: string, data: any) => {
    updateFormData(section, data);
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      navigateToStep(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      navigateToStep(prevStep);
    }
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setFormData({});
    clearFormData();
    setCurrentStep(1);
    navigateToStep(1);
    setShowResetConfirm(false);
  };

  const handleRestoreSaved = () => {
    const savedData = hasSavedData();
    if (savedData) {
      // Restore logic handled by useFormAutosave
      setShowRestorePrompt(false);
    }
  };

  const handleDiscardSaved = () => {
    clearFormData();
    setShowRestorePrompt(false);
  };

  // ✅ FIXED: Updated to handle optional onSubmit prop
  const handleFinalSubmit = (data: AdditionalInfoType) => {
    updateFormData('additional', data);
    
    const profile: CulpritProfile = {
      id: initialData?.id || `PROFILE-${Date.now()}`,
      name: `${formData.personal?.firstName || ''} ${formData.personal?.middleName || ''} ${formData.personal?.lastName || ''}`.trim(),
      status: formData.currentStatus?.status || 'Active',
      personal: formData.personal!,
      physical: formData.physical,
      address: formData.address,
      contact: formData.contact,
      identification: formData.identification,
      businessActivities: formData.businessActivities,
      entityOrganization: formData.entityOrganization,
      geographicExposure: formData.geographicExposure,
      relatedFIRsCases: formData.relatedFIRsCases,
      assets: formData.assets,
      associations: formData.associations,
      productsOperations: formData.productsOperations,
      familyBackground: formData.familyBackground,
      currentStatus: formData.currentStatus,
      additional: data,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      createdBy: initialData?.createdBy || 'Current User',
      lastUpdated: new Date().toISOString(),
    };

    // Clear saved data after successful submission
    clearFormData();
    clearHistory();

    // ✅ FIXED: Check if onSubmit exists, otherwise use default behavior
    if (onSubmit && typeof onSubmit === 'function') {
      onSubmit(profile);
    } else {
      // Default behavior: Save to localStorage and navigate
      console.log('Profile created:', profile);
      
      // Save to localStorage
      const existingProfiles = JSON.parse(localStorage.getItem('culprit_profiles') || '[]');
      existingProfiles.push(profile);
      localStorage.setItem('culprit_profiles', JSON.stringify(existingProfiles));
      
      alert('Profile created successfully!');
      navigate('/operations/profile');
    }
  };

  // ✅ FIXED: Updated to handle optional onCancel prop
  const handleCancelClick = () => {
    if (Object.keys(formData).length > 0) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Your progress is auto-saved. Are you sure you want to exit?'
      );
      if (!confirmLeave) return;
    }
    
    clearHistory();
    
    // ✅ FIXED: Check if onCancel exists, otherwise use default behavior
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    } else {
      // Default behavior: Navigate to dashboard
      navigate('/operations/dashboard');
    }
  };

  const renderStep = () => {
    const step = steps[currentStep - 1];

    switch (step.component) {
      case 'personal':
        return (
          <PersonalInfo
            data={formData.personal}
            onNext={(data: PersonalInfoType) => handleNext('personal', data)}
            onBack={currentStep > 1 ? handleBack : undefined}
          />
        );
      case 'address':
        return (
          <AddressInfo
            data={formData.address}
            onNext={(data: AddressInfoType) => handleNext('address', data)}
            onBack={handleBack}
          />
        );
      case 'contact':
        return (
          <ContactInfo
            data={formData.contact}
            onNext={(data: ContactInfoType) => handleNext('contact', data)}
            onBack={handleBack}
          />
        );
      case 'businessActivities':
        return (
          <BusinessActivities
            data={formData.businessActivities}
            onNext={(data: BusinessActivitiesType) => handleNext('businessActivities', data)}
            onBack={handleBack}
          />
        );
      case 'entityOrganization':
        return (
          <EntityOrganization
            data={formData.entityOrganization}
            onNext={(data: EntityOrganizationType) => handleNext('entityOrganization', data)}
            onBack={handleBack}
          />
        );
      case 'geographicExposure':
        return (
          <GeographicExposure
            data={formData.geographicExposure}
            onNext={(data: GeographicExposureType) => handleNext('geographicExposure', data)}
            onBack={handleBack}
          />
        );
      case 'relatedFIRsCases':
        return (
          <RelatedFIRsCases
            data={formData.relatedFIRsCases}
            onNext={(data: RelatedFIRsCasesType) => handleNext('relatedFIRsCases', data)}
            onBack={handleBack}
          />
        );
      case 'materialSeized':
        return (
          <MaterialSeized
            data={{ materialSeized: formData.relatedFIRsCases?.materialSeized }}
            onNext={(data) => handleNext('relatedFIRsCases', { ...formData.relatedFIRsCases, materialSeized: data.materialSeized })}
            onBack={handleBack}
          />
        );
      case 'assets':
        return (
          <Assets
            data={formData.assets}
            onNext={(data: AssetsType) => handleNext('assets', data)}
            onBack={handleBack}
          />
        );
      case 'knownAssociates':
        return (
          <KnownAssociates
            data={{ knownAssociates: formData.associations?.knownAssociates }}
            onNext={(data) => handleNext('associations', { ...formData.associations, knownAssociates: data.knownAssociates })}
            onBack={handleBack}
          />
        );
      case 'knownEmployees':
        return (
          <KnownEmployees
            data={{ knownEmployees: formData.associations?.knownEmployees }}
            onNext={(data) => handleNext('associations', { ...formData.associations, knownEmployees: data.knownEmployees })}
            onBack={handleBack}
          />
        );
      case 'productsOperations':
        return (
          <ProductsOperations
            data={formData.productsOperations}
            onNext={(data: ProductsOperationsType) => handleNext('productsOperations', data)}
            onBack={handleBack}
          />
        );
      case 'familyBackground':
        return (
          <FamilyBackground
            data={formData.familyBackground}
            onNext={(data: FamilyBackgroundType) => handleNext('familyBackground', data)}
            onBack={handleBack}
          />
        );
      case 'influentialLinks':
        return (
          <InfluentialLinks
            data={{ influentialLinks: formData.associations?.influentialLinks }}
            onNext={(data) => handleNext('associations', { ...formData.associations, influentialLinks: data.influentialLinks })}
            onBack={handleBack}
          />
        );
      case 'currentStatus':
        return (
          <CurrentStatus
            data={formData.currentStatus}
            onNext={(data: CurrentStatusType) => handleNext('currentStatus', data)}
            onBack={handleBack}
          />
        );
      case 'additional':
        return (
          <AdditionalInfo
            data={formData.additional}
            onNext={handleFinalSubmit}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  const formatLastSaved = () => {
    const lastSaved = getLastSaved();
    if (!lastSaved) return null;
    
    const date = new Date(lastSaved);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header with Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {initialData?.id ? 'Edit Profile' : 'Create New Profile'}
              </h1>
              <p className="text-gray-600">Complete all steps to create a comprehensive profile</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Autosave Indicator */}
              {autoSaveIndicator && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm animate-fade-in">
                  <CheckCircle className="w-4 h-4" />
                  <span>Saved</span>
                </div>
              )}
              
              {/* Last Saved Time */}
              {getLastSaved() && !autoSaveIndicator && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm">
                  <Save className="w-4 h-4" />
                  <span className="text-xs">Last saved: {formatLastSaved()}</span>
                </div>
              )}

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                title="Reset Form"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Auto-save Info */}
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-blue-50 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 text-blue-500" />
            <span>Your progress is automatically saved as you go. You can safely close and return later.</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
            <span className="text-sm text-gray-600">Step {currentStep} of {steps.length}</span>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${(currentStep / steps.length) * 100}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-300" 
              />
            </div>
          </div>

          {/* Step Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                  step.id === currentStep 
                    ? 'bg-blue-100 text-blue-700 font-semibold' 
                    : step.id < currentStep 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => {
                  setCurrentStep(step.id);
                  navigateToStep(step.id);
                }}
              >
                {step.id < currentStep ? (
                  <Check className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">{step.id}</span>
                )}
                <span className="truncate">{step.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div>{renderStep()}</div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button 
            onClick={handleCancelClick}
            className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel and Exit
          </button>
        </div>
      </div>

      {/* Restore Saved Data Modal */}
      {showRestorePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Save className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Restore Previous Session?
                </h3>
                <p className="text-sm text-gray-600">
                  We found a previously saved draft from {formatLastSaved()}. Would you like to continue where you left off?
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDiscardSaved}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Start Fresh
              </button>
              <button
                onClick={handleRestoreSaved}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Restore Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Reset Form?
                </h3>
                <p className="text-sm text-gray-600">
                  This will clear all your progress and start over from the beginning. This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
