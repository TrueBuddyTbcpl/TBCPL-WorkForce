import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FileText, Upload, X, Briefcase, AlertCircle } from 'lucide-react';
import { additionalInfoSchema } from '../utils/profileValidation';
import type { AdditionalInfo } from '../types/profile.types';
import MultiSelectDropdown from '../../../common/MultiSelectDropdown';
import { availableCases } from '../data/caseOptions';

interface Props {
  initialData?: AdditionalInfo | null;
  onComplete: (data: AdditionalInfo) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const AdditionalInfoStep = ({ initialData, onComplete }: Props) => {
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>(
    initialData?.additionalPhotos || []
  );
  const [linkedCases, setLinkedCases] = useState<string[]>(
    initialData?.linkedCases || []
  );

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AdditionalInfo>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: initialData || {
      riskLevel: 'Low',
      tags: [],
      linkedCases: [],
    },
  });

  const tags = watch('tags') || [];

  // Update form value when linkedCases changes
  const handleLinkedCasesChange = (cases: string[]) => {
    setLinkedCases(cases);
    setValue('linkedCases', cases, { shouldValidate: true });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setAdditionalPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const newTag = target.value.trim();
      
      if (newTag && !tags.includes(newTag)) {
        setValue('tags', [...tags, newTag]);
        target.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = (data: AdditionalInfo) => {
    onComplete({
      ...data,
      additionalPhotos,
      linkedCases,
    });
  };

  const getSelectedCasesInfo = () => {
    return linkedCases.map(caseId => 
      availableCases.find(c => c.value === caseId)
    ).filter(Boolean);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-blue-600" />
          Additional Information
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Additional notes, risk assessment, case links, and supporting documents
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Risk Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Level
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Low', 'Medium', 'High', 'Critical'].map((level) => (
              <label
                key={level}
                className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  watch('riskLevel') === level
                    ? level === 'Low'
                      ? 'border-green-500 bg-green-50'
                      : level === 'Medium'
                      ? 'border-yellow-500 bg-yellow-50'
                      : level === 'High'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  value={level}
                  {...register('riskLevel')}
                  className="sr-only"
                />
                <span
                  className={`text-sm font-semibold ${
                    watch('riskLevel') === level
                      ? level === 'Low'
                        ? 'text-green-700'
                        : level === 'Medium'
                        ? 'text-yellow-700'
                        : level === 'High'
                        ? 'text-orange-700'
                        : 'text-red-700'
                      : 'text-gray-700'
                  }`}
                >
                  {level}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Linked Cases - Multi-Select Dropdown (MANDATORY) */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <label className="block text-sm font-medium text-gray-700">
              Linked Cases <span className="text-red-500">*</span>
            </label>
          </div>
          
          {/* Error Alert */}
          {errors.linkedCases && (
            <div className="mb-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errors.linkedCases.message}</p>
            </div>
          )}

          <MultiSelectDropdown
            options={availableCases}
            selectedValues={linkedCases}
            onChange={handleLinkedCasesChange}
            placeholder="Select at least one case..."
            label=""
            error={errors.linkedCases?.message}
          />
          <p className="text-xs text-gray-500 mt-1">
            <strong>Required:</strong> Link this profile to at least one case for tracking and future reference
          </p>

          {/* Selected Cases Summary */}
          {linkedCases.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Selected Cases ({linkedCases.length}):
              </p>
              {getSelectedCasesInfo().map((caseInfo) => (
                <div
                  key={caseInfo?.value}
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {caseInfo?.value}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-600">
                        Type: {caseInfo?.caseType}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          caseInfo?.status === 'Open'
                            ? 'bg-green-100 text-green-800'
                            : caseInfo?.status === 'Closed'
                            ? 'bg-gray-100 text-gray-800'
                            : caseInfo?.status === 'Under Investigation'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {caseInfo?.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        Reported: {new Date(caseInfo?.dateReported || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            onKeyDown={handleAddTag}
            placeholder="Type a tag and press Enter"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Press Enter to add tags for quick filtering
          </p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* General Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            General Notes
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any additional information or observations..."
          />
        </div>

        {/* Behavioral Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Behavioral Observations
          </label>
          <textarea
            {...register('behavioralNotes')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Behavioral patterns, tendencies, or notable observations..."
          />
        </div>

        {/* Additional Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Photos
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
              id="additional-photos"
            />
            <label htmlFor="additional-photos" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload additional photos
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 5MB each
              </p>
            </label>
          </div>

          {additionalPhotos.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {additionalPhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Additional ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={linkedCases.length === 0}
          >
            <FileText className="w-5 h-5" />
            Complete Profile
          </button>
          {linkedCases.length === 0 && (
            <p className="text-xs text-red-600 text-center mt-2">
              Please link at least one case to continue
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdditionalInfoStep;
