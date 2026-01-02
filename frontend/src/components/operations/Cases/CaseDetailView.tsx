import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Trash2, Calendar, Users, Briefcase, 
  AlertCircle, FileText, Package,
  Clock, CheckCircle, XCircle, ChevronDown, Link, UserPlus
} from 'lucide-react';
import { dashboardStorage } from '../dashboard/utils/dashboardStorage';
import type { Case } from '../dashboard/types/dashboard.types';

// ========================================
// Link Profile Dropdown Component
// ========================================
interface LinkProfileDropdownProps {
  caseId: string;
  navigate: any;
}

const LinkProfileDropdown: React.FC<LinkProfileDropdownProps> = ({ caseId, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [linkedProfiles, setLinkedProfiles] = useState<string[]>([]);

  useEffect(() => {
    // Load existing profiles from localStorage
    const loadedProfiles = JSON.parse(localStorage.getItem('culprit_profiles') || '[]');
    setProfiles(loadedProfiles);

    // Load linked profiles for this case
    const caseLinks = JSON.parse(localStorage.getItem('case_profile_links') || '{}');
    setLinkedProfiles(caseLinks[caseId] || []);
  }, [caseId]);

  const handleLinkProfile = (profileId: string) => {
    // Add profile to linked profiles
    const caseLinks = JSON.parse(localStorage.getItem('case_profile_links') || '{}');
    const currentLinks = caseLinks[caseId] || [];
    
    if (!currentLinks.includes(profileId)) {
      caseLinks[caseId] = [...currentLinks, profileId];
      localStorage.setItem('case_profile_links', JSON.stringify(caseLinks));
      setLinkedProfiles(caseLinks[caseId]);
      
      // Update case profilesLinked count
      const cases = dashboardStorage.getCases();
      const updatedCases = cases.map((c: any) => {
        if (c.id === caseId) {
          return { ...c, profilesLinked: caseLinks[caseId].length };
        }
        return c;
      });
      dashboardStorage.saveCases(updatedCases);
      
      alert('Profile linked successfully!');
      setIsOpen(false);
      window.location.reload();
    } else {
      alert('Profile already linked to this case!');
    }
  };

  const handleUnlinkProfile = (profileId: string) => {
    if (window.confirm('Are you sure you want to unlink this profile?')) {
      const caseLinks = JSON.parse(localStorage.getItem('case_profile_links') || '{}');
      const currentLinks = caseLinks[caseId] || [];
      caseLinks[caseId] = currentLinks.filter((id: string) => id !== profileId);
      localStorage.setItem('case_profile_links', JSON.stringify(caseLinks));
      setLinkedProfiles(caseLinks[caseId]);
      
      // Update case profilesLinked count
      const cases = dashboardStorage.getCases();
      const updatedCases = cases.map((c: any) => {
        if (c.id === caseId) {
          return { ...c, profilesLinked: caseLinks[caseId].length };
        }
        return c;
      });
      dashboardStorage.saveCases(updatedCases);
      
      alert('Profile unlinked successfully!');
      window.location.reload();
    }
  };

  const availableProfiles = profiles.filter(p => !linkedProfiles.includes(p.id));
  const linked = profiles.filter(p => linkedProfiles.includes(p.id));

  return (
    <div className="relative">
      <button 
        className="w-full flex items-center justify-between gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4" />
          Link Profile
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            {/* Linked Profiles Section */}
            {linked.length > 0 && (
              <div className="p-2 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase px-2 py-1">
                  Linked Profiles ({linked.length})
                </p>
                {linked.map((profile) => (
                  <div 
                    key={profile.id}
                    className="flex items-center justify-between px-3 py-2 hover:bg-green-50 rounded text-sm"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="font-medium text-gray-900 truncate">
                        {profile.name || `${profile.personal?.firstName} ${profile.personal?.lastName}`}
                      </span>
                    </div>
                    <button
                      onClick={() => handleUnlinkProfile(profile.id)}
                      className="text-xs text-red-600 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded"
                    >
                      Unlink
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Available Profiles Section */}
            {availableProfiles.length > 0 ? (
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-600 uppercase px-2 py-1">
                  Available Profiles ({availableProfiles.length})
                </p>
                {availableProfiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => handleLinkProfile(profile.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded text-sm text-left transition"
                  >
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-900 truncate">
                      {profile.name || `${profile.personal?.firstName} ${profile.personal?.lastName}`}
                    </span>
                    {profile.personal?.alias && (
                      <span className="text-xs text-gray-500">({profile.personal.alias})</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              !linked.length && (
                <div className="p-4 text-center text-sm text-gray-600">
                  <p>No profiles available</p>
                </div>
              )
            )}

            {/* Add New Profile Button */}
            <div className="p-2 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/operations/profile-form');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Add New Profile
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ========================================
// Main CaseDetailView Component
// ========================================
const CaseDetailView: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (caseId) {
      // Load case from localStorage
      const loadedCase = dashboardStorage.getCaseById(caseId);
      setCaseData(loadedCase);

      // Load associated report data safely
      try {
        const reportDataString = localStorage.getItem('report_data');
        
        if (reportDataString) {
          const parsedReportData = JSON.parse(reportDataString);
          
          // Check if it's an array or a single object
          if (Array.isArray(parsedReportData)) {
            const associatedReport = parsedReportData.find((r: any) => r.caseId === caseId);
            setReportData(associatedReport);
          } else if (parsedReportData && typeof parsedReportData === 'object') {
            if (parsedReportData.caseId === caseId) {
              setReportData(parsedReportData);
            }
          }
        }
      } catch (error) {
        console.error('Error loading report data:', error);
        setReportData(null);
      }
      
      setLoading(false);
    }
  }, [caseId]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
      const cases = dashboardStorage.getCases();
      const updatedCases = cases.filter((c: Case) => c.id !== caseId);
      dashboardStorage.saveCases(updatedCases);
      
      alert('Case deleted successfully!');
      navigate('/operations/dashboard');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Case Not Found</h2>
          <p className="text-gray-600 mb-4">The case you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/operations/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Action Bar - Sticky */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex justify-between items-center sticky top-0 z-10 print:hidden">
          <button
            onClick={() => navigate('/operations/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/operations/case/edit/${caseData.id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Edit className="w-4 h-4" />
              Edit Case
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <FileText className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Case Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{caseData.title}</h1>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg font-mono text-blue-600 font-semibold">
                  📋 {caseData.caseNumber}
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">
                  🏢 {caseData.client.name}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">{caseData.description}</p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(caseData.status)}`}>
                {caseData.status === 'in-progress' ? 'In Progress' : caseData.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Priority:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getPriorityColor(caseData.priority)}`}>
                {caseData.priority}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <div>
                <span className="block text-xs text-gray-500">Created</span>
                <span className="font-medium text-gray-900">
                  {new Date(caseData.createdDate).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <div>
                <span className="block text-xs text-gray-500">Last Updated</span>
                <span className="font-medium text-gray-900">
                  {new Date(caseData.lastUpdated).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <div>
                <span className="block text-xs text-gray-500">Assigned To</span>
                <span className="font-medium text-gray-900">{caseData.assignedTo.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profiles Linked</p>
                <p className="text-3xl font-bold text-blue-600">{caseData.profilesLinked}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reports Generated</p>
                <p className="text-3xl font-bold text-purple-600">{caseData.reportsGenerated}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{caseData.status}</p>
              </div>
              <div className={`p-3 rounded-lg ${
                caseData.status === 'closed' ? 'bg-gray-100' :
                caseData.status === 'open' ? 'bg-green-100' :
                'bg-blue-100'
              }`}>
                {caseData.status === 'closed' ? (
                  <CheckCircle className="w-8 h-8 text-gray-600" />
                ) : caseData.status === 'on-hold' ? (
                  <XCircle className="w-8 h-8 text-yellow-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-blue-600" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Priority</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{caseData.priority}</p>
              </div>
              <div className={`p-3 rounded-lg ${
                caseData.priority === 'critical' ? 'bg-red-100' :
                caseData.priority === 'high' ? 'bg-orange-100' :
                caseData.priority === 'medium' ? 'bg-blue-100' :
                'bg-gray-100'
              }`}>
                <AlertCircle className={`w-8 h-8 ${
                  caseData.priority === 'critical' ? 'text-red-600' :
                  caseData.priority === 'high' ? 'text-orange-600' :
                  caseData.priority === 'medium' ? 'text-blue-600' :
                  'text-gray-600'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Client Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Client Name</span>
                  <p className="text-base font-medium text-gray-900">{caseData.client.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Product/Service</span>
                  <p className="text-base font-medium text-gray-900">{caseData.client.productName}</p>
                </div>
                {caseData.client.logo && (
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600 block mb-2">Client Logo</span>
                    <img 
                      src={caseData.client.logo} 
                      alt={caseData.client.name} 
                      className="h-16 object-contain border rounded p-2 bg-gray-50" 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Case Description */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Detailed Description
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {caseData.description}
              </p>
            </div>

            {/* Report Sections - If report data exists */}
            {reportData && reportData.sections && reportData.sections.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Report Sections ({reportData.sections.length})
                </h3>
                <div className="space-y-4">
                  {reportData.sections.map((section: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
                      <h4 className="font-semibold text-gray-900 mb-1">{section.title}</h4>
                      <p className="text-sm text-gray-600">{section.type}</p>
                      {section.content && (
                        <p className="text-sm text-gray-700 mt-2">{section.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Assigned Team Member */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Assigned Team
              </h3>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {caseData.assignedTo.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{caseData.assignedTo.name}</p>
                  <p className="text-sm text-gray-600">{caseData.assignedTo.role}</p>
                  <p className="text-sm text-gray-500 truncate">{caseData.assignedTo.email}</p>
                  <p className="text-sm text-gray-500">{caseData.assignedTo.phone}</p>
                </div>
              </div>
            </div>

            {/* Case Timeline */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Case Created</p>
                    <p className="text-xs text-gray-600">
                      {new Date(caseData.createdDate).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-xs text-gray-600">
                      {new Date(caseData.lastUpdated).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  onClick={() => navigate(`/operations/case/edit/${caseData.id}`)}
                >
                  <Edit className="w-4 h-4" />
                  Edit Case Details
                </button>
                <button 
                  className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                  onClick={() => navigate('/operations/report-create')}
                >
                  <FileText className="w-4 h-4" />
                  Generate Report
                </button>
                
                {/* Link Profile Dropdown */}
                <LinkProfileDropdown caseId={caseData.id} navigate={navigate} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 print:mt-12">
          <p>TBCPL Workforce Management System - Case Management Dashboard</p>
          <p className="mt-1">Case ID: {caseData.caseNumber} | Generated on: {new Date().toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailView;
