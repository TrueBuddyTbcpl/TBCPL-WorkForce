import { useState, useRef } from 'react';
import { Check, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import PersonalInfo from './steps/PersonalInfo';
import AddressInfo from './steps/AddressInfo';
import ContactInfo from './steps/ContactInfo';
import IdentificationDocs from './steps/IdentificationDocs';
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
import AdditionalInfo from './steps/AdditionalInfo';

import {
  initProfile,
  saveAddress,
  saveContactInfo,
  saveIdentificationDocs,
  saveBusinessActivities,
  saveEntityOrganization,
  saveGeographicExposure,
  saveRelatedFIRs,
  saveMaterialSeized,
  saveAssets,
  saveKnownAssociates,
  saveKnownEmployees,
  saveProductsOperations,
  saveFamilyBackground,
  saveInfluentialLinks,
  saveCurrentStatus,
  saveAdditionalInfo,
  type ApiProfileDetail,
} from '../../../services/api/profileApi';

import {
  mapToPersonalInfo,
  mapToAddress,
  mapToContactInfo,
  mapToIdentificationDocs,
  mapToBusinessActivities,
  mapToEntityOrganization,
  mapToGeographicExposure,
  mapToRelatedFIRs,
  mapToMaterialSeized,
  mapToAssets,
  mapToKnownAssociates,
  mapToKnownEmployees,
  mapToProductsOperations,
  mapToFamilyBackground,
  mapToInfluentialLinks,
  mapToCurrentStatus,
  mapToAdditionalInfo,
} from './utils/profileMapper';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  initialData?: ApiProfileDetail;
  onSaved?: (profile: ApiProfileDetail) => void;
  onCancel?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// STEPS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const steps = [
  { id: 1, name: 'Personal Info', component: 'personal' },
  { id: 2, name: 'Address', component: 'address' },
  { id: 3, name: 'Contact Info', component: 'contact' },
  { id: 4, name: 'ID Docume...', component: 'identification' },
  { id: 5, name: 'Business Ac...', component: 'businessActivities' },
  { id: 6, name: 'Entity & Org', component: 'entityOrganization' },
  { id: 7, name: 'Geographic ...', component: 'geographicExposure' },
  { id: 8, name: 'Related FIRs', component: 'relatedFIRsCases' },
  { id: 9, name: 'Material Se...', component: 'materialSeized' },
  { id: 10, name: 'Assets', component: 'assets' },
  { id: 11, name: 'Known Ass...', component: 'knownAssociates' },
  { id: 12, name: 'Known Em...', component: 'knownEmployees' },
  { id: 13, name: 'Products &...', component: 'productsOperations' },
  { id: 14, name: 'Family Bac...', component: 'familyBackground' },
  { id: 15, name: 'Influential ...', component: 'influentialLinks' },
  { id: 16, name: 'Current Sta...', component: 'currentStatus' },
  { id: 17, name: 'Additional ...', component: 'additional' },
];

// Steps where empty submission is allowed — just advance without saving
const ALWAYS_OPTIONAL_STEPS = new Set([
  'entityOrganization',
  'geographicExposure',
  'relatedFIRsCases',
  'materialSeized',
  'assets',
  'knownAssociates',
  'knownEmployees',
  'influentialLinks',
  'additional',
]);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const hasValue = (val: any): boolean => {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string') return val.trim() !== '';
  if (typeof val === 'boolean') return true;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'object') return Object.values(val).some(hasValue);
  return true;
};

const isStepDataEmpty = (stepComponent: string, data: any): boolean => {
  // Step 1 always runs — creates the profile
  if (stepComponent === 'personal') return false;
  // Always optional steps — never block
  if (ALWAYS_OPTIONAL_STEPS.has(stepComponent)) return false;
  // For all others — check if any real data exists
  if (!data) return true;
  return !hasValue(data);
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const ProfileForm = ({ initialData, onSaved, onCancel }: Props) => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(initialData?.id ?? null);
  const profileIdRef = useRef<number | null>(initialData?.id ?? null);

  // Track which steps have been completed (have real saved data)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(() => {
    if (initialData?.stepStatuses) {
      const completed = new Set<number>();
      initialData.stepStatuses?.forEach(s => {
        if (s.status === 'COMPLETED' || s.status === 'HALF_FILLED') {
          completed.add(s.stepNumber);
        }
      });
      return completed;
    }
    return new Set<number>();
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  const showSaved = () => {
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 2000);
  };

  const advanceStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(s => s + 1);
    }
  };

  // ── Main Step Handler ─────────────────────────────────────────────────────

  const handleStep = async (stepComponent: string, data: any) => {
    const id = profileIdRef.current;

    // If data is empty for optional/semi-optional steps — skip save, just advance
    if (stepComponent !== 'personal' && isStepDataEmpty(stepComponent, data)) {
      advanceStep();
      return;
    }

    setSaving(true);
    try {
      let result: ApiProfileDetail;

      switch (stepComponent) {

        case 'personal': {
          if (id) {
            // Editing — personal info update not re-init; just advance
            advanceStep();
            setSaving(false);
            return;
          }
          result = await initProfile({
            firstName: data.firstName?.trim(),
            middleName: data.middleName?.trim() || undefined,
            lastName: data.lastName?.trim(),
            gender: data.gender || undefined,
            dateOfBirth: data.dateOfBirth || undefined,
            nationality: data.nationality?.trim() || undefined,
            profilePhoto: data.profilePhoto || undefined,
          });
          profileIdRef.current = result.id;
          setProfileId(result.id);
          break;
        }

        case 'address':
          result = await saveAddress(id!, data);
          break;

        case 'contact':
          result = await saveContactInfo(id!, data);
          break;

        case 'identification':
          result = await saveIdentificationDocs(id!, data);
          break;

        case 'businessActivities':
          result = await saveBusinessActivities(id!, data);
          break;

        case 'entityOrganization':
          result = await saveEntityOrganization(id!, data);
          break;

        case 'geographicExposure':
          result = await saveGeographicExposure(id!, data);
          break;

        case 'relatedFIRsCases':
          result = await saveRelatedFIRs(id!, { firs: data.firs || [] });
          break;

        case 'materialSeized':
          result = await saveMaterialSeized(id!, { materialSeized: data.materialSeized || [] });
          break;

        case 'assets':
          result = await saveAssets(id!, { vehicles: data.vehicles || [] });
          break;

        case 'knownAssociates':
          result = await saveKnownAssociates(id!, { knownAssociates: data.knownAssociates || [] });
          break;

        case 'knownEmployees':
          result = await saveKnownEmployees(id!, { knownEmployees: data.knownEmployees || [] });
          break;

        case 'productsOperations':
          result = await saveProductsOperations(id!, data);
          break;

        case 'familyBackground':
          result = await saveFamilyBackground(id!, data);
          break;

        case 'influentialLinks':
          result = await saveInfluentialLinks(id!, { influentialLinks: data.influentialLinks || [] });
          break;

        case 'currentStatus':
          result = await saveCurrentStatus(id!, data);
          break;

        case 'additional': {
          result = await saveAdditionalInfo(id!, data);
          // ✅ Mark final step complete
          const stepInfo = result.stepStatuses?.find(s => s.stepNumber === currentStep);
          if (stepInfo?.status === 'COMPLETED' || stepInfo?.status === 'HALF_FILLED') {
            setCompletedSteps(prev => new Set(prev).add(currentStep));
          }
          showSaved();
          toast.success('Profile saved successfully!');
          if (onSaved) onSaved(result!);
          else navigate('/operations/profiles');
          return;
        }

        default:
          advanceStep();
          setSaving(false);
          return;
      }

      // ✅ Mark this step as complete (real data was saved)
      const stepInfo = result.stepStatuses?.find(s => s.stepNumber === currentStep);
      if (stepInfo?.status === 'COMPLETED' || stepInfo?.status === 'HALF_FILLED') {
        setCompletedSteps(prev => new Set(prev).add(currentStep));
      } else {
        setCompletedSteps(prev => {
          const updated = new Set(prev);
          updated.delete(currentStep);
          return updated;
        });
      }
      showSaved();
      advanceStep();

    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to save. Please try again.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  const handleCancelClick = () => {
    const msg = profileId
      ? 'Progress is saved to the database. Exit form?'
      : 'Are you sure you want to cancel?';
    if (!window.confirm(msg)) return;
    if (onCancel) onCancel();
    else navigate('/operations/profiles');
  };

  // ── Render Step ───────────────────────────────────────────────────────────

  const renderStep = () => {
    const step = steps[currentStep - 1];
    const onNext = (data: any) => handleStep(step.component, data);
    const d = initialData;

    switch (step.component) {
      case 'personal':
        return <PersonalInfo data={mapToPersonalInfo(d)} onNext={onNext} onBack={currentStep > 1 ? handleBack : undefined} />;
      case 'address':
        return <AddressInfo data={mapToAddress(d)} onNext={onNext} onBack={handleBack} />;
      case 'contact':
        return <ContactInfo data={mapToContactInfo(d)} onNext={onNext} onBack={handleBack} />;
      case 'identification':
        return <IdentificationDocs data={mapToIdentificationDocs(d)} onNext={onNext} onBack={handleBack} />;
      case 'businessActivities':
        return <BusinessActivities data={mapToBusinessActivities(d)} onNext={onNext} onBack={handleBack} />;
      case 'entityOrganization':
        return <EntityOrganization data={mapToEntityOrganization(d)} onNext={onNext} onBack={handleBack} />;
      case 'geographicExposure':
        return <GeographicExposure data={mapToGeographicExposure(d)} onNext={onNext} onBack={handleBack} />;
      case 'relatedFIRsCases':
        return <RelatedFIRsCases data={mapToRelatedFIRs(d)} onNext={onNext} onBack={handleBack} />;
      case 'materialSeized':
        return <MaterialSeized data={mapToMaterialSeized(d)} onNext={onNext} onBack={handleBack} />;
      case 'assets':
        return <Assets data={mapToAssets(d)} onNext={onNext} onBack={handleBack} />;
      case 'knownAssociates':
        return <KnownAssociates data={mapToKnownAssociates(d)} onNext={onNext} onBack={handleBack} />;
      case 'knownEmployees':
        return <KnownEmployees data={mapToKnownEmployees(d)} onNext={onNext} onBack={handleBack} />;
      case 'productsOperations':
        return <ProductsOperations data={mapToProductsOperations(d)} onNext={onNext} onBack={handleBack} />;
      case 'familyBackground':
        return <FamilyBackground data={mapToFamilyBackground(d)} onNext={onNext} onBack={handleBack} />;
      case 'influentialLinks':
        return <InfluentialLinks data={mapToInfluentialLinks(d)} onNext={onNext} onBack={handleBack} />;
      case 'currentStatus':
        return <CurrentStatus data={mapToCurrentStatus(d)} onNext={onNext} onBack={handleBack} />;
      case 'additional':
        return <AdditionalInfo data={mapToAdditionalInfo(d)} onNext={onNext} onBack={handleBack} />;
      default:
        return null;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">

        {/* ── Header ── */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {initialData?.id
                  ? `Edit Profile — ${initialData.profileNumber}`
                  : 'Create New Profile'}
              </h1>
              <p className="text-gray-600 text-sm">
                Each filled step is saved to the database immediately
              </p>
            </div>
            <div className="flex gap-2 items-center">
              {saving && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </div>
              )}
              {savedIndicator && !saving && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
                  <CheckCircle className="w-4 h-4" /> Saved
                </div>
              )}
              {profileId && (
                <div className="px-3 py-2 bg-gray-50 text-gray-500 rounded-lg text-xs font-mono">
                  ID: {profileId}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 bg-blue-50 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span>
              {profileId
                ? 'Progress saved. You can safely close and resume editing later.'
                : 'Complete Step 1 to create the profile. Empty optional steps are skipped automatically.'}
            </span>
          </div>
        </div>

        {/* ── Progress ── */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
            <span className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
              {completedSteps.size > 0 && (
                <span className="ml-2 text-green-600 font-semibold">
                  ({completedSteps.size} completed)
                </span>
              )}
            </span>
          </div>

          {/* Progress bar — based on completed steps */}
          <div className="h-2 bg-gray-200 rounded mb-4">
            <div
              style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
              className="h-full bg-green-500 rounded transition-all duration-500"
            />
          </div>

          {/* Step badges */}
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-1">
            {steps.map((step) => {
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = step.id === currentStep;

              return (
                <div
                  key={step.id}
                  onClick={() => {
                    // Allow jumping to completed steps or current step
                    if ((isCompleted || isCurrent) && (profileId || step.id === 1)) {
                      setCurrentStep(step.id);
                    }
                  }}
                  title={step.name}
                  className={`flex items-center gap-1 p-2 rounded text-xs transition-all select-none
                    ${isCompleted
                      ? 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200 border border-green-200'
                      : isCurrent
                        ? 'bg-blue-100 text-blue-700 font-semibold border border-blue-300 cursor-default'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {isCompleted
                    ? <Check className="w-3 h-3 flex-shrink-0 text-green-600" />
                    : <span className="w-3 text-center font-medium">{step.id}</span>
                  }
                  <span className="truncate hidden md:block">{step.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Step Content ── */}
        <div className={saving ? 'pointer-events-none opacity-60 transition-opacity' : ''}>
          {renderStep()}
        </div>

        {/* ── Cancel ── */}
        <div className="mt-6 text-center">
          <button
            onClick={handleCancelClick}
            className="px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            Cancel and Exit
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileForm;
