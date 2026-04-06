import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, X, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ProfileForm from '../../operations/profile/ProfileForm';
import ProfilePreview from '../../operations/profile/ProfilePreview';
import ProfileCard from '../../operations/profile/ProfileCard';
import {
  getAllProfiles,
  searchProfiles,
  getProfilesByStatus,
  deleteProfile,
  type ApiProfileDetail,
} from '../../../services/api/profileApi';

const ProfileIndex = () => {
  const [showForm, setShowForm]               = useState(false);
  const [showPreview, setShowPreview]         = useState(false);
  const [showFilters, setShowFilters]         = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ApiProfileDetail | null>(null);
  const [profiles, setProfiles]               = useState<ApiProfileDetail[]>([]);
  const [searchTerm, setSearchTerm]           = useState('');
  const [searchDebounce, setSearchDebounce]   = useState('');
  const [loading, setLoading]                 = useState(false);
  const [currentPage, setCurrentPage]         = useState(0);
  const [totalPages, setTotalPages]           = useState(0);
  const [totalElements, setTotalElements]     = useState(0);

  const [filters, setFilters] = useState({
    status: '', gender: '', nationality: '', city: '', state: '',
    country: '', retailerStatus: '', supplierStatus: '', manufacturerStatus: '',
    operatingRegion: '', firStatus: '', hasVehicles: '', hasAssociates: '',
    hasEmployees: '', hasInfluentialLinks: '', tag: '',
  });

  // ── Debounce ──
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ── Fetch ──
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
    } catch {
      toast.error('Failed to load profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchDebounce, filters.status]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);
  useEffect(() => { setCurrentPage(0); }, [searchDebounce, filters.status]);

  // ── Handlers ──
  const handleCreateNew = () => { setSelectedProfile(null); setShowForm(true); };
  const handleEdit = (profile: ApiProfileDetail) => {
    setSelectedProfile(profile); setShowForm(true); setShowPreview(false);
  };
  const handleProfileSaved = (profile: ApiProfileDetail) => {
    setSelectedProfile(profile); setShowForm(false); setShowPreview(true);
    fetchProfiles(); toast.success('Profile saved successfully!');
  };
  const handleCancel      = () => { setShowForm(false); setSelectedProfile(null); };
  const handleViewProfile = (profile: ApiProfileDetail) => { setSelectedProfile(profile); setShowPreview(true); };
  const handleClosePreview = () => setShowPreview(false);
  const handleDelete = async (profileId: number) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) return;
    try {
      await deleteProfile(profileId);
      toast.success('Profile deleted successfully');
      fetchProfiles();
      if (selectedProfile?.id === profileId) { setShowPreview(false); setSelectedProfile(null); }
    } catch { toast.error('Failed to delete profile'); }
  };
  const handleFilterChange = (key: string, value: string) =>
    setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({
    status: '', gender: '', nationality: '', city: '', state: '',
    country: '', retailerStatus: '', supplierStatus: '', manufacturerStatus: '',
    operatingRegion: '', firStatus: '', hasVehicles: '', hasAssociates: '',
    hasEmployees: '', hasInfluentialLinks: '', tag: '',
  });

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  // ── Client-side filter ──
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
      if (!profile.firs?.some(f => f.status === filters.firStatus)) return false;
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
      if (!profile.additionalInfo?.tags?.some(t => t.toLowerCase().includes(filters.tag.toLowerCase()))) return false;
    }
    return true;
  });

  // ── Shared select class ──
  const selectCls = `w-full px-3 py-2 text-sm
    bg-white/10 border border-white/20 rounded-xl
    text-white focus:outline-none focus:ring-2 focus:ring-white/20
    focus:border-white/40 transition appearance-none cursor-pointer
    [&>option]:bg-[#3a2a00] [&>option]:text-white`;

  return (
    <div className="min-h-screen">

      {/* ── List View ── */}
      {!showForm && !showPreview && (
        <div className="p-6 space-y-5">

          {/* ── Page Header ── */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white
                [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
                Profile Management
              </h1>
              <p className="text-white/60 mt-1 text-sm
                [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                Manage offender profiles and information
                {totalElements > 0 && (
                  <span className="ml-2 text-white font-semibold">
                    ({totalElements} {totalElements === 1 ? 'profile' : 'profiles'})
                  </span>
                )}
              </p>
            </div>

            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-5 py-2.5
                bg-white/20 hover:bg-white/30
                border border-white/30 hover:border-white/50
                text-white font-semibold text-sm rounded-xl
                transition-all backdrop-blur-sm
                shadow-sm shadow-black/10
                [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
            >
              <Plus className="w-5 h-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]" />
              Create New Profile
            </button>
          </div>

          {/* ── Search + Filter Toggle ── */}
          <div className="flex gap-3">

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                text-white/50 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]" />
              <input
                type="text"
                placeholder="Search by name, profile number, phone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm
                  bg-white/10 border border-white/20 rounded-xl
                  text-white placeholder-white/35
                  focus:outline-none focus:ring-2 focus:ring-white/20
                  focus:border-white/40 transition
                  [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-white/40 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                rounded-xl border transition-all backdrop-blur-sm
                [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]
                ${showFilters || hasActiveFilters
                  ? 'bg-white/25 border-white/40 text-white'
                  : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
            >
              <Filter className="w-4 h-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]" />
              Filters
              {hasActiveFilters && (
                <span className="px-1.5 py-0.5 bg-white/30 border border-white/30
                  text-white text-[10px] font-bold rounded-full">
                  {Object.values(filters).filter(v => v !== '').length}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200
                ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* ── Filter Panel ── */}
          {showFilters && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20
              rounded-2xl p-6 space-y-4">

              {/* Filter Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest
                  [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                  Filters
                </h3>
                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-xs text-white/70
                        hover:text-white px-3 py-1.5
                        bg-white/10 border border-white/20 hover:bg-white/20
                        rounded-lg transition
                        [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
                    >
                      <X className="w-3.5 h-3.5" /> Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition
                      text-white/50 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <FilterField label="Status">
                  <select value={filters.status}
                    onChange={e => handleFilterChange('status', e.target.value)}
                    className={selectCls}>
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="ARRESTED">Arrested</option>
                    <option value="ABSCONDING">Absconding</option>
                  </select>
                </FilterField>

                <FilterField label="Gender">
                  <select value={filters.gender}
                    onChange={e => handleFilterChange('gender', e.target.value)}
                    className={selectCls}>
                    <option value="">All</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </FilterField>

                <FilterField label="Has Associates">
                  <select value={filters.hasAssociates}
                    onChange={e => handleFilterChange('hasAssociates', e.target.value)}
                    className={selectCls}>
                    <option value="">Any</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </FilterField>

                <FilterField label="Has Vehicles">
                  <select value={filters.hasVehicles}
                    onChange={e => handleFilterChange('hasVehicles', e.target.value)}
                    className={selectCls}>
                    <option value="">Any</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </FilterField>

                <FilterField label="Has Employees">
                  <select value={filters.hasEmployees}
                    onChange={e => handleFilterChange('hasEmployees', e.target.value)}
                    className={selectCls}>
                    <option value="">Any</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </FilterField>

                <FilterField label="Has Influential Links">
                  <select value={filters.hasInfluentialLinks}
                    onChange={e => handleFilterChange('hasInfluentialLinks', e.target.value)}
                    className={selectCls}>
                    <option value="">Any</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </FilterField>

                <FilterField label="City">
                  <input
                    type="text"
                    placeholder="Enter city..."
                    value={filters.city}
                    onChange={e => handleFilterChange('city', e.target.value)}
                    className="w-full px-3 py-2 text-sm
                      bg-white/10 border border-white/20 rounded-xl
                      text-white placeholder-white/30
                      focus:outline-none focus:ring-2 focus:ring-white/20
                      focus:border-white/40 transition
                      [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
                  />
                </FilterField>

                <FilterField label="Tag">
                  <input
                    type="text"
                    placeholder="Enter tag..."
                    value={filters.tag}
                    onChange={e => handleFilterChange('tag', e.target.value)}
                    className="w-full px-3 py-2 text-sm
                      bg-white/10 border border-white/20 rounded-xl
                      text-white placeholder-white/30
                      focus:outline-none focus:ring-2 focus:ring-white/20
                      focus:border-white/40 transition
                      [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
                  />
                </FilterField>
              </div>
            </div>
          )}

          {/* ── Loading ── */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-white/70 animate-spin
                drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]" />
              <span className="ml-3 text-white/60 text-sm
                [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                Loading profiles...
              </span>
            </div>
          )}

          {/* ── Results ── */}
          {!loading && (
            <>
              {/* Count bar */}
              <p className="text-xs text-white/50
                [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                Showing{' '}
                <span className="text-white font-semibold">{filteredProfiles.length}</span>
                {' '}of{' '}
                <span className="text-white/80 font-semibold">{totalElements}</span>
                {' '}profiles
              </p>

              {/* ── Empty State ── */}
              {filteredProfiles.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-lg border border-white/20
                  rounded-2xl p-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20
                    flex items-center justify-center mx-auto mb-5">
                    <Plus className="w-10 h-10 text-white/30
                      drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2
                    [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                    No profiles found
                  </h3>
                  <p className="text-white/50 text-sm mb-6
                    [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                    {searchTerm || hasActiveFilters
                      ? 'Try adjusting your search or filters'
                      : 'Get started by creating your first profile'}
                  </p>
                  {!searchTerm && !hasActiveFilters && (
                    <button
                      onClick={handleCreateNew}
                      className="px-6 py-2.5
                        bg-white/20 hover:bg-white/30
                        border border-white/30 hover:border-white/50
                        text-white font-semibold text-sm rounded-xl
                        transition-all backdrop-blur-sm
                        [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
                    >
                      Create First Profile
                    </button>
                  )}
                </div>

              ) : (
                /* ── Profile Cards Grid ── */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProfiles.map(profile => (
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

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 pt-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 text-sm font-medium
                      bg-white/10 hover:bg-white/20
                      border border-white/20 hover:border-white/35
                      text-white/70 hover:text-white
                      rounded-xl transition backdrop-blur-sm
                      [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]
                      disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-white/50 px-2
                    [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                    Page{' '}
                    <span className="text-white font-semibold">{currentPage + 1}</span>
                    {' '}of{' '}
                    <span className="text-white/70">{totalPages}</span>
                  </span>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-4 py-2 text-sm font-medium
                      bg-white/10 hover:bg-white/20
                      border border-white/20 hover:border-white/35
                      text-white/70 hover:text-white
                      rounded-xl transition backdrop-blur-sm
                      [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]
                      disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Form View ── */}
      {showForm && (
        <ProfileForm
          initialData={selectedProfile || undefined}
          onSaved={handleProfileSaved}
          onCancel={handleCancel}
        />
      )}

      {/* ── Preview View ── */}
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

/* ── Filter Field Wrapper ── */
const FilterField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-white/50 mb-1.5
      uppercase tracking-widest
      [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
      {label}
    </label>
    {children}
  </div>
);

export default ProfileIndex;
