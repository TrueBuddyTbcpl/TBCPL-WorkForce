import { User, MapPin, Phone, Mail } from 'lucide-react';
import type { CulpritProfile } from '../types/profile.types';

interface Props {
  data: CulpritProfile;
}

const ProfileHeader = ({ data }: Props) => {
  const fullName = `${data.personal.firstName} ${data.personal.middleName ? data.personal.middleName + ' ' : ''}${data.personal.lastName}`;
  
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
      {/* Cover Background */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
      
      {/* Profile Content */}
      <div className="px-8 pb-8">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
          {/* Profile Photo */}
          <div className="relative">
            {data.personal.profilePhoto ? (
              <img
                src={data.personal.profilePhoto}
                alt={fullName}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <User className="w-16 h-16 text-gray-500" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
          </div>

          {/* Name and Basic Info */}
          <div className="flex-1 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{data.personal.gender}, {calculateAge(data.personal.dateOfBirth)} years</span>
              </div>
              {data.personal.bloodGroup && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Blood Group:</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-medium">{data.personal.bloodGroup}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="font-semibold">Nationality:</span>
                <span>{data.personal.nationality}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Phone</p>
              <p className="text-sm font-semibold text-gray-900">{data.contact.primaryPhone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="bg-green-600 p-2 rounded-lg">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Email</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{data.contact.primaryEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="bg-purple-600 p-2 rounded-lg">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Location</p>
              <p className="text-sm font-semibold text-gray-900">{data.address.city}, {data.address.state}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
