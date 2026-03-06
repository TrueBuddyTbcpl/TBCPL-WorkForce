import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Briefcase,
  MapPin,
  Globe,
  Upload,
  FileText,
  Image,
  File,
  Trash2,
  Download,
  Eye,
  X,
  UserSearch,
  ClipboardList,
  ChevronDown,
} from 'lucide-react';
import { useCaseDetail } from '../../../hooks/cases/useCaseDetail';
import ProfilePreview from '../../operations/profile/ProfilePreview'; // adjust path if needed

import {
  useCaseDocuments,
  useUploadDocument,
  useDeleteDocument,
} from '../../../hooks/cases/useCaseDocuments';
import apiClient from '../../../services/api/apiClient';
import InvestigationTracker from './InvestigationTracker';
import { useAuthStore } from '../../../stores/authStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { CaseDocumentResponse } from './types/case.types';
import { getLinkedProfiles, linkProfile, unlinkProfile, type LinkedProfile } from '../../../services/api/caseProfileLinkApi';
import { getAllProfiles, searchProfiles, type ApiProfileDetail } from '../../../services/api/profileApi';


interface Props {
  isAdminView?: boolean;
}


const ALLOWED_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_BYTES = 20 * 1024 * 1024;


const CaseDashboard = ({ isAdminView = false }: Props) => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── ALL useState FIRST — never moved ──────────────────────────────
  const [activeTab, setActiveTab] = useState<'overview' | 'updates' | 'online'>('overview');
  const [isDragging, setIsDragging] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<CaseDocumentResponse | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isFetchingPrefill, setIsFetchingPrefill] = useState(false);

  // Add this state alongside existing useState hooks
  const [existingReportId, setExistingReportId] = useState<number | null>(null);
  const [isCheckingReport, setIsCheckingReport] = useState(true);

  const [linkedProfiles, setLinkedProfiles] = useState<LinkedProfile[]>([]);
  const [showLinkDropdown, setShowLinkDropdown] = useState(false);
  const [profileSearch, setProfileSearch] = useState('');
  const [searchResults, setSearchResults] = useState<ApiProfileDetail[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [linkingId, setLinkingId] = useState<number | null>(null);
  const [unlinkingId, setUnlinkingId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [profileCaseCounts, setProfileCaseCounts] = useState<Record<number, number>>({});
  const [previewProfile, setPreviewProfile] = useState<ApiProfileDetail | null>(null);
  const [loadingPreviewId, setLoadingPreviewId] = useState<number | null>(null);




  const backPath = isAdminView ? '/admin/cases' : '/operations/cases';

  // ✅ Safe parse — no early return before hooks
  const parsedCaseId = caseId && caseId !== 'undefined' && !isNaN(Number(caseId))
    ? Number(caseId)
    : null;

  // ── ALL DATA HOOKS — called unconditionally, parsedCaseId may be null ─
  const { data: caseDetail, isLoading, isError, refetch } = useCaseDetail(parsedCaseId);
  const { data: documents = [], isLoading: docsLoading } = useCaseDocuments(parsedCaseId ?? 0);
  const uploadMutation = useUploadDocument(parsedCaseId ?? 0);
  const deleteMutation = useDeleteDocument(parsedCaseId ?? 0);

  // ── Helpers ────────────────────────────────────────────────────────
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.startsWith('image/')) return <Image className="w-6 h-6 text-blue-500" />;
    if (fileType === 'application/pdf') return <FileText className="w-6 h-6 text-red-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTypeLabel = (fileType: string) => {
    if (fileType?.startsWith('image/')) return fileType.split('/')[1].toUpperCase();
    if (fileType === 'application/pdf') return 'PDF';
    if (fileType?.includes('wordprocessingml')) return 'DOCX';
    if (fileType === 'application/msword') return 'DOC';
    return 'FILE';
  };

  const isImage = (fileType: string) => fileType?.startsWith('image/');

  // ── Upload handlers ────────────────────────────────────────────────
  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) return 'File type not allowed. Use JPG, PNG, WEBP, PDF, DOC, DOCX';
    if (file.size > MAX_SIZE_BYTES) return 'File size exceeds 20MB limit';
    return null;
  };

  // Add this useEffect after existing hooks — checks if final report exists for this case
  useEffect(() => {
    if (!parsedCaseId) return;

    const checkExistingReport = async () => {
      try {
        setIsCheckingReport(true);
        const res = await apiClient.get(`/operation/finalreport/by-case/${parsedCaseId}`);
        if (res.data?.data?.id) {
          setExistingReportId(res.data.data.id);
        }
      } catch {
        // 404 means no report yet — that's fine
        setExistingReportId(null);
      } finally {
        setIsCheckingReport(false);
      }
    };

    checkExistingReport();
  }, [parsedCaseId]);


  const handleUpload = async (file: File) => {
    const error = validateFile(file);
    if (error) { toast.error(error); return; }

    try {
      await uploadMutation.mutateAsync({
        file,
        uploadedBy: user?.empId || user?.fullName || 'unknown',
      });
      toast.success(`"${file.name}" uploaded successfully`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDelete = async (doc: CaseDocumentResponse) => {
    if (!window.confirm(`Delete "${doc.originalName}"? This cannot be undone.`)) return;
    try {
      setDeletingId(doc.id);
      await deleteMutation.mutateAsync({
        documentId: doc.id,
        requestedBy: user?.empId || user?.fullName || 'unknown',
      });
      toast.success(`"${doc.originalName}" deleted`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };


  const handleGenerateFinalReport = async () => {
    if (!parsedCaseId) return;
    setIsFetchingPrefill(true);
    try {
      const res = await apiClient.get(
        `/operation/finalreport/prefill/${parsedCaseId}`
      );
      const prefill = res.data.data;
      if (prefill.reportAlreadyExists && prefill.existingReportId) {
        navigate(`/operations/finalreport/${prefill.existingReportId}/edit`);
      } else {
        navigate('/operations/finalreport/create', {
          state: { prefill },
        });
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Failed to load report prefill'
      );
    } finally {
      setIsFetchingPrefill(false);
    }
  };

  // Load linked profiles on mount
  useEffect(() => {
    if (!parsedCaseId) return;
    getLinkedProfiles(parsedCaseId)
      .then(setLinkedProfiles)
      .catch(() => { });
  }, [parsedCaseId]);

  // Search profiles as user types
  useEffect(() => {
    if (!showLinkDropdown) return;
    if (profileSearch.trim().length < 1) {
      setSearchLoading(true);
      getAllProfiles(0, 10)
        .then(async (res) => {
          setSearchResults(res.profiles);
          await fetchCountsForProfiles(res.profiles);
        })
        .catch(() => { })
        .finally(() => setSearchLoading(false));
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await searchProfiles(profileSearch.trim(), 0, 10);
        setSearchResults(res.profiles);
        await fetchCountsForProfiles(res.profiles);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [profileSearch, showLinkDropdown]);


  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowLinkDropdown(false);
        setProfileSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLinkProfile = async (profile: ApiProfileDetail) => {
    if (!parsedCaseId) return;
    if (linkedProfiles.some(lp => lp.profileId === profile.id)) {
      toast.info('Profile already linked');
      return;
    }
    setLinkingId(profile.id);
    try {
      const linked = await linkProfile(parsedCaseId, profile.id, profile.profileNumber, profile.name);
      setLinkedProfiles(prev => [...prev, linked]);
      toast.success(`"${profile.name}" linked to this case`);
      setShowLinkDropdown(false);
      setProfileSearch('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to link profile');
    } finally {
      setLinkingId(null);
    }
  };

  const fetchCountsForProfiles = async (profiles: ApiProfileDetail[]) => {
    // Only fetch for profiles we haven't counted yet
    const uncounted = profiles.filter(p => profileCaseCounts[p.id] === undefined);
    if (uncounted.length === 0) return;

    const results = await Promise.allSettled(
      uncounted.map(p =>
        apiClient.get(`/operation/cases/profile/${p.id}/count`)
          .then(res => ({ id: p.id, count: res.data.data as number }))
      )
    );

    const newCounts: Record<number, number> = {};
    results.forEach(r => {
      if (r.status === 'fulfilled') {
        newCounts[r.value.id] = r.value.count;
      }
    });

    setProfileCaseCounts(prev => ({ ...prev, ...newCounts }));
  };

  const handleOpenProfilePreview = async (profileId: number) => {
    setLoadingPreviewId(profileId);
    try {
      const res = await apiClient.get(`/operation/profiles/${profileId}`);
      setPreviewProfile(res.data.data);
      setShowLinkDropdown(false);  // close link dropdown
      setProfileSearch('');
    } catch {
      toast.error('Failed to load profile details');
    } finally {
      setLoadingPreviewId(null);
    }
  };


  const handleUnlinkProfile = async (lp: LinkedProfile) => {
    if (!parsedCaseId) return;
    if (!window.confirm(`Unlink "${lp.profileName}" from this case?`)) return;
    setUnlinkingId(lp.profileId);
    try {
      await unlinkProfile(parsedCaseId, lp.profileId);
      setLinkedProfiles(prev => prev.filter(p => p.profileId !== lp.profileId));
      toast.success(`"${lp.profileName}" unlinked`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to unlink profile');
    } finally {
      setUnlinkingId(null);
    }
  };



  // ── EARLY RETURNS — only after ALL hooks and helpers ──────────────

  // ✅ Guard 1 — invalid/undefined caseId in URL
  if (!parsedCaseId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-semibold">Invalid Case ID</p>
          <p className="text-gray-500 text-sm mt-1">
            The case ID in the URL is missing or invalid.
          </p>
          <button
            onClick={() => navigate(backPath)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Cases
          </button>
        </div>
      </div>
    );
  }

  // ✅ Guard 2 — loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading case details...</span>
      </div>
    );
  }

  // ✅ Guard 3 — error or no data
  if (isError || !caseDetail) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-semibold">Error loading case</p>
          <button
            onClick={() => navigate(backPath)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Cases
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'updates', label: `Updates (${caseDetail.updates?.length ?? 0})` },
    { id: 'online', label: `Online Presence (${caseDetail.onlinePresences?.length ?? 0})` },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-screen-xl mx-auto px-4">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cases
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{caseDetail.clientName}</h1>
              <p className="text-lg text-blue-600 font-medium mt-1">
                Product: {caseDetail.clientProduct}
              </p>
              <p className="text-gray-500 mt-1 font-mono text-sm">{caseDetail.caseNumber}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(caseDetail.status)}`}>
                {caseDetail.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Priority:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(caseDetail.priority)}`}>
                {caseDetail.priority}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Lead Type:</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {caseDetail.leadType}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Last Updated: {format(new Date(caseDetail.updatedAt), 'dd MMM yyyy, hh:mm a')}
            </div>
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {caseDetail.assignedEmployees?.length ?? 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">Assigned Employees</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {caseDetail.onlinePresences?.length ?? 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">Online Presences</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {caseDetail.updates?.length ?? 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">Updates</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 text-sm font-mono">
              {caseDetail.prereportReportId ?? 'N/A'}
            </div>
            <div className="text-sm text-gray-600 mt-1">Pre-Report ID</div>
          </div>
        </div>

        {/* ── Main Layout: Content + Sidebar ─────────────────────────── */}
        <div className="flex gap-6 items-start">

          {/* ── LEFT: Tabs Content ─────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="border-b border-gray-200">
                <div className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Case Info */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                          Case Details
                        </h3>
                        {[
                          { label: 'Case Number', value: caseDetail.caseNumber },
                          { label: 'Case Title', value: caseDetail.caseTitle },
                          { label: 'Case Type', value: caseDetail.caseType || 'N/A' },
                          { label: 'Date Opened', value: caseDetail.dateOpened ? format(new Date(caseDetail.dateOpened), 'dd MMM yyyy') : 'N/A' },
                          { label: 'Est. Completion', value: caseDetail.estimatedCompletionDate ? format(new Date(caseDetail.estimatedCompletionDate), 'dd MMM yyyy') : 'N/A' },
                          { label: 'Created By', value: caseDetail.createdBy },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-sm text-gray-500">{label}</span>
                            <span className="text-sm font-medium text-gray-900">{value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Client Info */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          Client Information
                        </h3>
                        {[
                          { label: 'Client Name', value: caseDetail.clientName },
                          { label: 'Product', value: caseDetail.clientProduct },
                          { label: 'Email', value: caseDetail.clientEmail || 'N/A' },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-sm text-gray-500">{label}</span>
                            <span className="text-sm font-medium text-gray-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subject/Entity Info */}
                    {(caseDetail.entityName || caseDetail.suspectName) && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          Subject / Entity Details
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {[
                            { label: 'Entity Name', value: caseDetail.entityName },
                            { label: 'Suspect Name', value: caseDetail.suspectName },
                            { label: 'Contact Numbers', value: caseDetail.contactNumbers },
                            { label: 'Address', value: [caseDetail.addressLine1, caseDetail.addressLine2, caseDetail.city, caseDetail.state, caseDetail.pincode].filter(Boolean).join(', ') },
                            { label: 'Product Details', value: caseDetail.productDetails },
                          ].filter(item => item.value).map(({ label, value }) => (
                            <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-sm text-gray-500">{label}</span>
                              <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assigned Employees */}
                    {caseDetail.assignedEmployees && caseDetail.assignedEmployees.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          Assigned Team
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {caseDetail.assignedEmployees.map((emp) => (
                            <span
                              key={emp}
                              className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-full font-medium"
                            >
                              {emp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Updates Tab */}
                {activeTab === 'updates' && (
                  <InvestigationTracker
                    caseId={caseDetail.id}
                    currentStatus={caseDetail.status}
                    updates={caseDetail.updates ?? []}
                    onUpdateAdded={refetch}
                  />
                )}

                {/* Online Presence Tab */}
                {activeTab === 'online' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      Online Presence ({caseDetail.onlinePresences?.length ?? 0})
                    </h3>
                    {!caseDetail.onlinePresences || caseDetail.onlinePresences.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500">No online presence records found</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {caseDetail.onlinePresences.map((presence) => (
                          <div
                            key={presence.id}
                            className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{presence.platformName}</p>
                              <a
                                href={presence.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline break-all"
                              >
                                {presence.link}
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white rounded-lg shadow-sm border p-4 text-sm text-gray-500 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created: {format(new Date(caseDetail.createdAt), 'dd MMM yyyy, hh:mm a')}
              </div>
              <div>
                Created By: <span className="font-medium text-gray-700">{caseDetail.createdBy}</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ─────────────────────────────────────── */}
          <div className="w-80 flex-shrink-0 space-y-4">

            {/* ── Action Buttons ───────────────────────────────────── */}
            <div className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Case Actions
              </h3>

              {/* ── Link Culprit Profile ─────────────────────────────── */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowLinkDropdown(prev => !prev)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-indigo-600 text-white border border-indigo-600 rounded-lg cursor-pointer text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <UserSearch className="w-4 h-4" />
                    Link Culprit Profile
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showLinkDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Search Dropdown */}
                {showLinkDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="p-2 border-b">
                      <input
                        type="text"
                        value={profileSearch}
                        onChange={e => setProfileSearch(e.target.value)}
                        placeholder="Search by name or profile number..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        autoFocus
                      />
                    </div>

                    <div className="max-h-56 overflow-y-auto">
                      {searchLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                        </div>
                      ) : searchResults.length === 0 ? (
                        <div className="text-center py-6 text-sm text-gray-500">
                          No profiles found
                        </div>
                      ) : (
                        searchResults.map(profile => {
                          const isAlreadyLinked = linkedProfiles.some(lp => lp.profileId === profile.id);
                          const isLinking = linkingId === profile.id;
                          const caseCount = profileCaseCounts[profile.id];
                          const isLoadingCount = caseCount === undefined;
                          const isLoadingPrev = loadingPreviewId === profile.id;

                          return (
                            <div
                              key={profile.id}
                              className={`flex items-center gap-3 px-3 py-2.5 border-b last:border-0 transition-colors
        ${isAlreadyLinked ? 'bg-green-50' : 'hover:bg-indigo-50'}`}
                            >
                              {/* Avatar */}
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-indigo-600" />
                              </div>

                              {/* Name + Profile Number */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{profile.name}</p>
                                <p className="text-xs text-gray-500">{profile.profileNumber}</p>

                                {/* ── Case Count Badge ─────────────────────────────── */}
                                {isLoadingCount ? (
                                  <span className="inline-flex items-center gap-1 mt-1 text-xs text-gray-400">
                                    <Loader2 className="w-3 h-3 animate-spin" /> loading...
                                  </span>
                                ) : caseCount > 0 ? (
                                  <button
                                    onClick={() => handleOpenProfilePreview(profile.id)}
                                    disabled={isLoadingPrev}
                                    className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 
                       border border-orange-300 rounded-full text-xs font-medium 
                       hover:bg-orange-200 transition-colors cursor-pointer"
                                    title="Click to preview profile"
                                  >
                                    {isLoadingPrev
                                      ? <Loader2 className="w-3 h-3 animate-spin" />
                                      : <Eye className="w-3 h-3" />
                                    }
                                    {caseCount} case{caseCount > 1 ? 's' : ''} linked — view profile
                                  </button>
                                ) : (
                                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-gray-100 
                           text-gray-500 rounded-full text-xs">
                                    No cases linked
                                  </span>
                                )}
                              </div>

                              {/* Link / Already Linked action */}
                              <button
                                onClick={() => !isAlreadyLinked && !isLinking && handleLinkProfile(profile)}
                                disabled={isAlreadyLinked || isLinking}
                                className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors
          ${isAlreadyLinked
                                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                                  }`}
                              >
                                {isLinking
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  : isAlreadyLinked
                                    ? '✓ Linked'
                                    : '+ Link'
                                }
                              </button>
                            </div>
                          );
                        })

                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Linked Profiles List ─────────────────────────────── */}
              {linkedProfiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Linked Profiles ({linkedProfiles.length})
                  </p>
                  {linkedProfiles.map(lp => (
                    <div
                      key={lp.id}
                      className="flex items-center justify-between px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg"
                    >
                      <div
                        className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                        onClick={() => navigate(`/operations/profiles?view=${lp.profileId}`)}
                      >
                        <div className="w-7 h-7 rounded-full bg-indigo-200 flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-indigo-700" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{lp.profileName}</p>
                          <p className="text-xs text-gray-500">{lp.profileNumber}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnlinkProfile(lp)}
                        disabled={unlinkingId === lp.profileId}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        title="Unlink profile"
                      >
                        {unlinkingId === lp.profileId
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <X className="w-3.5 h-3.5" />
                        }
                      </button>
                    </div>
                  ))}
                </div>
              )}


              {/* ✅ Final Report Button — dynamic based on existence */}
              {isCheckingReport ? (
                // Loading state while checking
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-400 border border-gray-200 rounded-lg text-sm font-medium cursor-not-allowed"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking report…
                </button>
              ) : existingReportId ? (
                // ✅ Final report EXISTS — show Preview button
                <button
                  onClick={() => navigate(`/operations/finalreport/${existingReportId}/preview`)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white border border-green-600 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  Preview Final Report
                </button>
              ) : (
                // ✅ No final report — show Generate button
                <button
                  disabled={isFetchingPrefill}
                  onClick={handleGenerateFinalReport}
                  className="w-full flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white border border-blue-600 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetchingPrefill ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ClipboardList className="w-4 h-4" />
                  )}
                  {isFetchingPrefill ? 'Loading…' : 'Generate Final Report'}
                </button>
              )}

              {/* ✅ Show edit option alongside preview if report exists */}
              {!isCheckingReport && existingReportId && (
                <button
                  onClick={() => navigate(`/operations/finalreport/${existingReportId}/edit`)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 bg-white text-orange-600 border border-orange-300 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors cursor-pointer"
                >
                  <ClipboardList className="w-4 h-4" />
                  Edit Final Report
                </button>
              )}
            </div>



            {/* ── Documents Sidebar ────────────────────────────────── */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Documents ({documents.length})
                </h3>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-colors"
                >
                  {uploadMutation.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Upload className="w-3 h-3" />
                  )}
                  {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                onChange={handleFileChange}
              />

              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all mb-4 ${isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
              >
                {uploadMutation.isPending ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    <p className="text-blue-600 text-xs font-medium">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className={`w-6 h-6 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className="text-xs text-gray-500">
                      {isDragging ? 'Drop file here' : 'Drag & drop or click'}
                    </p>
                    <p className="text-xs text-gray-400">PDF, JPG, PNG, DOC — 20MB max</p>
                  </div>
                )}
              </div>

              {/* Documents List */}
              {docsLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <File className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">No documents yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      {/* Thumbnail or icon */}
                      <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                        {isImage(doc.fileType) ? (
                          <img
                            src={doc.fileUrl}
                            alt={doc.originalName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getFileIcon(doc.fileType)
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-medium text-gray-900 truncate"
                          title={doc.originalName}
                        >
                          {doc.originalName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">
                            {getTypeLabel(doc.fileType)}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-400">
                            {formatSize(doc.fileSize)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {format(new Date(doc.uploadedAt), 'dd MMM yyyy')}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isImage(doc.fileType) && (
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="p-1 text-gray-500 hover:text-blue-600 rounded"
                            title="Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-500 hover:text-blue-600 rounded"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(doc)}
                          disabled={deletingId === doc.id}
                          className="p-1 text-gray-500 hover:text-red-600 rounded disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === doc.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />
                          }
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Image Preview Modal ─────────────────────────────────────── */}
      {previewDoc && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 flex items-center gap-1 text-sm"
            >
              <X className="w-5 h-5" />
              Close
            </button>
            <img
              src={previewDoc.fileUrl}
              alt={previewDoc.originalName}
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white px-4 py-2 rounded-b-lg">
              <p className="text-sm font-medium">{previewDoc.originalName}</p>
              <p className="text-xs text-gray-300">
                {formatSize(previewDoc.fileSize)} • By {previewDoc.uploadedBy} •{' '}
                {format(new Date(previewDoc.uploadedAt), 'dd MMM yyyy, hh:mm a')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Profile Preview Modal ───────────────────────────────────── */}
      {previewProfile && (
        <ProfilePreview
          profile={previewProfile}
          onClose={() => {
            setPreviewProfile(null);
          }}
        />
      )}
    </div>
  );
};

export default CaseDashboard;
