import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { CurrentStatus } from '../types/profile.types';
import DropdownWithOther from '../../../ui/DropdownWithOther';

interface Props {
  data?: CurrentStatus;
  onNext: (data: CurrentStatus) => void;
  onBack?: () => void;
}

const CurrentStatusStep = ({ data, onNext, onBack }: Props) => {
  const { register, control, handleSubmit } = useForm<CurrentStatus>({
    defaultValues: data || { status: undefined, lastKnownLocation: '', statusDate: '', remarks: '' },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* ── CHANGED: DropdownWithOther replaces static <select> ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <DropdownWithOther
                  fieldName="profileStatus"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Status"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Date</label>
            <input
              type="date"
              {...register('statusDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Known Location</label>
            <input
              type="text"
              {...register('lastKnownLocation')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter last known location"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              {...register('remarks')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional remarks..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        {onBack && (
          <button type="button" onClick={onBack} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Back
          </button>
        )}
        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-auto">
          Next Step
        </button>
      </div>
    </form>
  );
};

export default CurrentStatusStep;