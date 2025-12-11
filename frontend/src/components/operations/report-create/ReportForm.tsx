// components/operation/report-create/ReportForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ReportData, Section } from './types/report.types';
import { ChevronRight, Plus, Save, Upload, X } from 'lucide-react';
import DynamicSection from './sections/DynamicSection';

const headerSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
    preparedFor: z.string().min(1, 'Client name is required'),
    preparedBy: z.string().min(1, 'Company name is required'),
    date: z.string().min(1, 'Date is required'),
    clientLogo: z.string().optional(),
});

type HeaderFormData = z.infer<typeof headerSchema>;

interface ReportFormProps {
    onComplete: (data: ReportData) => void;
    initialData?: ReportData;
}

const ReportForm = ({ onComplete, initialData }: ReportFormProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [sections, setSections] = useState<Section[]>(initialData?.sections || []);
    const [headerData, setHeaderData] = useState<HeaderFormData | null>(
        initialData?.header || null
    );
    const [logoPreview, setLogoPreview] = useState<string | null>(
        initialData?.header.clientLogo || null
    );

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<HeaderFormData>({
        resolver: zodResolver(headerSchema),
        defaultValues: initialData?.header,
    });

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setLogoPreview(base64String);
                setValue('clientLogo', base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setLogoPreview(null);
        setValue('clientLogo', '');
    };

    const onHeaderSubmit = (data: HeaderFormData) => {
        setHeaderData(data);
        setCurrentStep(2);
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
        setSections(sections.map(s => s.id === id ? updatedSection : s));
    };

    const handleDeleteSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id));
    };

    const handleComplete = () => {
        if (!headerData) return;

        const reportData: ReportData = {
            header: headerData,
            tableOfContents: sections.map(s => s.title).filter(title => title.trim() !== ''),
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
                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client Company Logo
                            </label>

                            {!logoPreview ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                        id="logo-upload"
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-600 mb-1">
                                            Click to upload client logo
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            PNG, JPG up to 5MB
                                        </span>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative inline-block">
                                    <img
                                        src={logoPreview}
                                        alt="Client Logo Preview"
                                        className="h-24 w-auto border border-gray-300 rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

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

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Prepared For (Client) *
                                </label>
                                <input
                                    {...register('preparedFor')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Dhanuka Agritech Ltd"
                                />
                                {errors.preparedFor && (
                                    <p className="mt-1 text-sm text-red-600">{errors.preparedFor.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Prepared By (Your Company) *
                                </label>
                                <input
                                    {...register('preparedBy')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., True Buddy Consulting Pvt Ltd"
                                />
                                {errors.preparedBy && (
                                    <p className="mt-1 text-sm text-red-600">{errors.preparedBy.message}</p>
                                )}
                            </div>
                        </div>

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
                                Continue to Sections
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
                            <h2 className="text-2xl font-bold text-gray-900">
                                Report Sections
                            </h2>
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

                    <div className="flex justify-between">
                        <button
                            onClick={() => setCurrentStep(1)}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Back to Header
                        </button>
                        <button
                            onClick={handleComplete}
                            disabled={sections.length === 0}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            Preview Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportForm;
