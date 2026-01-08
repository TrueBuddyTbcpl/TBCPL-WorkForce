import React, { useState, useEffect } from 'react';
import { User, Search, ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockProfiles } from '../../../data/mockData/mockProfiles';

interface Profile {
  id: string;
  name: string;
  status: string;
  lastUpdated: string;
  location?: string;
  nationality?: string;
}

const RecentProfiles: React.FC = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // ✅ Debug: Log mock profiles to console
    console.log('Mock Profiles:', mockProfiles);
    
    try {
      const storedProfiles = localStorage.getItem('culprit_profiles');
      
      if (storedProfiles) {
        const parsedProfiles = JSON.parse(storedProfiles);
        console.log('Stored Profiles:', parsedProfiles);
        
        const formattedProfiles = parsedProfiles.slice(0, 10).map((profile: any) => {
          console.log('Processing profile:', profile); // ✅ Debug log
          
          return {
            id: profile.id || 'unknown-id',
            name: profile.name || profile.fullName || profile.personal?.fullName || 'Unknown',
            status: profile.currentStatus?.status || profile.status || 'Active',
            lastUpdated: profile.updatedAt || profile.currentStatus?.lastUpdated || new Date().toISOString(),
            location: profile.address?.city || profile.location || '',
            nationality: profile.personal?.nationality || profile.nationality || '',
          };
        });
        
        setProfiles(formattedProfiles);
        setFilteredProfiles(formattedProfiles);
      } else {
        // ✅ Use mock data with better field mapping
        console.log('Using mock profiles');
        
        const formattedMockProfiles = mockProfiles.slice(0, 10).map((profile: any) => {
          console.log('Processing mock profile:', profile); // ✅ Debug log
          
          return {
            id: profile.id || 'unknown-id',
            name: profile.name || profile.fullName || profile.personal?.fullName || 'Unknown Name',
            status: profile.currentStatus?.status || profile.status || 'Active',
            lastUpdated: profile.currentStatus?.lastUpdated || profile.updatedAt || new Date().toISOString(),
            location: profile.address?.city || profile.location || '',
            nationality: profile.personal?.nationality || profile.nationality || '',
          };
        });
        
        console.log('Formatted mock profiles:', formattedMockProfiles); // ✅ Debug log
        
        setProfiles(formattedMockProfiles);
        setFilteredProfiles(formattedMockProfiles);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      
      // ✅ Fallback to mock data
      const formattedMockProfiles = mockProfiles.slice(0, 10).map((profile: any) => ({
        id: profile.id || 'unknown-id',
        name: profile.name || profile.fullName || 'Unknown Name',
        status: profile.currentStatus?.status || 'Active',
        lastUpdated: profile.currentStatus?.lastUpdated || new Date().toISOString(),
        location: profile.address?.city || '',
        nationality: profile.personal?.nationality || '',
      }));
      
      setProfiles(formattedMockProfiles);
      setFilteredProfiles(formattedMockProfiles);
    }
  }, []);

  // Filter profiles based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProfiles(profiles);
    } else {
      const filtered = profiles.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.nationality?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProfiles(filtered);
    }
  }, [searchTerm, profiles]);

  const handleViewAll = () => {
    navigate('/operations/profile');
  };

  const handleCreateProfile = () => {
    navigate('/operations/profile/create');
  };

  const handleViewProfile = (profileId: string) => {
    navigate(`/operations/profile/${profileId}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'arrested':
        return 'bg-red-100 text-red-800';
      case 'absconding':
        return 'bg-orange-100 text-orange-800';
      case 'under investigation':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Profiles</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {profiles.length} {profiles.length === 1 ? 'profile' : 'profiles'}
            </p>
          </div>
          <button
            onClick={handleViewAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View All
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results Count */}
        {searchTerm && (
          <p className="text-xs text-gray-500 mt-2">
            {filteredProfiles.length} result{filteredProfiles.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Profiles List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm ? (
              <>
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-2">No profiles found</p>
                <p className="text-xs text-gray-400 mb-3">
                  Try searching with different keywords
                </p>
                <button
                  onClick={clearSearch}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">No profiles yet</p>
                <p className="text-xs text-gray-500 mb-4">
                  Create your first culprit profile to get started
                </p>
                <button
                  onClick={handleCreateProfile}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create First Profile
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleViewProfile(profile.id)}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {profile.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        {profile.location && (
                          <p className="text-xs text-gray-500">{profile.location}</p>
                        )}
                        {profile.nationality && profile.location && (
                          <span className="text-xs text-gray-400">•</span>
                        )}
                        {profile.nationality && (
                          <p className="text-xs text-gray-500">{profile.nationality}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      profile.status
                    )}`}
                  >
                    {profile.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(profile.lastUpdated)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredProfiles.length > 0 && !searchTerm && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleCreateProfile}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <User className="w-4 h-4" />
            Create New Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentProfiles;
