import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FileText, Upload, X, Plus, Tag } from 'lucide-react';
import { additionalInfoSchema } from '../utils/profileValidation';
import { riskLevelOptions } from '../data/profileOptions';
import type { AdditionalInfo } from '../types/profile.types';

interface Props {
  initialData?: AdditionalInfo | null;
  onComplete: (data: AdditionalInfo) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const AdditionalInfoStep = ({ initialData, onComplete }: Props) => {
  const [photos, setPhotos] = useState<string[]>(initialData?.additionalPhotos || []);
  const [attachments, setAttachments] = useState<string[]>(initialData?.attachments || []);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const { register, handleSubmit, formState: { } } = useForm<AdditionalInfo>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: initialData || { riskLevel: 'Low' },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert('File size should be less than 5MB');
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachments(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: AdditionalInfo) => {
    onComplete({
      ...data,
      tags,
      additionalPhotos: photos,
      attachments,
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-blue-600" />
          Additional Information
        </h2>
        <p className="text-sm text-gray-600 mt-1">Notes, risk assessment, and additional attachments</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Risk Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Level Assessment
          </label>
          <select 
            {...register('riskLevel')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {riskLevelOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Assess the risk level associated with this profile</p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags / Labels
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add tags (e.g., Theft, Fraud, Workplace Violence)"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-1 hover:text-blue-900"
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
            placeholder="Any additional information, observations, or remarks..."
          />
        </div>

        {/* Behavioral Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Behavioral Notes / Observations
          </label>
          <textarea 
            {...register('behavioralNotes')} 
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Behavioral patterns, tendencies, or psychological observations..."
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
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600 mb-1">Click to upload additional photos</span>
              <span className="text-xs text-gray-500">PNG, JPG (Max 5MB each)</span>
            </label>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-24 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Attachments
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleAttachmentUpload}
              className="hidden"
              id="attachment-upload"
            />
            <label htmlFor="attachment-upload" className="cursor-pointer flex flex-col items-center">
              <FileText className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600 mb-1">Click to upload documents</span>
              <span className="text-xs text-gray-500">PDF, DOC, DOCX, TXT</span>
            </label>
          </div>

          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((_, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Attachment {index + 1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium mb-2">
            ✓ You're almost done! Review your information and click the button below.
          </p>
          <button 
            type="submit" 
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Complete Profile Creation
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdditionalInfoStep;
