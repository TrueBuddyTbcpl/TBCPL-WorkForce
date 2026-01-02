import { Eye, Edit, User } from 'lucide-react';
import type { CulpritProfile } from './types/profile.types';

interface Props {
  profile: CulpritProfile;
  onEdit: () => void;
  onView?: () => void;
}

const ProfileCard = ({ profile, onEdit, onView }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
      <div className="flex items-start gap-4 mb-4">
        {profile.personal.profilePhoto ? (
          <img
            src={profile.personal.profilePhoto}
            alt={profile.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{profile.name}</h3>
          <p className="text-sm text-gray-600">ID: {profile.id}</p>
          <div className="mt-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                profile.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : profile.status === 'Arrested'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {profile.currentStatus?.status || profile.status}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4">
        {profile.contact?.primaryPhone && (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium">Phone:</span>
            <span>{profile.contact.primaryPhone}</span>
          </div>
        )}
        {profile.address?.city && (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium">Location:</span>
            <span>
              {profile.address.city}
              {profile.address.state && `, ${profile.address.state}`}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t">
        {onView && (
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
        )}
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
