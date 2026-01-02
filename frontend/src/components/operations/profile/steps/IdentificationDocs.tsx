import { useForm } from 'react-hook-form';
import type { IdentificationDocs } from '../types/profile.types';

interface Props {
  data?: IdentificationDocs;
  onNext: (data: IdentificationDocs) => void;
  onBack?: () => void;
}

const IdentificationDocsStep = ({ data, onNext, onBack }: Props) => {
  const { register, handleSubmit } = useForm<IdentificationDocs>({
    defaultValues: data || {},
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Identification Documents</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employee ID */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <input
              type="text"
              {...register('employeeId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter employee ID"
            />
          </div>

          {/* Aadhaar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
            <input
              type="text"
              {...register('aadhaarNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Aadhaar number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Photo URL</label>
            <input
              type="text"
              {...register('aadhaarPhoto')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter photo URL or upload"
            />
          </div>

          {/* PAN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input
              type="text"
              {...register('panNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter PAN number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Photo URL</label>
            <input
              type="text"
              {...register('panPhoto')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter photo URL or upload"
            />
          </div>

          {/* Driving License */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driving License Number</label>
            <input
              type="text"
              {...register('drivingLicense')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter DL number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DL Photo URL</label>
            <input
              type="text"
              {...register('dlPhoto')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter photo URL or upload"
            />
          </div>

          {/* Passport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
            <input
              type="text"
              {...register('passportNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter passport number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passport Photo URL</label>
            <input
              type="text"
              {...register('passportPhoto')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter photo URL or upload"
            />
          </div>

          {/* Other ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Other ID Type</label>
            <input
              type="text"
              {...register('otherIdType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Voter ID, Ration Card"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Other ID Number</label>
            <input
              type="text"
              {...register('otherIdNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter ID number"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Other ID Photo URL</label>
            <input
              type="text"
              {...register('otherIdPhoto')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter photo URL or upload"
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

export default IdentificationDocsStep;
