import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

interface InfluentialLink {
  personName: string;
  profile: string;
  relationship?: string;
}

interface Props {
  data?: { influentialLinks?: InfluentialLink[] };
  onNext: (data: { influentialLinks?: InfluentialLink[] }) => void;
  onBack?: () => void;
}

const InfluentialLinksStep = ({ data, onNext, onBack }: Props) => {
  const { register, control, handleSubmit } = useForm({
    defaultValues: data || {
      influentialLinks: [{ personName: '', profile: '', relationship: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'influentialLinks',
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Links with Influential Individuals</h3>
          <button
            type="button"
            onClick={() => append({ personName: '', profile: '', relationship: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="relative border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50">
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}

              <h4 className="text-md font-medium text-gray-800 mb-3">Influential Person #{index + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name of Person
                  </label>
                  <input
                    type="text"
                    {...register(`influentialLinks.${index}.personName` as const)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Enter influential person's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    {...register(`influentialLinks.${index}.relationship` as const)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="e.g., Political, Business, Family"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile/Details
                  </label>
                  <textarea
                    {...register(`influentialLinks.${index}.profile` as const)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Enter profile details, position, influence, or other relevant information..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No influential links added yet. Click "Add Link" to add one.</p>
          </div>
        )}
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

export default InfluentialLinksStep;
