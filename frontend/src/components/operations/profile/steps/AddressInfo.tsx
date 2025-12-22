import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { addressInfoSchema } from '../utils/profileValidation';
import { indianStates } from '../data/profileOptions';
import type { AddressInfo } from '../types/profile.types';

interface Props {
  initialData?: AddressInfo | null;
  onComplete: (data: AddressInfo) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const AddressInfoStep = ({ initialData, onComplete }: Props) => {
  const [sameAddress, setSameAddress] = useState(initialData?.permanentAddressSame ?? false);

  const { register, handleSubmit } = useForm<AddressInfo>({
    resolver: zodResolver(addressInfoSchema),
    defaultValues: initialData || {
      country: 'India',
      permanentAddressSame: false,
    },
  });

  const onSubmit = (data: AddressInfo) => {
    if (sameAddress) {
      data.permanentAddress = undefined;
    }
    onComplete(data);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-7 h-7 text-blue-600" />
          Address Information
        </h2>
        <p className="text-sm text-gray-600 mt-1">Current and permanent address details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Address */}
        <div className="border-l-4 border-blue-600 pl-4">
          <h3 className="font-semibold text-gray-900 mb-4">Current Address</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1
              </label>
              <input
                {...register('addressLine1')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="House/Flat No., Street Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2
              </label>
              <input
                {...register('addressLine2')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Locality, Area"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  {...register('city')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  {...register('state')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select state</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  {...register('pincode')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                {...register('country')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., India"
              />
            </div>
          </div>
        </div>

        {/* Permanent Address Checkbox */}
        <div className="flex items-center bg-blue-50 p-4 rounded-lg">
          <input
            type="checkbox"
            {...register('permanentAddressSame')}
            checked={sameAddress}
            onChange={(e) => setSameAddress(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-3 text-sm font-medium text-gray-700">
            Permanent address is same as current address
          </label>
        </div>

        {/* Permanent Address */}
        {!sameAddress && (
          <div className="border-l-4 border-green-600 pl-4">
            <h3 className="font-semibold text-gray-900 mb-4">Permanent Address</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1
                </label>
                <input
                  {...register('permanentAddress.addressLine1')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="House/Flat No., Street Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  {...register('permanentAddress.addressLine2')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Locality, Area"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    {...register('permanentAddress.city')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    {...register('permanentAddress.state')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select state</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    {...register('permanentAddress.pincode')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  {...register('permanentAddress.country')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., India"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Continue to Contact Information
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressInfoStep;
