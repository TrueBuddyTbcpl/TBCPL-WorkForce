import { useState } from 'react';
import { FileText, Eye, FolderOpen } from 'lucide-react';
import CaseForm from './CaseForm';
import CasePreview from './CasePreview';
import CaseDashboard from './CaseDashboard';
import type { CaseData } from './types/case.types';

type ViewMode = 'list' | 'form' | 'preview' | 'dashboard';

const CaseIndex = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [cases, setCases] = useState<CaseData[]>([]);
    const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);

    const handleCaseCreated = (newCase: CaseData) => {
        setCases(prev => [...prev, newCase]);
        setSelectedCase(newCase);
        setViewMode('preview');
    };

    const handleCaseUpdated = (updatedCase: CaseData) => {
        setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
        setSelectedCase(updatedCase);
    };

    const handleViewCase = (caseData: CaseData) => {
        setSelectedCase(caseData);
        setViewMode('preview');
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
            case 'Low': return 'bg-green-100 text-green-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'High': return 'bg-orange-100 text-orange-800';
            case 'Critical': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Render based on view mode
    if (viewMode === 'form') {
        return (
            <CaseForm
                onComplete={handleCaseCreated}
                initialData={null}
            />
        );
    }

    if (viewMode === 'preview' && selectedCase) {
        return (
            <CasePreview
                data={selectedCase}
                onEdit={() => setViewMode('form')}
                onOpenDashboard={() => setViewMode('dashboard')}
            />
        );
    }

    if (viewMode === 'dashboard' && selectedCase) {
        return (
            <CaseDashboard
                caseData={selectedCase}
                onUpdate={handleCaseUpdated}
                onBack={() => setViewMode('preview')}
            />
        );
    }

    // List View
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <FolderOpen className="w-8 h-8 text-blue-600" />
                                Case Management
                            </h1>
                            <p className="text-gray-600 mt-1">Manage and track all investigation cases</p>
                        </div>
                        <button
                            onClick={() => setViewMode('form')}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            <FileText className="w-5 h-5" />
                            Create New Case
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">{cases.length}</div>
                        <div className="text-sm text-gray-600 mt-1">Total Cases</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-yellow-600">
                            {cases.filter(c => c.basicInfo.status === 'Under Investigation').length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Under Investigation</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {cases.filter(c => c.basicInfo.status === 'Closed').length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Closed Cases</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-600">
                            {cases.filter(c => c.basicInfo.priority === 'Critical').length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Critical Priority</div>
                    </div>
                </div>

                {/* Cases List */}
                {cases.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                        <FileText className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Cases Yet</h3>
                        <p className="text-gray-600 mb-6">Get started by creating your first case</p>
                        <button
                            onClick={() => setViewMode('form')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create First Case
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">All Cases</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {cases.map((caseData) => (
                                <div
                                    key={caseData.id}
                                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => handleViewCase(caseData)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {/* ✅ Updated: Show Client Name as title */}
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {caseData.basicInfo.clientName}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(caseData.basicInfo.status)}`}>
                                                    {caseData.basicInfo.status}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(caseData.basicInfo.priority)}`}>
                                                    {caseData.basicInfo.priority}
                                                </span>
                                            </div>
                                            {/* ✅ Updated: Show Client Product */}
                                            <p className="text-sm text-blue-600 font-medium mb-2">
                                                Product: {caseData.basicInfo.clientProduct}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {caseData.basicInfo.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span>Case #: {caseData.basicInfo.caseNumber}</span>
                                                <span>•</span>
                                                <span>Client: {caseData.clientDetails.clientName}</span>
                                                <span>•</span>
                                                <span>Lead: {caseData.clientDetails.leadType}</span>
                                                <span>•</span>
                                                <span>Team: {caseData.investigation.assignedEmployees.length} members</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewCase(caseData);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaseIndex;
