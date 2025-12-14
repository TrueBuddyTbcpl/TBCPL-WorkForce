import { useState } from 'react';
import { Edit, Printer, Share2 } from 'lucide-react';
import ProfileHeader from './preview-components/ProfileHeader';
import ProfileCard from './preview-components/ProfileCard';
import InfoSection from './preview-components/InfoSection';
import EditProfileModal from './preview-components/EditProfileModal';
import type { CulpritProfile } from './types/profile.types';
import { format } from 'date-fns';

interface Props {
  data: CulpritProfile;
  onEdit: () => void;
}

const ProfilePreview = ({ data, onEdit }: Props) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    alert('Share functionality will be implemented soon!');
  };

  const handleSectionEdit = (section: string) => {
    setEditingSection(section);
    setIsEditModalOpen(true);
  };

  const getRiskLevelColor = (level?: string) => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex justify-between items-center print:hidden sticky top-4 z-10">
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Full Profile
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Profile ID:</span>
            <span className="font-mono font-semibold text-blue-600">{data.id}</span>
          </div>
        </div>

        {/* Profile Header */}
        <ProfileHeader data={data} />

        {/* Status and Risk Badge */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  data.status === 'Active' ? 'bg-green-100 text-green-800' :
                  data.status === 'Archived' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {data.status}
                </span>
              </div>
              {data.additional.riskLevel && (
                <div>
                  <span className="text-sm text-gray-600">Risk Level:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold border ${getRiskLevelColor(data.additional.riskLevel)}`}>
                    {data.additional.riskLevel}
                  </span>
                </div>
              )}
            </div>

            <div className="text-right text-sm text-gray-600">
              <div>Created: {format(new Date(data.createdAt), 'dd MMM yyyy, hh:mm a')}</div>
              <div>Last Updated: {format(new Date(data.lastUpdated), 'dd MMM yyyy, hh:mm a')}</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {data.additional.tags && data.additional.tags.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {data.additional.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <ProfileCard
            title="Personal Information"
            onEdit={() => handleSectionEdit('personal')}
          >
            <InfoSection
              items={[
                { label: 'First Name', value: data.personal.firstName },
                { label: 'Middle Name', value: data.personal.middleName || 'N/A' },
                { label: 'Last Name', value: data.personal.lastName },
                { label: 'Date of Birth', value: format(new Date(data.personal.dateOfBirth), 'dd MMM yyyy') },
                { label: 'Gender', value: data.personal.gender },
                { label: 'Blood Group', value: data.personal.bloodGroup || 'N/A' },
                { label: 'Nationality', value: data.personal.nationality },
              ]}
            />
          </ProfileCard>

          {/* Physical Attributes */}
          <ProfileCard
            title="Physical Attributes"
            onEdit={() => handleSectionEdit('physical')}
          >
            <InfoSection
              items={[
                { label: 'Height', value: `${data.physical.height} cm` },
                { label: 'Weight', value: `${data.physical.weight} kg` },
                { label: 'Eye Color', value: data.physical.eyeColor || 'N/A' },
                { label: 'Hair Color', value: data.physical.hairColor || 'N/A' },
                { label: 'Skin Tone', value: data.physical.skinTone || 'N/A' },
              ]}
            />
            {data.physical.identificationMarks && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs font-semibold text-yellow-800 mb-1">Identification Marks:</p>
                <p className="text-sm text-yellow-900">{data.physical.identificationMarks}</p>
              </div>
            )}
            {data.physical.disabilities && (
              <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs font-semibold text-orange-800 mb-1">Disabilities:</p>
                <p className="text-sm text-orange-900">{data.physical.disabilities}</p>
              </div>
            )}
          </ProfileCard>

          {/* Current Address */}
          <ProfileCard
            title="Current Address"
            onEdit={() => handleSectionEdit('address')}
          >
            <div className="space-y-2 text-sm text-gray-700">
              <p>{data.address.addressLine1}</p>
              {data.address.addressLine2 && <p>{data.address.addressLine2}</p>}
              <p>{data.address.city}, {data.address.state} - {data.address.pincode}</p>
              <p>{data.address.country}</p>
            </div>
          </ProfileCard>

          {/* Permanent Address */}
          {!data.address.permanentAddressSame && data.address.permanentAddress && (
            <ProfileCard
              title="Permanent Address"
              onEdit={() => handleSectionEdit('address')}
            >
              <div className="space-y-2 text-sm text-gray-700">
                <p>{data.address.permanentAddress.addressLine1}</p>
                {data.address.permanentAddress.addressLine2 && <p>{data.address.permanentAddress.addressLine2}</p>}
                <p>{data.address.permanentAddress.city}, {data.address.permanentAddress.state} - {data.address.permanentAddress.pincode}</p>
                <p>{data.address.permanentAddress.country}</p>
              </div>
            </ProfileCard>
          )}

          {/* Contact Information */}
          <ProfileCard
            title="Contact Information"
            onEdit={() => handleSectionEdit('contact')}
          >
            <InfoSection
              items={[
                { label: 'Primary Phone', value: data.contact.primaryPhone },
                { label: 'Secondary Phone', value: data.contact.secondaryPhone || 'N/A' },
                { label: 'Primary Email', value: data.contact.primaryEmail },
                { label: 'Secondary Email', value: data.contact.secondaryEmail || 'N/A' },
              ]}
            />
            {data.contact.emergencyContactName && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-semibold text-red-800 mb-2">Emergency Contact:</p>
                <InfoSection
                  items={[
                    { label: 'Name', value: data.contact.emergencyContactName },
                    { label: 'Phone', value: data.contact.emergencyContactPhone || 'N/A' },
                    { label: 'Relation', value: data.contact.emergencyContactRelation || 'N/A' },
                  ]}
                />
              </div>
            )}
          </ProfileCard>

          {/* Identification Documents */}
          <ProfileCard
            title="Identification Documents"
            onEdit={() => handleSectionEdit('identification')}
          >
            <div className="space-y-3">
              {data.identification.employeeId && (
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Employee ID:</span>
                  <span className="text-sm text-gray-900">{data.identification.employeeId}</span>
                </div>
              )}
              {data.identification.aadhaarNumber && (
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Aadhaar:</span>
                  <span className="text-sm text-gray-900 font-mono">{data.identification.aadhaarNumber}</span>
                </div>
              )}
              {data.identification.panNumber && (
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">PAN:</span>
                  <span className="text-sm text-gray-900 font-mono">{data.identification.panNumber}</span>
                </div>
              )}
              {data.identification.drivingLicense && (
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Driving License:</span>
                  <span className="text-sm text-gray-900">{data.identification.drivingLicense}</span>
                </div>
              )}
              {data.identification.passportNumber && (
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Passport:</span>
                  <span className="text-sm text-gray-900 font-mono">{data.identification.passportNumber}</span>
                </div>
              )}
              {data.identification.otherIdType && (
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">{data.identification.otherIdType}:</span>
                  <span className="text-sm text-gray-900">{data.identification.otherIdNumber}</span>
                </div>
              )}
            </div>

            {/* ID Photos */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {data.identification.aadhaarPhoto && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Aadhaar</p>
                  <img src={data.identification.aadhaarPhoto} alt="Aadhaar" className="w-full h-24 object-cover rounded border" />
                </div>
              )}
              {data.identification.panPhoto && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">PAN</p>
                  <img src={data.identification.panPhoto} alt="PAN" className="w-full h-24 object-cover rounded border" />
                </div>
              )}
              {data.identification.dlPhoto && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Driving License</p>
                  <img src={data.identification.dlPhoto} alt="DL" className="w-full h-24 object-cover rounded border" />
                </div>
              )}
              {data.identification.passportPhoto && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Passport</p>
                  <img src={data.identification.passportPhoto} alt="Passport" className="w-full h-24 object-cover rounded border" />
                </div>
              )}
            </div>
          </ProfileCard>
        </div>

        {/* Additional Information - Full Width */}
        {(data.additional.notes || data.additional.behavioralNotes) && (
          <div className="mt-6">
            <ProfileCard
              title="Additional Information"
              onEdit={() => handleSectionEdit('additional')}
            >
              {data.additional.notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">General Notes:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                    {data.additional.notes}
                  </p>
                </div>
              )}
              {data.additional.behavioralNotes && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Behavioral Observations:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                    {data.additional.behavioralNotes}
                  </p>
                </div>
              )}
            </ProfileCard>
          </div>
        )}

        {/* Additional Photos */}
        {data.additional.additionalPhotos && data.additional.additionalPhotos.length > 0 && (
          <div className="mt-6">
            <ProfileCard title="Additional Photos">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.additional.additionalPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Additional ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => window.open(photo, '_blank')}
                  />
                ))}
              </div>
            </ProfileCard>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 print:mt-12">
          <p>This profile was generated by Culprit Profile Management System</p>
          <p className="mt-1">Created by: {data.createdBy} | Profile ID: {data.id}</p>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          section={editingSection}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfilePreview;
