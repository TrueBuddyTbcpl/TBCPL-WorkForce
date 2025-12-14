import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Upload, User, X } from 'lucide-react';
import { personalInfoSchema } from '../utils/profileValidation';
import { genderOptions, bloodGroupOptions } from '../data/profileOptions';
import type { PersonalInfo } from '../types/profile.types';

interface Props {
  initialData?: PersonalInfo | null;
  onComplete: (data: PersonalInfo) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const PersonalInfoStep = ({ initialData, onComplete }: Props) => {
  const [photo, setPhoto] = useState<string | undefined>(initialData?.profilePhoto);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialData || {
      gender: 'Male',
      nationality: 'Indian',
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
        setValue('profilePhoto', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(undefined);
    setValue('profilePhoto', undefined);
  };

  const onSubmit = (data: PersonalInfo) => {
    onComplete({ ...data, profilePhoto: photo });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-7 h-7 text-blue-600" />
          Personal Information
        </h2>
        <p className="text-sm text-gray-600 mt-1">Enter basic personal details of the individual</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo Upload */}
        <div className="flex justify-center">
          <div className="relative">
            {photo ? (
              <div className="relative">
                <img 
                  src={photo} 
                  alt="Profile" 
                  className="w-36 h-36 rounded-full object-cover border-4 border-blue-200 shadow-lg" 
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-dashed border-gray-300">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-600 p-3 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
              <Upload className="w-5 h-5 text-white" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                className="hidden" 
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input 
              {...register('firstName')} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-red-600 text-xs mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Middle Name
            </label>
            <input 
              {...register('middleName')} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter middle name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input 
              {...register('lastName')} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-red-600 text-xs mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input 
              type="date"
              {...register('dateOfBirth')} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.dateOfBirth && (
              <p className="text-red-600 text-xs mt-1">{errors.dateOfBirth.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select 
              {...register('gender')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {genderOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="text-red-600 text-xs mt-1">{errors.gender.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>
            <select 
              {...register('bloodGroup')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select blood group</option>
              {bloodGroupOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nationality <span className="text-red-500">*</span>
            </label>
            <input 
              {...register('nationality')} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Indian"
            />
            {errors.nationality && (
              <p className="text-red-600 text-xs mt-1">{errors.nationality.message}</p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Continue to Physical Attributes
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoStep;
