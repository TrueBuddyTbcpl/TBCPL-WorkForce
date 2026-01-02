import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { MaterialSeizedItem } from '../types/profile.types';

interface Props {
  data?: { materialSeized?: MaterialSeizedItem[] };
  onNext: (data: { materialSeized?: MaterialSeizedItem[] }) => void;
  onBack?: () => void;
}

const MaterialSeizedStep = ({ data, onNext, onBack }: Props) => {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: data || {
      materialSeized: [{ brandName: '', company: '', quantity: '', location: '', raidingAuthority: undefined, raidingAuthorityOther: '', dateSeized: '' }],  // ✅ Changed from '' to undefined
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'materialSeized',
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Material Seized</h3>
          <button
            type="button"
            onClick={() => append({ brandName: '', company: '', quantity: '', location: '', raidingAuthority: undefined, raidingAuthorityOther: '', dateSeized: '' })}  // ✅ Changed from '' to undefined
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}

              <h4 className="text-md font-medium text-gray-800 mb-3">Item #{index + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    {...register(`materialSeized.${index}.brandName` as const)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter brand name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    {...register(`materialSeized.${index}.company` as const)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    {...register(`materialSeized.${index}.quantity` as const)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 500 kg, 1000 units"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    {...register(`materialSeized.${index}.location` as const)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Location where seized"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Raiding Authority</label>
                  <select
                    {...register(`materialSeized.${index}.raidingAuthority` as const)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Authority</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Police">Police</option>
                    <option value="Wing">Wing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {watch(`materialSeized.${index}.raidingAuthority`) === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specify Authority</label>
                    <input
                      type="text"
                      {...register(`materialSeized.${index}.raidingAuthorityOther` as const)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Specify other authority"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Seized</label>
                  <input
                    type="date"
                    {...register(`materialSeized.${index}.dateSeized` as const)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        {onBack && <button type="button" onClick={onBack} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Back</button>}
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto">Next Step</button>
      </div>
    </form>
  );
};

export default MaterialSeizedStep;
