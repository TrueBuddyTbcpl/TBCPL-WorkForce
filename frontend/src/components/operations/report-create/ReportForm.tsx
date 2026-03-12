import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'react-router-dom';
import type {
  ReportData,
  Section,
  CaseReportPrefillResponse,
} from './types/report.types';
import { ChevronRight, Plus, Save, ArrowLeft, Building2 } from 'lucide-react';
import DynamicSection from './sections/DynamicSection';
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
}


const FORM_STEP_KEY = 'report_form_step';


const ReportForm = ({
  onComplete,
  initialData,
  reportId,
  caseId,
}: ReportFormProps) => {
  const location = useLocation();
  const prefill = (location.state as { prefill?: CaseReportPrefillResponse })?.prefill ?? null;


  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem(FORM_STEP_KEY);
    return savedStep ? parseInt(savedStep) : 1;
  });


  const [sections, setSections] = useState<Section[]>(
    initialData?.sections ?? []
  );


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
    defaultValues: initialData
      ? {
        title: initialData.header.title,
        subtitle: initialData.header.subtitle,
        preparedFor: initialData.header.preparedFor,
        preparedBy: 'TBCPL',
        date: initialData.header.date,
      }
      : {
        title: '',
        subtitle: '',
        preparedFor: prefill?.clientName ?? '',
        preparedBy: 'TBCPL',
        date: new Date().toISOString().split('T')[0],
      },
  });


  const watchedFields = watch();


  useEffect(() => {
    localStorage.setItem(FORM_STEP_KEY, currentStep.toString());
  }, [currentStep]);


  useEffect(() => {
    const tempData: ReportData = {
      reportId,
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
    clientLogoUrl,
  ]);


  const onHeaderSubmit = () => {
    setCurrentStep(2);
    window.history.pushState({ formStep: 2, step: 'form' }, '', window.location.pathname);
  };


  const handleBackToStep1 = () => {
    setCurrentStep(1);
    window.history.pushState({ formStep: 1, step: 'form' }, '', window.location.pathname);
  };


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


  const handleComplete = () => {
    // ✅ FIX: always use current watched form values, not stale headerData state
    const currentHeader: HeaderFormData = {
      title: watchedFields.title || '',
      subtitle: watchedFields.subtitle || '',
      preparedFor: watchedFields.preparedFor || '',
      preparedBy: watchedFields.preparedBy || '',
      date: watchedFields.date || new Date().toISOString().split('T')[0],
    };

    // Validate required fields
    if (!currentHeader.title || !currentHeader.preparedFor || !currentHeader.preparedBy) {
      toast.error('Please complete the header information first (Step 1)');
      setCurrentStep(1);
      return;
    }

    const reportData: ReportData = {
      reportId,
      caseId: resolvedCaseId ?? undefined,
      clientLogoUrl,
      header: {
        ...currentHeader,
        clientLogo: clientLogoUrl ?? undefined,
      },
      tableOfContents: sections.map((s) => s.title).filter((t) => t.trim() !== ''),
      sections,
    };
    onComplete(reportData);
  };



  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of 2
          </span>
          <span className="text-sm text-gray-500">
            {currentStep === 1 ? 'Report Header' : 'Report Sections'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 2) * 100}%` }}
          />
        </div>
      </div>


      {/* Step 1: Header Form */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Report Header Information
          </h2>


          <form onSubmit={handleSubmit(onHeaderSubmit)} className="space-y-6">
            {/* Client Logo — Read-only */}
            <div>
              {/* ✅ FIX 1: was `abel className=` */}
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
              {/* ✅ FIX 2: was `abel className=` */}
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
              {/* ✅ FIX 3: was `abel className=` */}
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
                {/* ✅ FIX 4: was `abel className=` */}
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
                  readOnly                                   // ← readOnly keeps value in form state
                  value="TBCPL"                              // ← locked display value
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg 
               bg-gray-100 text-gray-500 cursor-not-allowed select-none"
                />
                <p className="text-xs text-gray-400 mt-1">Auto-filled by system</p>
                {/* ← removed error display, field is always valid */}
              </div>

            </div>


            {/* Date */}
            <div>
              {/* ✅ FIX 5: was `abel className=` */}
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


      {/* Step 2: Sections Builder */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Report Sections</h2>
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
              onClick={handleComplete}
              disabled={sections.length === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              Next: Preview Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default ReportForm;
