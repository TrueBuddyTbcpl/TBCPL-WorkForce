import { useState } from 'react';
import { Edit, Printer, Share2, Briefcase } from 'lucide-react';
import ProfileHeader from './preview-components/ProfileHeader';
import ProfileCard from './preview-components/ProfileCard';
import InfoSection from './preview-components/InfoSection';
import EditProfileModal from './preview-components/EditProfileModal';
import type { CulpritProfile } from './types/profile.types';
import { format } from 'date-fns';
import { availableCases } from './data/caseOptions';

interface Props {
  data: CulpritProfile;
  onEdit: () => void;
}

const ProfilePreview = ({ data, onEdit }: Props) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // ✅ Add null checks
  if (!data || !data.personal || !data.address || !data.contact || !data.additional) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No profile data available</p>
          <button
            onClick={onEdit}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

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
        </div>

        {/* Linked Cases */}
        {data.additional.linkedCases && data.additional.linkedCases.length > 0 && (
          <div className="mt-6">
            <ProfileCard title={`Linked Cases (${data.additional.linkedCases.length})`}>
              <div className="space-y-3">
                {data.additional.linkedCases.map((caseId) => {
                  const caseInfo = availableCases.find(c => c.value === caseId);
                  return caseInfo ? (
                    <div
                      key={caseId}
                      className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-blue-600" />
                          <p className="text-sm font-semibold text-gray-900">
                            {caseInfo.value}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-600">
                            Type: {caseInfo.caseType}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              caseInfo.status === 'Open'
                                ? 'bg-green-100 text-green-800'
                                : caseInfo.status === 'Closed'
                                ? 'bg-gray-100 text-gray-800'
                                : caseInfo.status === 'Under Investigation'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {caseInfo.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            Reported: {new Date(caseInfo.dateReported).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </ProfileCard>
          </div>
        )}

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
