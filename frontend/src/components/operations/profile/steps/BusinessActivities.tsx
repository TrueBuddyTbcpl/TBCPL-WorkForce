import { useForm } from 'react-hook-form';
import type { BusinessActivities } from '../types/profile.types';

interface Props {
  data?: BusinessActivities;
  onNext: (data: BusinessActivities) => void;
  onBack?: () => void;
}

const BusinessActivitiesStep = ({ data, onNext, onBack }: Props) => {
  const { register, handleSubmit } = useForm<BusinessActivities>({
    defaultValues: data || {},
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Activities</h3>
        
        {/* Retailer Section */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-md font-medium text-gray-800 mb-3">Retailer Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
              <select {...register('retailerStatus')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select Type</option>
                <option value="Individual">Individual</option>
                <option value="Entity">Entity</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Authorization Status</label>
              <select {...register('retailerType')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select Status</option>
                <option value="Authorized">Authorized</option>
                <option value="Unauthorized">Unauthorized</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <input type="text" {...register('retailerDetails')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Additional details" />
            </div>
          </div>
        </div>

        {/* Supplier Section */}
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h4 className="text-md font-medium text-gray-800 mb-3">Supplier Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
              <select {...register('supplierStatus')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select Type</option>
                <option value="Individual">Individual</option>
                <option value="Entity">Entity</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Authorization Status</label>
              <select {...register('supplierType')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select Status</option>
                <option value="Authorized">Authorized</option>
                <option value="Unauthorized">Unauthorized</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <input type="text" {...register('supplierDetails')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Additional details" />
            </div>
          </div>
        </div>

        {/* Manufacturer Section */}
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h4 className="text-md font-medium text-gray-800 mb-3">Manufacturer Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
              <select {...register('manufacturerStatus')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select Type</option>
                <option value="Individual">Individual</option>
                <option value="Entity">Entity</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Authorization Status</label>
              <select {...register('manufacturerType')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select Status</option>
                <option value="Authorized">Authorized</option>
                <option value="Unauthorized">Unauthorized</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <input type="text" {...register('manufacturerDetails')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Additional details" />
            </div>
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

export default BusinessActivitiesStep;
