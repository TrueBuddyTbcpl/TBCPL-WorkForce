import { Edit, Printer, Share2, Calendar, Users, Briefcase, AlertTriangle } from 'lucide-react';
import type { CaseData } from './types/case.types';
import { availableEmployees, availableCulprits } from './data/caseOptions';
import { format } from 'date-fns';

interface Props {
  data: CaseData;
  onEdit: () => void;
  onOpenDashboard: () => void;
}

const CasePreview = ({ data, onEdit, onOpenDashboard }: Props) => {
  if (!data || !data.basicInfo || !data.clientDetails || !data.investigation) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No case data available</p>
          <button
            onClick={onEdit}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Case
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    alert('Share functionality will be implemented soon!');
  };

  const getPriorityColor = (priority: string) => {
    const lowercasePriority = priority.toLowerCase();
    switch (lowercasePriority) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    const lowercaseStatus = status.toLowerCase();
    switch (lowercaseStatus) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const lowercaseStatus = status.toLowerCase();
    switch (lowercaseStatus) {
      case 'open': return 'Open';
      case 'in-progress': return 'Under Investigation';
      case 'on-hold': return 'On Hold';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const getAssignedEmployees = () => {
    return data.investigation.assignedEmployees.map(empId =>
      availableEmployees.find(e => e.id === empId)
    ).filter(Boolean);
  };

  const getLinkedCulprits = () => {
    // ✅ Fixed: Handle optional linkedCulprits
    if (!data.investigation.linkedCulprits) return [];
    return data.investigation.linkedCulprits.map(culpritId =>
      availableCulprits.find(c => c.id === culpritId)
    ).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex justify-between items-center print:hidden sticky top-4 z-10">
          <div className="flex gap-3">
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              Open Dashboard
            </button>
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Case
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Case ID:</span>
            <span className="font-mono font-semibold text-blue-600">{data.basicInfo.caseNumber}</span>
          </div>
        </div>

        {/* Case Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{data.basicInfo.clientName}</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Client
                </span>
              </div>
              <p className="text-lg text-blue-600 font-medium mb-3">
                Product: {data.basicInfo.clientProduct}
              </p>
              <p className="text-gray-600">{data.basicInfo.description}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(data.basicInfo.status)}`}>
                {getStatusLabel(data.basicInfo.status)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Priority:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(data.basicInfo.priority)}`}>
                {getPriorityLabel(data.basicInfo.priority)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Lead Type:</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {data.investigation.leadType} {/* ✅ Fixed: Get from investigation */}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Opened: {format(new Date(data.basicInfo.dateOpened), 'dd MMM yyyy')}</span> {/* ✅ Fixed: Use dateOpened */}
              </div>
              <div>Created: {format(new Date(data.createdAt), 'dd MMM yyyy, hh:mm a')}</div>
            </div>
            <div>Last Updated: {format(new Date(data.lastUpdated), 'dd MMM yyyy, hh:mm a')}</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Client Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Client Name:</span>
                <p className="text-sm font-medium text-gray-900">{data.clientDetails.clientName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Lead Type:</span>
                <p className="text-sm font-medium text-gray-900">{data.investigation.leadType}</p> {/* ✅ Fixed */}
              </div>
              <div>
                <span className="text-sm text-gray-600">Product/Service Under Investigation:</span>
                <p className="text-sm font-medium text-gray-900">{data.clientDetails.productService}</p>
              </div>
              {data.clientDetails.clientContact && (
                <div>
                  <span className="text-sm text-gray-600">Contact:</span>
                  <p className="text-sm font-medium text-gray-900">{data.clientDetails.clientContact}</p>
                </div>
              )}
              {data.clientDetails.clientEmail && (
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="text-sm font-medium text-gray-900">{data.clientDetails.clientEmail}</p>
                </div>
              )}
            </div>
          </div>

          {/* Case Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Case Details
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Case Number:</span>
                <p className="text-sm font-medium text-gray-900">{data.basicInfo.caseNumber}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Case Title:</span>
                <p className="text-sm font-medium text-gray-900">{data.basicInfo.caseTitle}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Client Product:</span>
                <p className="text-sm font-medium text-gray-900">{data.basicInfo.clientProduct}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Case Opened:</span>
                <p className="text-sm font-medium text-gray-900">
                  {format(new Date(data.basicInfo.dateOpened), 'dd MMM yyyy')} {/* ✅ Fixed */}
                </p>
              </div>
              {data.basicInfo.dateClosed && (
                <div>
                  <span className="text-sm text-gray-600">Case Closed:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(data.basicInfo.dateClosed), 'dd MMM yyyy')}
                  </p>
                </div>
              )}
              {data.investigation.estimatedCompletionDate && (
                <div>
                  <span className="text-sm text-gray-600">Estimated Completion:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(data.investigation.estimatedCompletionDate), 'dd MMM yyyy')}
                  </p>
                </div>
              )}
              {data.investigation.actualCompletionDate && (
                <div>
                  <span className="text-sm text-gray-600">Actual Completion:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(data.investigation.actualCompletionDate), 'dd MMM yyyy')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Case Description */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Case Description</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.basicInfo.description}</p>
        </div>

        {/* Assigned Team */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
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
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
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

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 print:mt-12">
          <p>This case report was generated by Trubuddy Case Management System</p>
          <p className="mt-1">Created by: {data.createdBy} | Case ID: {data.basicInfo.caseNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default CasePreview;
