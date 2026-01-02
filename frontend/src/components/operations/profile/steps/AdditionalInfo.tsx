import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { X } from 'lucide-react';
import type { AdditionalInfo } from '../types/profile.types';

interface Props {
  data?: AdditionalInfo;
  onNext: (data: AdditionalInfo) => void;
  onBack?: () => void;
}

const AdditionalInfoStep = ({ data, onNext, onBack }: Props) => {
  const { register, handleSubmit } = useForm<AdditionalInfo>({
    defaultValues: data || {},
  });

  const [tags, setTags] = useState<string[]>(data?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onSubmit = (formData: AdditionalInfo) => {
    onNext({ ...formData, tags });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
        
        <div className="space-y-4">
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">General Notes</label>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter general notes or observations..."
            />
          </div>

          {/* Behavioral Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Behavioral Observations</label>
            <textarea
              {...register('behavioralNotes')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter behavioral observations..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tag and press Enter or click Add"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                  {tag}
                  <button type="button" onClick={() => removeTag(index)} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-auto"
        >
          Complete Profile
        </button>
      </div>
    </form>
  );
};

export default AdditionalInfoStep;
