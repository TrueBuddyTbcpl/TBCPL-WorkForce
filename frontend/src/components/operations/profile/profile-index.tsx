import { useState } from 'react';
import ProfileForm from './ProfileForm';
import ProfilePreview from './ProfilePreview';
import type { CulpritProfile } from './types/profile.types';
import { Users, ArrowLeft } from 'lucide-react';
import { useProfileStorage } from './hooks/useProfileStorage';

const ProfileIndex = () => {
  const [view, setView] = useState<'form' | 'preview'>('form');
  const [profileData, setProfileData] = useState<CulpritProfile | null>(null);
  const { saveProfile, updateProfile } = useProfileStorage();

  const handleFormComplete = (data: CulpritProfile) => {
    try {
      if (data.id && profileData?.id) {
        // Update existing profile
        updateProfile(data.id, data);
      } else {
        // Save new profile
        saveProfile(data);
      }
      setProfileData(data);
      setView('preview');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleEdit = () => {
    setView('form');
  };

  const handleNewProfile = () => {
    setProfileData(null);
    setView('form');
  };

  const handleBack = () => {
    if (window.confirm('Are you sure you want to go back? Unsaved changes will be lost.')) {
      setView('form');
      setProfileData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Page Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Culprit Profile Management</h1>
                <p className="text-sm text-gray-600">Create and manage detailed culprit profiles</p>
              </div>
            </div>
            <div className="flex gap-3">
              {view === 'preview' && (
                <>
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleNewProfile}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Create New Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {view === 'form' ? (
        <ProfileForm 
          onComplete={handleFormComplete}
          initialData={profileData}
        />
      ) : (
        <ProfilePreview 
          data={profileData!}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default ProfileIndex;
