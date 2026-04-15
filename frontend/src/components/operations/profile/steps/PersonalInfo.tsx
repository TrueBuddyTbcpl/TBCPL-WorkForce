import { useForm, Controller } from 'react-hook-form';
import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import type { PersonalInfo } from '../types/profile.types';
import apiClient from '../../../../services/api/apiClient';
import DropdownWithOther from '../../../../components/ui/DropdownWithOther';

interface Props {
  data?: PersonalInfo;
  onNext: (data: PersonalInfo) => void;
  onBack?: () => void;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const PersonalInfoStep = ({ data, onNext, onBack }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<PersonalInfo>({
    defaultValues: data || {},
  });

  const [imagePreview, setImagePreview] = useState<string | null>(data?.profilePhoto || null);
  const [uploading, setUploading]       = useState(false);
  const [uploadError, setUploadError]   = useState<string | null>(null);
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Invalid file type. Allowed: JPG, PNG, WEBP.');
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError('File size exceeds 5 MB limit.');
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'profiles/photos');

      const { data: uploadResult } = await apiClient.post<{
        url: string; publicId: string; format: string; size: number;
      }>('/operation/profiles/upload-image', formData);

      setImagePreview(uploadResult.url);
      setValue('profilePhoto', uploadResult.url, { shouldDirty: true });
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setUploadError(null);
    setValue('profilePhoto', '', { shouldDirty: true });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fieldClass = (hasError: boolean) =>
    `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
      hasError ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6" noValidate>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

        {/* ── Profile Photo Upload ─────────────────────────────────────── */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32 flex-shrink-0">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Profile Preview" className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300" />
                  {!uploading && (
                    <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors" title="Remove photo">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {uploading ? <Loader2 className="w-8 h-8 text-blue-500 animate-spin" /> : <Upload className="w-8 h-8 text-gray-400" />}
                </div>
              )}
              {uploading && imagePreview && (
                <div className="absolute inset-0 bg-white/70 rounded-lg flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageChange} className="hidden" id="profile-photo" disabled={uploading} />
              <label htmlFor="profile-photo" className={`cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg inline-block text-sm transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}>
                {uploading ? 'Uploading...' : imagePreview ? 'Change Photo' : 'Upload Photo'}
              </label>
              <p className="text-xs text-gray-500">JPG, PNG or WEBP · Max 5 MB</p>
              {uploadError && <p className="text-xs text-red-600 flex items-center gap-1"><span>⚠</span> {uploadError}</p>}
            </div>
          </div>
          <input type="hidden" {...register('profilePhoto')} />
        </div>

        {/* ── Form Fields ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
            <input type="text" {...register('firstName', { required: 'First name is required', minLength: { value: 2, message: 'Minimum 2 characters' } })} className={fieldClass(!!errors.firstName)} placeholder="Enter first name" />
            {errors.firstName && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠</span> {errors.firstName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
            <input type="text" {...register('middleName')} className={fieldClass(false)} placeholder="Enter middle name (optional)" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input type="text" {...register('lastName', { minLength: { value: 2, message: 'Minimum 2 characters' } })} className={fieldClass(!!errors.lastName)} placeholder="Enter last name (optional)" />
            {errors.lastName && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠</span> {errors.lastName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input type="date" {...register('dateOfBirth')} className={fieldClass(false)} />
          </div>

          {/* ── CHANGED: DropdownWithOther replaces static <select> ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <Controller
              name="gender"
              control={control}
              rules={{ required: 'Gender is required' }}
              render={({ field }) => (
                <DropdownWithOther
                  fieldName="gender"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Gender"
                  className={fieldClass(!!errors.gender)}
                />
              )}
            />
            {errors.gender && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <span>⚠</span> {errors.gender.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
            <input type="text" {...register('nationality')} className={fieldClass(false)} placeholder="Enter nationality" />
          </div>

        </div>
      </div>

      <div className="flex justify-between">
        {onBack && (
          <button type="button" onClick={onBack} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Back</button>
        )}
        <button type="submit" disabled={uploading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Next Step
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoStep;