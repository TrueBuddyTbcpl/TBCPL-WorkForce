import { Eye, Edit, Trash2, User } from 'lucide-react';
import type { ApiProfileDetail } from '../../../services/api/profileApi';

interface Props {
  profile: ApiProfileDetail;
  onEdit: () => void;
  onView?: () => void;
  onDelete?: () => void;
}

const ProfileCard = ({ profile, onEdit, onView, onDelete }: Props) => {
  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'ARRESTED': return 'bg-red-100 text-red-800';
      case 'ABSCONDING': return 'bg-orange-100 text-orange-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
      <div className="flex items-start gap-4 mb-4">
        {(() => {
          // 🔍 STEP 1: Add this log once, check console, find where photo lives
          console.log('📸 photo fields:', {
            fromPersonalInfo: profile.personalInfo?.profilePhoto,
            fromRoot: (profile as any).profilePhoto,
            fromPhotoUrl: (profile as any).photoUrl,
          });

          const photoUrl =
            profile.personalInfo?.profilePhoto ||   // ← most likely correct
            (profile as any).profilePhoto ||        // ← if stored at root level
            (profile as any).photoUrl;              // ← alternate field name

          return photoUrl ? (
            <img
              src={photoUrl}
              alt={profile.name}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                // Graceful fallback if URL is broken/expired
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                (e.currentTarget.nextElementSibling as HTMLElement)?.removeAttribute('style');
              }}
            />
          ) : (
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
          );
        })()}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">{profile.name}</h3>
          <p className="text-sm text-gray-500">{profile.profileNumber}</p>
          <div className="mt-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
              {profile.currentStatus?.status || profile.status}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4">
        {profile.contactInfo?.primaryPhone && (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium">Phone:</span>
            <span>{profile.contactInfo.primaryPhone}</span>
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
        {profile.createdAt && (
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <span>Created: {new Date(profile.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t">
        {onView && (
          <button onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <Eye className="w-4 h-4" /> View
          </button>
        )}
        <button onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
          <Edit className="w-4 h-4" /> Edit
        </button>
        {onDelete && (
          <button onClick={onDelete}
            className="flex items-center justify-center px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
