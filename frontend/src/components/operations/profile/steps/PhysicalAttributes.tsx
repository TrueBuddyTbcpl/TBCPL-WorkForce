import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ruler } from 'lucide-react';
import { physicalAttributesSchema } from '../utils/profileValidation';
import { eyeColorOptions, hairColorOptions, skinToneOptions } from '../data/profileOptions';
import type { PhysicalAttributes } from '../types/profile.types';

interface Props {
  initialData?: PhysicalAttributes | null;
  onComplete: (data: PhysicalAttributes) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const PhysicalAttributesStep = ({ initialData, onComplete }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PhysicalAttributes>({
    resolver: zodResolver(physicalAttributesSchema),
    defaultValues: initialData || {},
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Ruler className="w-7 h-7 text-blue-600" />
          Physical Attributes
        </h2>
        <p className="text-sm text-gray-600 mt-1">Physical characteristics and identification marks</p>
      </div>
      
      <form onSubmit={handleSubmit(onComplete)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm) <span className="text-red-500">*</span>
            </label>
            <input 
              type="number"
              {...register('height')} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 175"
            />
            {errors.height && (
              <p className="text-red-600 text-xs mt-1">{errors.height.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg) <span className="text-red-500">*</span>
            </label>
            <input 
              type="number"
              {...register('weight')} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 70"
            />
            {errors.weight && (
              <p className="text-red-600 text-xs mt-1">{errors.weight.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eye Color
            </label>
            <select 
              {...register('eyeColor')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select eye color</option>
              {eyeColorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hair Color
            </label>
            <select 
              {...register('hairColor')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select hair color</option>
              {hairColorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skin Tone
            </label>
            <select 
              {...register('skinTone')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select skin tone</option>
              {skinToneOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Identification Marks
          </label>
          <textarea 
            {...register('identificationMarks')} 
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Scar on left cheek, mole on right hand, tattoo on arm..."
          />
          <p className="text-xs text-gray-500 mt-1">Describe any unique marks, scars, tattoos, or birthmarks</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Disabilities / Special Conditions
          </label>
          <textarea 
            {...register('disabilities')} 
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any physical disabilities or special medical conditions..."
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Continue to Address Information
          </button>
        </div>
      </form>
    </div>
  );
};

export default PhysicalAttributesStep;
