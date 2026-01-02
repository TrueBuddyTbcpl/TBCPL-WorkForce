import { useForm } from 'react-hook-form';
import type { PhysicalAttributes } from '../types/profile.types';

interface Props {
  data?: PhysicalAttributes;
  onNext: (data: PhysicalAttributes) => void;
  onBack?: () => void;
}

const PhysicalAttributesStep = ({ data, onNext, onBack }: Props) => {
  const { register, handleSubmit } = useForm<PhysicalAttributes>({
    defaultValues: data || {},
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Attributes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
            <input
              type="text"
              {...register('height')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 5'10'' or 178 cm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <input
              type="text"
              {...register('weight')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 70 kg or 154 lbs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eye Color</label>
            <input
              type="text"
              {...register('eyeColor')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Brown, Blue, Green"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hair Color</label>
            <input
              type="text"
              {...register('hairColor')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Black, Brown, Blonde"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skin Tone</label>
            <input
              type="text"
              {...register('skinTone')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Fair, Wheatish, Dark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Identification Marks</label>
            <input
              type="text"
              {...register('identificationMarks')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Scar on left cheek, Mole on forehead"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Disabilities</label>
            <textarea
              {...register('disabilities')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any disabilities or special conditions"
            />
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
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};

export default PhysicalAttributesStep;
