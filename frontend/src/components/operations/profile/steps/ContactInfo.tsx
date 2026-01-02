import { useForm } from 'react-hook-form';
import type { ContactInfo } from '../types/profile.types';

interface Props {
  data?: ContactInfo;
  onNext: (data: ContactInfo) => void;
  onBack?: () => void;
}

const ContactInfoStep = ({ data, onNext, onBack }: Props) => {
  const { register, handleSubmit } = useForm<ContactInfo>({
    defaultValues: data || {},
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
            <input
              type="tel"
              {...register('primaryPhone')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter primary phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone</label>
            <input
              type="tel"
              {...register('secondaryPhone')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter secondary phone (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email</label>
            <input
              type="email"
              {...register('primaryEmail')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter primary email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Email</label>
            <input
              type="email"
              {...register('secondaryEmail')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter secondary email (optional)"
            />
          </div>
        </div>

        <h4 className="text-md font-semibold text-gray-800 mb-3 mt-6">Emergency Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-red-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
            <input
              type="text"
              {...register('emergencyContactName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Emergency contact name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              {...register('emergencyContactPhone')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Emergency contact phone"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
            <input
              type="text"
              {...register('emergencyContactRelation')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="e.g., Father, Mother, Spouse"
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

export default ContactInfoStep;
