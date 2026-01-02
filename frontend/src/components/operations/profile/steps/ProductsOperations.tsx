import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { X } from 'lucide-react';
import type { ProductsOperations } from '../types/profile.types';

interface Props {
  data?: ProductsOperations;
  onNext: (data: ProductsOperations) => void;
  onBack?: () => void;
}

const ProductsOperationsStep = ({ data, onNext, onBack }: Props) => {
  const { register, control, handleSubmit } = useForm<ProductsOperations>({
    defaultValues: data || {
      productsInfringed: [{ brandName: '', companyName: '', productType: '' }],
      knownModusOperandi: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productsInfringed',
  });

  const [locations, setLocations] = useState<string[]>(data?.knownLocations || []);
  const [locationInput, setLocationInput] = useState('');

  const addLocation = () => {
    if (locationInput.trim() && !locations.includes(locationInput.trim())) {
      setLocations([...locations, locationInput.trim()]);
      setLocationInput('');
    }
  };

  const removeLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const onSubmit = (formData: ProductsOperations) => {
    onNext({ ...formData, knownLocations: locations });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Products & Operations</h3>

        {/* Products Infringed */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-800">Products Infringed</h4>
            <button
              type="button"
              onClick={() => append({ brandName: '', companyName: '', productType: '' })}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-4 p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                    <input
                      type="text"
                      {...register(`productsInfringed.${index}.brandName` as const)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter brand name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      {...register(`productsInfringed.${index}.companyName` as const)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                    <input
                      type="text"
                      {...register(`productsInfringed.${index}.productType` as const)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Pesticide, Seed"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Known Modus Operandi */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Known Modus Operandi</label>
          <textarea
            {...register('knownModusOperandi')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the known methods of operation, tactics, or patterns..."
          />
        </div>

        {/* Known Locations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Known Locations</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLocation();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter location and press Enter"
            />
            <button
              type="button"
              onClick={addLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {locations.map((location, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                {location}
                <button type="button" onClick={() => removeLocation(index)} className="hover:bg-blue-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
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

export default ProductsOperationsStep;
