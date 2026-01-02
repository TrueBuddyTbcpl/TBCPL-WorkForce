import { useForm } from 'react-hook-form';
import type { CurrentStatus } from '../types/profile.types';

interface Props {
  data?: CurrentStatus;
  onNext: (data: CurrentStatus) => void;
  onBack?: () => void;
}

const CurrentStatusStep = ({ data, onNext, onBack }: Props) => {
  const { register, handleSubmit } = useForm<CurrentStatus>({
    defaultValues: data || {
      status: undefined,
      lastKnownLocation: '',
      statusDate: '',
      remarks: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Arrested">Arrested</option>
              <option value="Absconding">Absconding</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          {/* Status Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Date
            </label>
            <input
              type="date"
              {...register('statusDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Known Location */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Known Location
            </label>
            <input
              type="text"
              {...register('lastKnownLocation')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter last known location"
            />
          </div>

          {/* Remarks */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks/Additional Information
            </label>
            <textarea
              {...register('remarks')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional remarks or information about current status..."
            />
          </div>
        </div>

        {/* Status Information Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Status Guidelines:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li><strong>Active:</strong> Currently engaged in activities</li>
            <li><strong>Inactive:</strong> No recent activity detected</li>
            <li><strong>Arrested:</strong> Currently in custody</li>
            <li><strong>Absconding:</strong> Evading authorities</li>
            <li><strong>Unknown:</strong> Status cannot be determined</li>
          </ul>
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
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-auto"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};

export default CurrentStatusStep;
