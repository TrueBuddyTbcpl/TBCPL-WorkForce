import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, X, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ProfileForm from '../operations/profile/ProfileForm';
import ProfilePreview from '../operations/profile/ProfilePreview';
import ProfileCard from '../operations/profile/ProfileCard';
import {
  getAllProfiles,
  searchProfiles,
  getProfilesByStatus,
  deleteProfile,
  type ApiProfileDetail,
} from '../../services/api/profileApi';

const ProfileIndex = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ApiProfileDetail | null>(null);
  const [profiles, setProfiles] = useState<ApiProfileDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [filters, setFilters] = useState({
    status: '',
    gender: '',
    nationality: '',
    city: '',
    state: '',
    country: '',
    retailerStatus: '',
    supplierStatus: '',
    manufacturerStatus: '',
    operatingRegion: '',
    firStatus: '',
    hasVehicles: '',
    hasAssociates: '',
    hasEmployees: '',
    hasInfluentialLinks: '',
    tag: '',
  });

  // ─────────────────────────────────────────────────────────────────────
  // DEBOUNCE SEARCH
  // ─────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ─────────────────────────────────────────────────────────────────────
  // FETCH PROFILES
  // ─────────────────────────────────────────────────────────────────────

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      let response;

      if (searchDebounce.trim()) {
        response = await searchProfiles(searchDebounce, currentPage, 10);
      } else if (filters.status) {
        response = await getProfilesByStatus(filters.status, currentPage, 10);
      } else {
        response = await getAllProfiles(currentPage, 10);
      }

      setProfiles(response.profiles);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast.error('Failed to load profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchDebounce, filters.status]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Reset to page 0 on search/filter change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchDebounce, filters.status]);

  // ─────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────

  const handleCreateNew = () => {
    setSelectedProfile(null);
    setShowForm(true);
  };

  const handleEdit = (profile: ApiProfileDetail) => {
    setSelectedProfile(profile);
    setShowForm(true);
    setShowPreview(false);
  };

  const handleProfileSaved = (profile: ApiProfileDetail) => {
    setSelectedProfile(profile);
    setShowForm(false);
    setShowPreview(true);
    fetchProfiles(); // refresh list
    toast.success('Profile saved successfully!');
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedProfile(null);
  };

  const handleViewProfile = (profile: ApiProfileDetail) => {
    setSelectedProfile(profile);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleDelete = async (profileId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this profile?');
    if (!confirmed) return;

    try {
      await deleteProfile(profileId);
      toast.success('Profile deleted successfully');
      fetchProfiles();
      if (selectedProfile?.id === profileId) {
        setShowPreview(false);
        setSelectedProfile(null);
      }
    } catch {
      toast.error('Failed to delete profile');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '', gender: '', nationality: '', city: '', state: '',
      country: '', retailerStatus: '', supplierStatus: '', manufacturerStatus: '',
      operatingRegion: '', firStatus: '', hasVehicles: '', hasAssociates: '',
      hasEmployees: '', hasInfluentialLinks: '', tag: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  // ─────────────────────────────────────────────────────────────────────
  // CLIENT-SIDE FILTERS (applied on top of API results)
  // ─────────────────────────────────────────────────────────────────────

  const filteredProfiles = profiles.filter(profile => {
    if (filters.gender && profile.personalInfo?.gender !== filters.gender) return false;
    if (filters.nationality && profile.personalInfo?.nationality?.toLowerCase() !== filters.nationality.toLowerCase()) return false;
    if (filters.city && profile.address?.city?.toLowerCase() !== filters.city.toLowerCase()) return false;
    if (filters.state && profile.address?.state?.toLowerCase() !== filters.state.toLowerCase()) return false;
    if (filters.country && profile.address?.country?.toLowerCase() !== filters.country.toLowerCase()) return false;
    if (filters.retailerStatus && profile.businessActivities?.retailerStatus !== filters.retailerStatus) return false;
    if (filters.supplierStatus && profile.businessActivities?.supplierStatus !== filters.supplierStatus) return false;
    if (filters.manufacturerStatus && profile.businessActivities?.manufacturerStatus !== filters.manufacturerStatus) return false;
    if (filters.operatingRegion) {
      const has = profile.geographicExposure?.operatingRegions?.some(r =>
        r.toLowerCase().includes(filters.operatingRegion.toLowerCase())
      );
      if (!has) return false;
    }
    if (filters.firStatus) {
      const has = profile.firs?.some(f => f.status === filters.firStatus);
      if (!has) return false;
    }
    if (filters.hasVehicles === 'yes' && (!profile.vehicles || profile.vehicles.length === 0)) return false;
    if (filters.hasVehicles === 'no' && profile.vehicles && profile.vehicles.length > 0) return false;
    if (filters.hasAssociates === 'yes' && (!profile.knownAssociates || profile.knownAssociates.length === 0)) return false;
    if (filters.hasAssociates === 'no' && profile.knownAssociates && profile.knownAssociates.length > 0) return false;
    if (filters.hasEmployees === 'yes' && (!profile.knownEmployees || profile.knownEmployees.length === 0)) return false;
    if (filters.hasEmployees === 'no' && profile.knownEmployees && profile.knownEmployees.length > 0) return false;
    if (filters.hasInfluentialLinks === 'yes' && (!profile.influentialLinks || profile.influentialLinks.length === 0)) return false;
    if (filters.hasInfluentialLinks === 'no' && profile.influentialLinks && profile.influentialLinks.length > 0) return false;
    if (filters.tag) {
      const has = profile.additionalInfo?.tags?.some(t => t.toLowerCase().includes(filters.tag.toLowerCase()));
      if (!has) return false;
    }
    return true;
  });

  // ─────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {!showForm && !showPreview && (
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
              <p className="text-gray-600 mt-1">
                Manage offender profiles and information
                {totalElements > 0 && (
                  <span className="ml-2 text-blue-600 font-semibold">
                    ({totalElements} {totalElements === 1 ? 'profile' : 'profiles'})
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Create New Profile
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, profile number, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {Object.values(filters).filter(v => v !== '').length}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Panel — Status only sent to backend, rest are client-side */}
          {showFilters && (
            <div className="mb-6 bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 px-3 py-1 border border-blue-200 rounded-lg">
                      <X className="w-4 h-4" /> Clear All
                    </button>
                  )}
                  <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={filters.status} onChange={e => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="ARRESTED">Arrested</option>
                    <option value="ABSCONDING">Absconding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select value={filters.gender} onChange={e => handleFilterChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">All</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Has Associates</label>
                  <select value={filters.hasAssociates} onChange={e => handleFilterChange('hasAssociates', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Any</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Has Vehicles</label>
                  <select value={filters.hasVehicles} onChange={e => handleFilterChange('hasVehicles', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Any</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading profiles...</span>
            </div>
          )}

          {/* Results */}
          {!loading && (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-blue-600">{filteredProfiles.length}</span> of{' '}
                  <span className="font-semibold">{totalElements}</span> profiles
                </p>
              </div>

              {filteredProfiles.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No profiles found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || hasActiveFilters
                      ? 'Try adjusting your search or filters'
                      : 'Get started by creating your first profile'}
                  </p>
                  {!searchTerm && !hasActiveFilters && (
                    <button onClick={handleCreateNew} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Create First Profile
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onEdit={() => handleEdit(profile)}
                      onView={() => handleViewProfile(profile)}
                      onDelete={() => handleDelete(profile.id)}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {showForm && (
        <ProfileForm
          initialData={selectedProfile || undefined}
          onSaved={handleProfileSaved}
          onCancel={handleCancel}
        />
      )}

      {showPreview && selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          onClose={handleClosePreview}
          onEdit={() => { setShowPreview(false); handleEdit(selectedProfile); }}
          onDelete={() => handleDelete(selectedProfile.id)}
        />
      )}
    </div>
  );
};

export default ProfileIndex;
