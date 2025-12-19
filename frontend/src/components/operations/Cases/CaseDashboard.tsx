import { Clock } from 'lucide-react';
import type { CaseData } from './types/case.types';
import { availableEmployees, availableCulprits } from './data/caseOptions';
import { format } from 'date-fns';

interface Props {
  caseData: CaseData;
  onUpdate: (updatedCase: CaseData) => void;
  onBack: () => void;
}

const CaseDashboard = ({ caseData, onBack }: Props) => {
  const getAssignedEmployees = () => {
    return caseData.investigation.assignedEmployees.map(empId =>
      availableEmployees.find(e => e.id === empId)
    ).filter(Boolean);
  };

  const getLinkedCulprits = () => {
    return caseData.investigation.linkedCulprits.map(culpritId =>
      availableCulprits.find(c => c.id === culpritId)
    ).filter(Boolean);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'Under Investigation': return 'bg-yellow-100 text-yellow-800';
      case 'On Hold': return 'bg-gray-100 text-gray-800';
      case 'Closed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <button
                onClick={onBack}
                className="text-sm text-blue-600 hover:text-blue-700 mb-2 flex items-center gap-1"
              >
                ← Back to Preview
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{caseData.basicInfo.clientName}</h1>
              <p className="text-lg text-blue-600 font-medium">Product: {caseData.basicInfo.clientProduct}</p>
              <p className="text-gray-600 mt-1">Case ID: {caseData.basicInfo.caseNumber}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(caseData.basicInfo.status)}`}>
                {caseData.basicInfo.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Priority:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(caseData.basicInfo.priority)}`}>
                {caseData.basicInfo.priority}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Last Updated: {format(new Date(caseData.lastUpdated), 'dd MMM yyyy, hh:mm a')}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Case Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Client Name:</span>
                  <span className="text-sm font-medium text-gray-900">{caseData.basicInfo.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Client Product:</span>
                  <span className="text-sm font-medium text-gray-900">{caseData.basicInfo.clientProduct}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reported Date:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {format(new Date(caseData.basicInfo.reportedDate), 'dd MMM yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Created By:</span>
                  <span className="text-sm font-medium text-gray-900">{caseData.createdBy}</span>
                </div>
              </div>
            </div>

            {/* Client Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Client Name:</span>
                  <span className="text-sm font-medium text-gray-900">{caseData.clientDetails.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Lead Type:</span>
                  <span className="text-sm font-medium text-gray-900">{caseData.clientDetails.leadType}</span>
                </div>
                {caseData.clientDetails.clientContact && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Contact:</span>
                    <span className="text-sm font-medium text-gray-900">{caseData.clientDetails.clientContact}</span>
                  </div>
                )}
                {caseData.clientDetails.clientEmail && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-medium text-gray-900">{caseData.clientDetails.clientEmail}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Case Description</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{caseData.basicInfo.description}</p>
          </div>

          {/* Product/Service */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product/Service Under Investigation</h3>
            <p className="text-sm text-gray-700">{caseData.clientDetails.productService}</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{getAssignedEmployees().length}</div>
              <div className="text-sm text-gray-600 mt-1">Team Members</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{getLinkedCulprits().length}</div>
              <div className="text-sm text-gray-600 mt-1">Linked Culprits</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{caseData.documents?.length || 0}</div>
              <div className="text-sm text-gray-600 mt-1">Documents</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{caseData.updates?.length || 0}</div>
              <div className="text-sm text-gray-600 mt-1">Updates</div>
            </div>
          </div>

          {/* Assigned Team */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assigned Team ({getAssignedEmployees().length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getAssignedEmployees().map((employee) => (
                <div
                  key={employee?.id}
                  className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {employee?.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{employee?.name}</p>
                    <p className="text-xs text-gray-600">{employee?.role}</p>
                    <p className="text-xs text-gray-500">{employee?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linked Culprits */}
          {getLinkedCulprits().length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Linked Culprit Profiles ({getLinkedCulprits().length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getLinkedCulprits().map((culprit) => (
                  <div
                    key={culprit?.id}
                    className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{culprit?.id}</p>
                      <p className="text-sm text-gray-700">{culprit?.name}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded-full">
                      {culprit?.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Note about additional features */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              📝 <strong>Note:</strong> Document management and investigation updates are coming soon. This dashboard currently shows case overview and team information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDashboard;
