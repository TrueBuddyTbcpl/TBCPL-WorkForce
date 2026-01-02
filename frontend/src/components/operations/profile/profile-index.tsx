import { useState } from 'react';
import { Plus, Search, Filter, X, ChevronDown } from 'lucide-react';
import ProfileForm from './ProfileForm';
import ProfilePreview from './ProfilePreview';
import ProfileCard from './ProfileCard';
import type { CulpritProfile } from './types/profile.types';

const ProfileIndex = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<CulpritProfile | null>(null);
  const [profiles, setProfiles] = useState<CulpritProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
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

  const handleCreateNew = () => {
    setSelectedProfile(null);
    setShowForm(true);
  };

  const handleEdit = (profile: CulpritProfile) => {
    setSelectedProfile(profile);
    setShowForm(true);
    setShowPreview(false);
  };

  const handleProfileSubmit = (profile: CulpritProfile) => {
    console.log('Profile submitted:', profile);
    
    if (selectedProfile?.id) {
      setProfiles(profiles.map(p => p.id === profile.id ? profile : p));
    } else {
      setProfiles([...profiles, profile]);
    }
    
    setSelectedProfile(profile);
    setShowForm(false);
    setShowPreview(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedProfile(null);
  };

  const handleViewProfile = (profile: CulpritProfile) => {
    setSelectedProfile(profile);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
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
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Apply search and filters
  const filteredProfiles = profiles.filter(profile => {
    // Search filter
    const matchesSearch = 
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.contact?.primaryPhone?.includes(searchTerm) ||
      profile.contact?.primaryEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Status filter
    if (filters.status && profile.currentStatus?.status !== filters.status) {
      return false;
    }

    // Gender filter
    if (filters.gender && profile.personal.gender !== filters.gender) {
      return false;
    }

    // Nationality filter
    if (filters.nationality && profile.personal.nationality?.toLowerCase() !== filters.nationality.toLowerCase()) {
      return false;
    }

    // City filter
    if (filters.city && profile.address?.city?.toLowerCase() !== filters.city.toLowerCase()) {
      return false;
    }

    // State filter
    if (filters.state && profile.address?.state?.toLowerCase() !== filters.state.toLowerCase()) {
      return false;
    }

    // Country filter
    if (filters.country && profile.address?.country?.toLowerCase() !== filters.country.toLowerCase()) {
      return false;
    }

    // Retailer Status filter
    if (filters.retailerStatus && profile.businessActivities?.retailerStatus !== filters.retailerStatus) {
      return false;
    }

    // Supplier Status filter
    if (filters.supplierStatus && profile.businessActivities?.supplierStatus !== filters.supplierStatus) {
      return false;
    }

    // Manufacturer Status filter
    if (filters.manufacturerStatus && profile.businessActivities?.manufacturerStatus !== filters.manufacturerStatus) {
      return false;
    }

    // Operating Region filter
    if (filters.operatingRegion) {
      const hasRegion = profile.geographicExposure?.operatingRegions?.some(
        region => region.toLowerCase().includes(filters.operatingRegion.toLowerCase())
      );
      if (!hasRegion) return false;
    }

    // FIR Status filter
    if (filters.firStatus) {
      const hasFirStatus = profile.relatedFIRsCases?.firs?.some(
        fir => fir.status === filters.firStatus
      );
      if (!hasFirStatus) return false;
    }

    // Has Vehicles filter
    if (filters.hasVehicles === 'yes') {
      if (!profile.assets?.vehicles || profile.assets.vehicles.length === 0) return false;
    } else if (filters.hasVehicles === 'no') {
      if (profile.assets?.vehicles && profile.assets.vehicles.length > 0) return false;
    }

    // Has Associates filter
    if (filters.hasAssociates === 'yes') {
      if (!profile.associations?.knownAssociates || profile.associations.knownAssociates.length === 0) return false;
    } else if (filters.hasAssociates === 'no') {
      if (profile.associations?.knownAssociates && profile.associations.knownAssociates.length > 0) return false;
    }

    // Has Employees filter
    if (filters.hasEmployees === 'yes') {
      if (!profile.associations?.knownEmployees || profile.associations.knownEmployees.length === 0) return false;
    } else if (filters.hasEmployees === 'no') {
      if (profile.associations?.knownEmployees && profile.associations.knownEmployees.length > 0) return false;
    }

    // Has Influential Links filter
    if (filters.hasInfluentialLinks === 'yes') {
      if (!profile.associations?.influentialLinks || profile.associations.influentialLinks.length === 0) return false;
    } else if (filters.hasInfluentialLinks === 'no') {
      if (profile.associations?.influentialLinks && profile.associations.influentialLinks.length > 0) return false;
    }

    // Tag filter
    if (filters.tag) {
      const hasTag = profile.additional?.tags?.some(
        tag => tag.toLowerCase().includes(filters.tag.toLowerCase())
      );
      if (!hasTag) return false;
    }

    return true;
  });

  // Get unique values for filter dropdowns
  const uniqueGenders = Array.from(new Set(profiles.map(p => p.personal.gender).filter(Boolean)));
  const uniqueNationalities = Array.from(new Set(profiles.map(p => p.personal.nationality).filter(Boolean)));
  const uniqueCities = Array.from(new Set(profiles.map(p => p.address?.city).filter(Boolean)));
  const uniqueStates = Array.from(new Set(profiles.map(p => p.address?.state).filter(Boolean)));
  const uniqueCountries = Array.from(new Set(profiles.map(p => p.address?.country).filter(Boolean)));
  const uniqueRegions = Array.from(new Set(
    profiles.flatMap(p => p.geographicExposure?.operatingRegions || [])
  ));
  const uniqueTags = Array.from(new Set(
    profiles.flatMap(p => p.additional?.tags || [])
  ));

  return (
    <div className="min-h-screen bg-gray-50">
      {!showForm && !showPreview && (
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
              <p className="text-gray-600 mt-1">Manage culprit profiles and information</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                placeholder="Search by name, ID, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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

          {/* Filter Panel */}
          {showFilters && (
            <div className="mb-6 bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 px-3 py-1 border border-blue-200 rounded-lg hover:bg-blue-50"
                    >
                      <X className="w-4 h-4" />
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Personal Information Filters */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={filters.gender}
                      onChange={(e) => handleFilterChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Genders</option>
                      {uniqueGenders.map((gender) => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                    <select
                      value={filters.nationality}
                      onChange={(e) => handleFilterChange('nationality', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Nationalities</option>
                      {uniqueNationalities.map((nationality) => (
                        <option key={nationality} value={nationality}>{nationality}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Arrested">Arrested</option>
                      <option value="Absconding">Absconding</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                    <select
                      value={filters.tag}
                      onChange={(e) => handleFilterChange('tag', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Tags</option>
                      {uniqueTags.map((tag) => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Location Filters */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Location</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <select
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Cities</option>
                      {uniqueCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select
                      value={filters.state}
                      onChange={(e) => handleFilterChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All States</option>
                      {uniqueStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={filters.country}
                      onChange={(e) => handleFilterChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Countries</option>
                      {uniqueCountries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Operating Region</label>
                    <select
                      value={filters.operatingRegion}
                      onChange={(e) => handleFilterChange('operatingRegion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Regions</option>
                      {uniqueRegions.map((region) => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Business Activities Filters */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Business Activities</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Retailer Status</label>
                    <select
                      value={filters.retailerStatus}
                      onChange={(e) => handleFilterChange('retailerStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="Individual">Individual</option>
                      <option value="Entity">Entity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Status</label>
                    <select
                      value={filters.supplierStatus}
                      onChange={(e) => handleFilterChange('supplierStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="Individual">Individual</option>
                      <option value="Entity">Entity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer Status</label>
                    <select
                      value={filters.manufacturerStatus}
                      onChange={(e) => handleFilterChange('manufacturerStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="Individual">Individual</option>
                      <option value="Entity">Entity</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Legal & Associations Filters */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Legal & Associations</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">FIR Status</label>
                    <select
                      value={filters.firStatus}
                      onChange={(e) => handleFilterChange('firStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Closed">Closed</option>
                      <option value="Convicted">Convicted</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Has Vehicles</label>
                    <select
                      value={filters.hasVehicles}
                      onChange={(e) => handleFilterChange('hasVehicles', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Has Associates</label>
                    <select
                      value={filters.hasAssociates}
                      onChange={(e) => handleFilterChange('hasAssociates', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Has Employees</label>
                    <select
                      value={filters.hasEmployees}
                      onChange={(e) => handleFilterChange('hasEmployees', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Has Influential Links</label>
                    <select
                      value={filters.hasInfluentialLinks}
                      onChange={(e) => handleFilterChange('hasInfluentialLinks', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Active Filters ({Object.values(filters).filter(v => v !== '').length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                      if (!value) return null;
                      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      return (
                        <span key={key} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                          <span className="font-medium">{label}:</span> {value}
                          <button 
                            onClick={() => handleFilterChange(key, '')} 
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results Count */}
          {profiles.length > 0 && (
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredProfiles.length}</span> of <span className="font-semibold">{profiles.length}</span> profiles
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Reset filters
                </button>
              )}
            </div>
          )}

          {/* Profiles Grid */}
          {profiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Plus className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No profiles yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first profile</p>
              <button
                onClick={handleCreateNew}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onEdit={() => handleEdit(profile)}
                  onView={() => handleViewProfile(profile)}
                />
              ))}
            </div>
          )}

          {filteredProfiles.length === 0 && profiles.length > 0 && (
            <div className="text-center py-12 bg-white rounded-lg border">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No profiles match your criteria</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search term</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {showForm && (
        <ProfileForm
          initialData={selectedProfile || undefined}
          onSubmit={handleProfileSubmit}
          onCancel={handleCancel}
        />
      )}

      {showPreview && selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          onClose={handleClosePreview}
          onEdit={() => {
            setShowPreview(false);
            handleEdit(selectedProfile);
          }}
        />
      )}
    </div>
  );
};

export default ProfileIndex;
