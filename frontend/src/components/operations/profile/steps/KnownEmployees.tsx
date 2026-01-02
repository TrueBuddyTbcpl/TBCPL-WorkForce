import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { AssociateInfo } from '../types/profile.types';

interface Props {
  data?: { knownEmployees?: AssociateInfo[] };
  onNext: (data: { knownEmployees?: AssociateInfo[] }) => void;
  onBack?: () => void;
}

const KnownEmployeesStep = ({ data, onNext, onBack }: Props) => {
  const { register, control, handleSubmit } = useForm({
    defaultValues: data || {
      knownEmployees: [{ name: '', relationship: '', role: 'Employee', contactInfo: '', notes: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'knownEmployees',
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Known Employees</h3>
          <button
            type="button"
            onClick={() => append({ name: '', relationship: '', role: 'Employee', contactInfo: '', notes: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Employee
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

              <h4 className="text-md font-medium text-gray-800 mb-3">Employee #{index + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    {...register(`knownEmployees.${index}.name` as const)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter employee name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position/Role</label>
                  <input
                    type="text"
                    {...register(`knownEmployees.${index}.relationship` as const)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Manager, Driver, Worker"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                  <input
                    type="text"
                    {...register(`knownEmployees.${index}.contactInfo` as const)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone or email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select
                    {...register(`knownEmployees.${index}.role` as const)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Associate">Associate</option>
                    <option value="Family">Family</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    {...register(`knownEmployees.${index}.notes` as const)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional notes about this employee"
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

export default KnownEmployeesStep;
