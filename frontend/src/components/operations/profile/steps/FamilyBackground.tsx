import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { FamilyBackground } from '../types/profile.types';

interface Props {
  data?: FamilyBackground;
  onNext: (data: FamilyBackground) => void;
  onBack?: () => void;
}

const FamilyBackgroundStep = ({ data, onNext, onBack }: Props) => {
  const { register, control, handleSubmit } = useForm<FamilyBackground>({
    defaultValues: data || {
      fatherName: '',
      fatherOccupation: '',
      fatherContact: '',
      motherName: '',
      motherOccupation: '',
      motherContact: '',
      siblings: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'siblings',
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Background</h3>

        {/* Father Information */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-md font-medium text-gray-800 mb-3">Father Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
              <input
                type="text"
                {...register('fatherName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter father's name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <input
                type="text"
                {...register('fatherOccupation')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter occupation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <input
                type="text"
                {...register('fatherContact')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Phone or email"
              />
            </div>
          </div>
        </div>

        {/* Mother Information */}
        <div className="mb-6 p-4 bg-pink-50 rounded-lg">
          <h4 className="text-md font-medium text-gray-800 mb-3">Mother Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
              <input
                type="text"
                {...register('motherName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter mother's name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <input
                type="text"
                {...register('motherOccupation')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter occupation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <input
                type="text"
                {...register('motherContact')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Phone or email"
              />
            </div>
          </div>
        </div>

        {/* Siblings */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-800">Siblings</h4>
            <button
              type="button"
              onClick={() => append({ name: '', relationship: '', occupation: '' })}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Sibling
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      {...register(`siblings.${index}.name` as const)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <select
                      {...register(`siblings.${index}.relationship` as const)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                    <input
                      type="text"
                      {...register(`siblings.${index}.occupation` as const)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter occupation"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        {onBack && <button type="button" onClick={onBack} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Back</button>}
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto">Next Step</button>
      </div>
    </form>
  );
};

export default FamilyBackgroundStep;
