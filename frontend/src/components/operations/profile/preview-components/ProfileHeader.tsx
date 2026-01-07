import { format } from 'date-fns';
import type { ProfileData } from '../types/profile.types';

interface Props {
  data: ProfileData;
}

const ProfileHeader = ({ data }: Props) => {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'arrested': return 'bg-red-100 text-red-800';
      case 'absconding': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle undefined values with fallbacks
  const firstName = data.personal?.firstName || 'N/A';
  const lastName = data.personal?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  
  const formattedDOB = data.personal?.dateOfBirth 
    ? format(new Date(data.personal.dateOfBirth), 'dd MMM yyyy')
    : 'N/A';

  const gender = data.personal?.gender || 'N/A';
  const email = data.contact?.primaryEmail || data.contact?.secondaryEmail || 'N/A';
  const phone = data.contact?.primaryPhone || data.contact?.secondaryPhone || 'N/A';
  const city = data.address?.city || 'N/A';
  const state = data.address?.state || 'N/A';
  const status = data.currentStatus?.status || 'Unknown';
  
  const createdDate = data.createdAt 
    ? format(new Date(data.createdAt), 'dd MMM yyyy')
    : 'N/A';

  // Get initials for avatar
  const getInitials = () => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Profile Photo or Initials */}
          {data.personal?.profilePhoto ? (
            <img 
              src={data.personal.profilePhoto} 
              alt={fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {getInitials()}
            </div>
          )}
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {fullName}
            </h1>
            <p className="text-lg text-blue-600 font-medium mt-1">
              Profile ID: {data.id || 'N/A'}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)}`}>
                {status}
              </span>
              {data.personal?.nationality && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  {data.personal.nationality}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div>
          <p className="text-sm text-gray-600">Date of Birth</p>
          <p className="text-base font-medium text-gray-900">{formattedDOB}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Gender</p>
          <p className="text-base font-medium text-gray-900">{gender}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="text-base font-medium text-gray-900">{email}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Phone</p>
          <p className="text-base font-medium text-gray-900">{phone}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Location</p>
          <p className="text-base font-medium text-gray-900">{city}, {state}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Profile Created</p>
          <p className="text-base font-medium text-gray-900">{createdDate}</p>
        </div>

        {/* Identification Numbers */}
        {data.identification?.aadhaarNumber && (
          <div>
            <p className="text-sm text-gray-600">Aadhaar Number</p>
            <p className="text-base font-medium text-gray-900">
              {data.identification.aadhaarNumber}
            </p>
          </div>
        )}

        {data.identification?.panNumber && (
          <div>
            <p className="text-sm text-gray-600">PAN Number</p>
            <p className="text-base font-medium text-gray-900">
              {data.identification.panNumber}
            </p>
          </div>
        )}

        {data.identification?.employeeId && (
          <div>
            <p className="text-sm text-gray-600">Employee ID</p>
            <p className="text-base font-medium text-gray-900">
              {data.identification.employeeId}
            </p>
          </div>
        )}
      </div>

      {/* Physical Attributes (if available) */}
      {data.physical && (data.physical.height || data.physical.eyeColor || data.physical.identificationMarks) && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Physical Attributes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.physical.height && (
              <div>
                <p className="text-sm text-gray-600">Height</p>
                <p className="text-base font-medium text-gray-900">{data.physical.height}</p>
              </div>
            )}
            
            {data.physical.weight && (
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <p className="text-base font-medium text-gray-900">{data.physical.weight}</p>
              </div>
            )}
            
            {data.physical.eyeColor && (
              <div>
                <p className="text-sm text-gray-600">Eye Color</p>
                <p className="text-base font-medium text-gray-900">{data.physical.eyeColor}</p>
              </div>
            )}
            
            {data.physical.hairColor && (
              <div>
                <p className="text-sm text-gray-600">Hair Color</p>
                <p className="text-base font-medium text-gray-900">{data.physical.hairColor}</p>
              </div>
            )}
          </div>
          
          {data.physical.identificationMarks && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Identification Marks</p>
              <p className="text-base font-medium text-gray-900">{data.physical.identificationMarks}</p>
            </div>
          )}
        </div>
      )}

      {/* Emergency Contact (if available) */}
      {data.contact?.emergencyContactName && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-base font-medium text-gray-900">
                {data.contact.emergencyContactName}
              </p>
            </div>
            
            {data.contact.emergencyContactPhone && (
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-base font-medium text-gray-900">
                  {data.contact.emergencyContactPhone}
                </p>
              </div>
            )}
            
            {data.contact.emergencyContactRelation && (
              <div>
                <p className="text-sm text-gray-600">Relation</p>
                <p className="text-base font-medium text-gray-900">
                  {data.contact.emergencyContactRelation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tags (if available) */}
      {data.additional?.tags && data.additional.tags.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {data.additional.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
