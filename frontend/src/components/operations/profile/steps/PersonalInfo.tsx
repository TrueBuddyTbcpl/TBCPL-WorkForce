import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import type { PersonalInfo } from '../types/profile.types';

interface Props {
  data?: PersonalInfo;
  onNext: (data: PersonalInfo) => void;
  onBack?: () => void;
}

const PersonalInfoStep = ({ data, onNext, onBack }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PersonalInfo>({
    defaultValues: data || {},
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    data?.profilePhoto || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setValue('profilePhoto', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue('profilePhoto', '');
  };

  // ── field class helper ──────────────────────────────────────────────────────
  const fieldClass = (hasError: boolean) =>
    `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
      hasError
        ? 'border-red-500 bg-red-50 focus:ring-red-400'
        : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6" noValidate>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Information
        </h3>

        {/* Profile Photo Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo
          </label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-photo"
              />
              <label
                htmlFor="profile-photo"
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
              >
                {imagePreview ? 'Change Photo' : 'Upload Photo'}
              </label>
              <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF (MAX. 5MB)</p>
            </div>
          </div>
          <input type="hidden" {...register('profilePhoto')} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('firstName', {
                required: 'First name is required',
                minLength: { value: 2, message: 'Minimum 2 characters' },
              })}
              className={fieldClass(!!errors.firstName)}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <span>⚠</span> {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Middle Name
            </label>
            <input
              type="text"
              {...register('middleName')}
              className={fieldClass(false)}
              placeholder="Enter middle name (optional)"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('lastName', {
                required: 'Last name is required',
                minLength: { value: 2, message: 'Minimum 2 characters' },
              })}
              className={fieldClass(!!errors.lastName)}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <span>⚠</span> {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              {...register('dateOfBirth')}
              className={fieldClass(false)}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              {...register('gender')}
              className={fieldClass(false)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality
            </label>
            <input
              type="text"
              {...register('nationality')}
              className={fieldClass(false)}
              placeholder="Enter nationality"
            />
          </div>

        </div>
      </div>

      {/* Footer Buttons */}
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

export default PersonalInfoStep;
