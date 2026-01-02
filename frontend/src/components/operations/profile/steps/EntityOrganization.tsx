import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { EntityOrganization } from '../types/profile.types';

interface Props {
  data?: EntityOrganization;
  onNext: (data: EntityOrganization) => void;
  onBack?: () => void;
}

const EntityOrganizationStep = ({ data, onNext, onBack }: Props) => {
  const { register, control, handleSubmit } = useForm<EntityOrganization>({
    defaultValues: data || { associatedCompanies: [{ companyName: '', relationshipNature: '', details: '' }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'associatedCompanies',
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Entity & Organization Associations</h3>
          <button type="button" onClick={() => append({ companyName: '', relationshipNature: '', details: '' })} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add Company
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}

              <h4 className="text-md font-medium text-gray-800 mb-3">Company #{index + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input type="text" {...register(`associatedCompanies.${index}.companyName` as const)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter company name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship Nature</label>
                  <select {...register(`associatedCompanies.${index}.relationshipNature` as const)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Relationship</option>
                    <option value="Ownership">Ownership</option>
                    <option value="Control">Control</option>
                    <option value="Representation">Representation</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Client">Client</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                  <textarea {...register(`associatedCompanies.${index}.details` as const)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Additional details about the relationship" />
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

export default EntityOrganizationStep;
