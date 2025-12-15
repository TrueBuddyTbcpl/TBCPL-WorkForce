import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone } from 'lucide-react';
import { contactInfoSchema } from '../utils/profileValidation';
import { relationOptions } from '../data/profileOptions';
import type { ContactInfo } from '../types/profile.types';

interface Props {
  initialData?: ContactInfo | null;
  onComplete: (data: ContactInfo) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const ContactInfoStep = ({ initialData, onComplete }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactInfo>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: initialData || {},
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Phone className="w-7 h-7 text-blue-600" />
          Contact Information
        </h2>
        <p className="text-sm text-gray-600 mt-1">Phone numbers, email addresses, and emergency contacts</p>
      </div>

      <form onSubmit={handleSubmit(onComplete)} className="space-y-6">
        {/* Phone Numbers */}
        <div className="border-l-4 border-blue-600 pl-4">
          <h3 className="font-semibold text-gray-900 mb-4">Phone Numbers</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register('primaryPhone')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10-digit mobile number"
                maxLength={10}
              />
              {errors.primaryPhone && (
                <p className="text-red-600 text-xs mt-1">{errors.primaryPhone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Phone
              </label>
              <input
                type="tel"
                {...register('secondaryPhone')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Alternate number"
                maxLength={10}
              />
              {errors.secondaryPhone && (
                <p className="text-red-600 text-xs mt-1">{errors.secondaryPhone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Email Addresses */}
        <div className="border-l-4 border-green-600 pl-4">
          <h3 className="font-semibold text-gray-900 mb-4">Email Addresses</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('primaryEmail')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@example.com"
              />
              {errors.primaryEmail && (
                <p className="text-red-600 text-xs mt-1">{errors.primaryEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Email
              </label>
              <input
                type="email"
                {...register('secondaryEmail')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="alternate@example.com"
              />
              {errors.secondaryEmail && (
                <p className="text-red-600 text-xs mt-1">{errors.secondaryEmail.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="border-l-4 border-orange-600 pl-4">
          <h3 className="font-semibold text-gray-900 mb-4">Emergency Contact (Optional)</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person Name
              </label>
              <input
                {...register('emergencyContactName')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full name of emergency contact"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  {...register('emergencyContactPhone')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10-digit mobile"
                  maxLength={10}
                />
                {errors.emergencyContactPhone && (
                  <p className="text-red-600 text-xs mt-1">{errors.emergencyContactPhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship
                </label>
                <select
                  {...register('emergencyContactRelation')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select relationship</option>
                  {relationOptions.map(relation => (
                    <option key={relation} value={relation}>{relation}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Continue to Additional Information
          </button>

        </div>
      </form>
    </div>
  );
};

export default ContactInfoStep;
