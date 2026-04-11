// components/operations/report-create/ReportForm.tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'react-router-dom';
import type {
  ReportData,
  Section,
  CaseReportPrefillResponse,
  PhotographicEvidence,
} from './types/report.types';
import { ChevronRight, Plus, Save, ArrowLeft, Building2, Camera } from 'lucide-react';
import DynamicSection from './sections/DynamicSection';
import PhotographicEvidencePanel from './sections/PhotographicEvidencePanel';
import { toast } from 'sonner';


const headerSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  preparedFor: z.string().min(1, 'Client name is required'),
  preparedBy: z.string().min(1, 'Company name is required'),
  date: z.string().min(1, 'Date is required'),
});

type HeaderFormData = z.infer<typeof headerSchema>;

interface ReportFormProps {
  onComplete: (data: ReportData) => void;
  initialData?: ReportData;
  reportId?: number;
  caseId?: number;

  photographicEvidence?: PhotographicEvidence;
  setPhotographicEvidence?: (data: PhotographicEvidence) => void;
}

const FORM_STEP_KEY = 'report_form_step';



const STEP_LABELS: Record<number, string> = {
  1: 'Cover Page',
  2: 'Report Sections',
  3: 'Upload Images',
};

const ReportForm = ({
  onComplete,
  initialData,
  reportId: reportIdProp,
  caseId,
  photographicEvidence: parentPhotographicEvidence,
  setPhotographicEvidence: setParentPhotographicEvidence,
}: ReportFormProps) => {
  const location = useLocation();
  const prefill = (location.state as { prefill?: CaseReportPrefillResponse })?.prefill ?? null;

  // ✅ FIX: resolve reportId from prop OR initialData — whichever is available
  const resolvedReportId: number | undefined = reportIdProp ?? initialData?.reportId;

  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem(FORM_STEP_KEY);
    return savedStep ? parseInt(savedStep) : 1;
  });

  const [sections, setSections] = useState<Section[]>(
    (initialData?.sections ?? []).filter((s) => s.type !== 'image')
  );

const photographicEvidence =
  parentPhotographicEvidence ??
  initialData?.photographicEvidence ?? {
    showHeading: false,
    heading: '',
    images: [],
  };

  const setPhotographicEvidence =
    setParentPhotographicEvidence ?? (() => { });

  const [clientLogoUrl] = useState<string | null>(
    prefill?.clientLogoUrl ?? initialData?.clientLogoUrl ?? null
  );

  const resolvedCaseId: number | null =
    caseId ?? prefill?.caseId ?? initialData?.caseId ?? null;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<HeaderFormData>({
    resolver: zodResolver(headerSchema),
    defaultValues: {
      title: initialData?.header?.title ?? '',
      subtitle: initialData?.header?.subtitle ?? '',
      preparedFor:
        initialData?.header?.preparedFor ?? prefill?.clientName ?? '',
      preparedBy: 'TBCPL',
      date:
        initialData?.header?.date ??
        new Date().toISOString().split('T')[0],
    },
  });

  const watchedFields = watch();

  useEffect(() => {
    localStorage.setItem(FORM_STEP_KEY, currentStep.toString());
  }, [currentStep]);

  // ✅ FIX: use resolvedReportId in auto-save so it is never wiped to undefined
  useEffect(() => {
    const tempData: ReportData = {
      reportId: resolvedReportId,
      caseId: resolvedCaseId ?? undefined,
      clientLogoUrl,
      header: {
        title: watchedFields.title || '',
        subtitle: watchedFields.subtitle || '',
        preparedFor: watchedFields.preparedFor || '',
        preparedBy: watchedFields.preparedBy || '',
        date: watchedFields.date || new Date().toISOString().split('T')[0],
        clientLogo: clientLogoUrl ?? undefined,
      },
      tableOfContents: sections.map((s) => s.title).filter((t) => t.trim() !== ''),
      sections,
      photographicEvidence,
    };
    localStorage.setItem('report_data', JSON.stringify(tempData));
    localStorage.setItem('report_timestamp', Date.now().toString());
  }, [
    watchedFields.title,
    watchedFields.subtitle,
    watchedFields.preparedFor,
    watchedFields.preparedBy,
    watchedFields.date,
    sections,
    photographicEvidence,
    clientLogoUrl,
    resolvedReportId,
  ]);

  // ── Step navigation helpers ──────────────────────────────────────────────
  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.history.pushState({ formStep: step, step: 'form' }, '', window.location.pathname);
  };

  const onHeaderSubmit = () => goToStep(2);
  const handleBackToStep1 = () => goToStep(1);
  const handleGoToStep3 = () => goToStep(3);
  const handleBackToStep2 = () => goToStep(2);

  // ── Section helpers ──────────────────────────────────────────────────────
  const handleAddSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: '',
      type: 'table',
      content: { columns: ['Parameter', 'Details'], rows: [] },
    };
    setSections([...sections, newSection]);
  };

  const handleUpdateSection = (id: string, updatedSection: Section) => {
    setSections(sections.map((s) => (s.id === id ? updatedSection : s)));
  };

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  // ── Final submit ─────────────────────────────────────────────────────────
  const handleComplete = () => {
    const currentHeader: HeaderFormData = {
      title: watchedFields.title || '',
      subtitle: watchedFields.subtitle || '',
      preparedFor: watchedFields.preparedFor || '',
      preparedBy: watchedFields.preparedBy || '',
      date: watchedFields.date || new Date().toISOString().split('T')[0],
    };

    if (!currentHeader.title || !currentHeader.preparedFor || !currentHeader.preparedBy) {
      toast.error('Please complete the header information first (Step 1)');
      goToStep(1);
      return;
    }

    const reportData: ReportData = {
      // ✅ FIX: use resolvedReportId so edit-mode is correctly detected in ReportCreate
      reportId: resolvedReportId,
      caseId: resolvedCaseId ?? undefined,
      clientLogoUrl,
      header: {
        ...currentHeader,
        clientLogo: clientLogoUrl ?? undefined,
      },
      tableOfContents: sections.map((s) => s.title).filter((t) => t.trim() !== ''),
      sections,
      photographicEvidence,
    };
    onComplete(reportData);
  };


  return (
    <div className="max-w-6xl mx-auto py-8 px-4">

      {/* ── Progress Bar ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of 3
          </span>
          <span className="text-sm text-gray-500">
            {STEP_LABELS[currentStep]}
          </span>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2 flex-1 last:flex-none">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-colors ${currentStep > step
                  ? 'bg-green-500 text-white'
                  : currentStep === step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {currentStep > step ? '✓' : step}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${currentStep === step ? 'text-blue-600' : 'text-gray-400'
                  }`}
              >
                {STEP_LABELS[step]}
              </span>
              {step < 3 && (
                <div
                  className={`flex-1 h-0.5 rounded-full mx-1 transition-colors ${currentStep > step ? 'bg-green-400' : 'bg-gray-200'
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Progress fill bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          />
        </div>
      </div>


      {/* ── Step 1: Cover Page / Header ──────────────────────────────────────── */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Report Header Information
          </h2>

          <form onSubmit={handleSubmit(onHeaderSubmit)} className="space-y-6">

            {/* Client Logo — Read-only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Logo
              </label>
              {clientLogoUrl ? (
                <div className="flex items-center gap-3">
                  <img
                    src={clientLogoUrl}
                    alt="Client Logo"
                    className="h-20 w-auto border border-gray-200 rounded-lg object-contain bg-gray-50 p-2"
                  />
                  <p className="text-xs text-gray-500 italic">
                    Logo is fetched from the client profile and cannot be changed here.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                  <Building2 className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-500">No logo available for this client.</p>
                </div>
              )}
            </div>

            {/* Report Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Title *
              </label>
              <input
                {...register('title')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Investigation & Action - Wetcut Ahmedabad"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Report Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Subtitle *
              </label>
              <input
                {...register('subtitle')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Manufacturer of 'Wetcut' in Gujarat"
              />
              {errors.subtitle && (
                <p className="mt-1 text-sm text-red-600">{errors.subtitle.message}</p>
              )}
            </div>

            {/* Prepared For / Prepared By */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prepared For (Client) *
                </label>
                <input
                  {...register('preparedFor')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                  placeholder="e.g., Dhanuka Agritech Ltd"
                />
                {errors.preparedFor && (
                  <p className="mt-1 text-sm text-red-600">{errors.preparedFor.message}</p>
                )}
                {prefill?.clientName && (
                  <p className="text-xs text-blue-600 mt-1">Pre-filled from case client</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prepared By (Your Company) *
                </label>
                <input
                  {...register('preparedBy')}
                  readOnly
                  value="TBCPL"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed select-none"
                />
                <p className="text-xs text-gray-400 mt-1">Auto-filled by system</p>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                {...register('date')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                Next: Add Sections
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}


      {/* ── Step 2: Sections Builder ──────────────────────────────────────────── */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Report Sections</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Add your content sections below. Images are uploaded in the next step.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {sections.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">No sections added yet</p>
                  <button
                    onClick={handleAddSection}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Section
                  </button>
                </div>
              ) : (
                sections.map((section, index) => (
                  <DynamicSection
                    key={section.id}
                    section={section}
                    index={index}
                    caseId={resolvedCaseId}
                    onUpdate={handleUpdateSection}
                    onDelete={handleDeleteSection}
                  />
                ))
              )}
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={handleAddSection}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Section
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handleBackToStep1}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous: Header
            </button>
            <button
              onClick={handleGoToStep3}
              disabled={sections.length === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Upload Images
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}


      {/* ── Step 3: Image Upload ──────────────────────────────────────────────── */}
      {currentStep === 3 && (
        <div className="space-y-6">

          {/* Step header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Camera className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Images</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Add photographic evidence that will appear as a dedicated section at the end of the report.
                </p>
              </div>
            </div>
          </div>

          {/* Photographic Evidence Panel */}
          <PhotographicEvidencePanel
            value={photographicEvidence}
            caseId={resolvedCaseId}
            onChange={setPhotographicEvidence}
          />

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handleBackToStep2}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous: Sections
            </button>
            <button
              onClick={handleComplete}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Save className="w-5 h-5" />
              Save &amp; Preview Report
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default ReportForm;