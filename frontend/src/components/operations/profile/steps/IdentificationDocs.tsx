import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { CreditCard, Upload, X } from 'lucide-react';
import { identificationDocsSchema } from '../utils/profileValidation';
import type { IdentificationDocs } from '../types/profile.types';

interface Props {
  initialData?: IdentificationDocs | null;
  onComplete: (data: IdentificationDocs) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const IdentificationDocsStep = ({ initialData, onComplete }: Props) => {
  const [photos, setPhotos] = useState({
    aadhaar: initialData?.aadhaarPhoto || '',
    pan: initialData?.panPhoto || '',
    dl: initialData?.dlPhoto || '',
    passport: initialData?.passportPhoto || '',
    other: initialData?.otherIdPhoto || '',
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<IdentificationDocs>({
    resolver: zodResolver(identificationDocsSchema),
    defaultValues: initialData || {},
  });

  const handlePhotoUpload = (field: keyof typeof photos, photoField: keyof IdentificationDocs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotos(prev => ({ ...prev, [field]: result }));
        setValue(photoField, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (field: keyof typeof photos, photoField: keyof IdentificationDocs) => {
    setPhotos(prev => ({ ...prev, [field]: '' }));
    setValue(photoField, '');
  };

  const onSubmit = (data: IdentificationDocs) => {
    onComplete({
      ...data,
      aadhaarPhoto: photos.aadhaar || undefined,
      panPhoto: photos.pan || undefined,
      dlPhoto: photos.dl || undefined,
      passportPhoto: photos.passport || undefined,
      otherIdPhoto: photos.other || undefined,
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-7 h-7 text-blue-600" />
          Identification Documents
        </h2>
        <p className="text-sm text-gray-600 mt-1">Government IDs and official documents (All optional)</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Employee ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee ID / Reference ID
          </label>
          <input 
            {...register('employeeId')} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter employee or reference ID"
          />
        </div>

        {/* Aadhaar Card */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">Aadhaar Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhaar Number
              </label>
              <input 
                {...register('aadhaarNumber')} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12-digit Aadhaar"
                maxLength={12}
              />
              {errors.aadhaarNumber && (
                <p className="text-red-600 text-xs mt-1">{errors.aadhaarNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Aadhaar Photo
              </label>
              {photos.aadhaar ? (
                <div className="relative">
                  <img src={photos.aadhaar} alt="Aadhaar" className="w-full h-24 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => removePhoto('aadhaar', 'aadhaarPhoto')}
                    className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                  <div className="text-center">
                    <Upload className="w-6 h-6 mx-auto text-gray-400" />
                    <span className="text-xs text-gray-500">Click to upload</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload('aadhaar', 'aadhaarPhoto')} 
                    className="hidden" 
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* PAN Card */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">PAN Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number
              </label>
              <input 
                {...register('panNumber')} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="ABCDE1234F"
                maxLength={10}
              />
              {errors.panNumber && (
                <p className="text-red-600 text-xs mt-1">{errors.panNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PAN Photo
              </label>
              {photos.pan ? (
                <div className="relative">
                  <img src={photos.pan} alt="PAN" className="w-full h-24 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => removePhoto('pan', 'panPhoto')}
                    className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                  <div className="text-center">
                    <Upload className="w-6 h-6 mx-auto text-gray-400" />
                    <span className="text-xs text-gray-500">Click to upload</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload('pan', 'panPhoto')} 
                    className="hidden" 
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Driving License */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">Driving License</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input 
                {...register('drivingLicense')} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="DL number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload License Photo
              </label>
              {photos.dl ? (
                <div className="relative">
                  <img src={photos.dl} alt="DL" className="w-full h-24 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => removePhoto('dl', 'dlPhoto')}
                    className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                  <div className="text-center">
                    <Upload className="w-6 h-6 mx-auto text-gray-400" />
                    <span className="text-xs text-gray-500">Click to upload</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload('dl', 'dlPhoto')} 
                    className="hidden" 
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Passport */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">Passport</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Number
              </label>
              <input 
                {...register('passportNumber')} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="Passport number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Passport Photo
              </label>
              {photos.passport ? (
                <div className="relative">
                  <img src={photos.passport} alt="Passport" className="w-full h-24 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => removePhoto('passport', 'passportPhoto')}
                    className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                  <div className="text-center">
                    <Upload className="w-6 h-6 mx-auto text-gray-400" />
                    <span className="text-xs text-gray-500">Click to upload</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload('passport', 'passportPhoto')} 
                    className="hidden" 
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Other ID */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">Other ID</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Type
                </label>
                <input 
                  {...register('otherIdType')} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Voter ID, Ration Card"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Number
                </label>
                <input 
                  {...register('otherIdNumber')} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ID number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Other ID Photo
              </label>
              {photos.other ? (
                <div className="relative w-48">
                  <img src={photos.other} alt="Other ID" className="w-full h-24 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => removePhoto('other', 'otherIdPhoto')}
                    className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-48 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                  <div className="text-center">
                    <Upload className="w-6 h-6 mx-auto text-gray-400" />
                    <span className="text-xs text-gray-500">Click to upload</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload('other', 'otherIdPhoto')} 
                    className="hidden" 
                  />
                </label>
              )}
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

export default IdentificationDocsStep;
