import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { ContactInfo } from '../types/profile.types';

interface Props {
  data?: ContactInfo;
  onNext: (data: ContactInfo) => void;
  onBack?: () => void;
}

const ContactInfoStep = ({ data, onNext, onBack }: Props) => {
  const { register, handleSubmit, control } = useForm<ContactInfo>({
    defaultValues: {
      primaryPhone:    data?.primaryPhone    ?? '',
      secondaryPhone:  data?.secondaryPhone  ?? '',
      primaryEmail:    data?.primaryEmail    ?? '',
      secondaryEmail:  data?.secondaryEmail  ?? '',
      // ✅ If no emergency contacts exist, start with one empty row
      emergencyContacts: data?.emergencyContacts?.length
        ? data.emergencyContacts
        : [{ name: '', phone: '', relation: '' }],
    },
  });

  // ✅ useFieldArray manages dynamic rows
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'emergencyContacts',
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">

        {/* ── Primary Contact Details ─────────────────────────────── */}
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

        {/* ── Emergency Contacts — Dynamic List ───────────────────── */}
        <div className="flex items-center justify-between mt-6 mb-3">
          <h4 className="text-md font-semibold text-gray-800">
            Emergency Contacts
            <span className="ml-2 text-xs font-normal text-gray-500">
              ({fields.length} added)
            </span>
          </h4>
          <button
            type="button"
            onClick={() => append({ name: '', phone: '', relation: '' })}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm hover:bg-red-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-red-50 rounded-lg border border-red-100 relative"
            >
              {/* Row number badge */}
              <div className="absolute -top-2.5 left-3 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full font-medium">
                #{index + 1}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  {...register(`emergencyContacts.${index}.name`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Emergency contact name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register(`emergencyContacts.${index}.phone`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Emergency contact phone"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relation
                  </label>
                  <input
                    type="text"
                    {...register(`emergencyContacts.${index}.relation`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="e.g., Father, Brother"
                  />
                </div>

                {/* ✅ Remove button — only show if more than 1 row */}
                {fields.length > 1 && (
                  <div className="flex items-end pb-0.5">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                      title="Remove this emergency contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Navigation Buttons ───────────────────────────────────── */}
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