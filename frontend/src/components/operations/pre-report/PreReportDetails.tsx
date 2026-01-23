import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Download, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { usePreReportDetail } from '../../../hooks/prereport/usePreReportDetail';
import { PreReportStatusBadge } from './PreReportStatusBadge';
import { formatDate, formatLeadType } from '../../../utils/formatters';
import { getStepTitle } from '../../../utils/helpers';
import { getCompletionPercentage } from '../../../utils/stepValidation';

export const PreReportDetails = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);

  const { data, isLoading, isError } = usePreReportDetail(reportId!);

  const toggleStep = (stepNum: number) => {
    setExpandedSteps(prev =>
      prev.includes(stepNum)
        ? prev.filter(s => s !== stepNum)
        : [...prev, stepNum]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">Error loading report</p>
          <button
            onClick={() => navigate('/operations/pre-report')}
            className="text-blue-600 hover:underline"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const { preReport, clientLeadData, trueBuddyLeadData } = data;
  const completionPercentage = getCompletionPercentage(
    preReport.leadType,
    clientLeadData,
    trueBuddyLeadData
  );

  // Map step numbers to their corresponding fields
  const getStepFields = (stepNum: number, isClientLead: boolean): string[] => {
    if (isClientLead) {
      const clientLeadSteps: Record<number, string[]> = {
        1: ['dateInfoReceived', 'clientSpocName', 'clientSpocContact'],
        2: ['scopeDueDiligence', 'scopeIprRetailer', 'scopeIprSupplier', 'scopeIprManufacturer', 'scopeOnlinePurchase', 'scopeOfflinePurchase', 'scopeCustomIds'],
        3: ['entityName', 'suspectName', 'contactNumbers', 'addressLine1', 'addressLine2', 'city', 'state', 'pincode', 'onlinePresences', 'productDetails', 'photosProvided', 'videoProvided', 'invoiceAvailable', 'sourceNarrative'],
        4: ['verificationClientDiscussion', 'verificationClientDiscussionNotes', 'verificationOsint', 'verificationOsintNotes', 'verificationMarketplace', 'verificationMarketplaceNotes', 'verificationPretextCalling', 'verificationPretextCallingNotes', 'verificationProductReview', 'verificationProductReviewNotes'],
        5: ['obsIdentifiableTarget', 'obsTraceability', 'obsProductVisibility', 'obsCounterfeitingIndications', 'obsEvidentiary_gaps'],
        6: ['qaCompleteness', 'qaAccuracy', 'qaIndependentInvestigation', 'qaPriorConfrontation', 'qaContaminationRisk'],
        7: ['assessmentOverall', 'assessmentRationale'],
        8: ['recMarketSurvey', 'recCovertInvestigation', 'recTestPurchase', 'recEnforcementAction', 'recAdditionalInfo', 'recClosureHold'],
        9: ['remarks'],
        10: ['customDisclaimer']
      };
      return clientLeadSteps[stepNum] || [];
    } else {
      const trueBuddySteps: Record<number, string[]> = {
        1: ['dateInternalLeadGeneration', 'productCategory', 'infringementType', 'broadGeography', 'clientSpocName', 'clientSpocDesignation', 'natureOfEntity'],
        2: ['scopeIprSupplier', 'scopeIprManufacturer', 'scopeIprStockist', 'scopeMarketVerification', 'scopeEtp', 'scopeEnforcement'],
        3: ['intelNature', 'suspectedActivity', 'productSegment', 'supplyChainStage', 'repeatIntelligence', 'multiBrandRisk'],
        4: ['verificationIntelCorroboration', 'verificationIntelCorroborationNotes', 'verificationOsint', 'verificationOsintNotes', 'verificationPatternMapping', 'verificationPatternMappingNotes', 'verificationJurisdiction', 'verificationJurisdictionNotes', 'verificationRiskAssessment', 'verificationRiskAssessmentNotes'],
        5: ['obsOperationScale', 'obsCounterfeitLikelihood', 'obsBrandExposure', 'obsEnforcementSensitivity', 'obsLeakageRisk'],
        6: ['riskSourceReliability', 'riskClientConflict', 'riskImmediateAction', 'riskControlledValidation', 'riskPrematureDisclosure'],
        7: ['assessmentOverall', 'assessmentRationale'],
        8: ['recCovertValidation', 'recEtp', 'recMarketReconnaissance', 'recEnforcementDeferred', 'recContinuedMonitoring', 'recClientSegregation'],
        9: ['confidentialityNote'],
        10: ['remarks'],
        11: ['customDisclaimer']
      };
      return trueBuddySteps[stepNum] || [];
    }
  };

  // Get step data by extracting relevant fields
  const getStepData = (stepNum: number) => {
    const isClientLead = preReport.leadType === 'CLIENT_LEAD';
    const sourceData = isClientLead ? clientLeadData : trueBuddyLeadData;
    
    if (!sourceData) return null;

    const fields = getStepFields(stepNum, isClientLead);
    const stepData: Record<string, any> = {};
    
    fields.forEach(field => {
      const value = sourceData[field as keyof typeof sourceData];
      if (value !== undefined && value !== null && value !== '') {
        stepData[field] = value;
      }
    });

    return Object.keys(stepData).length > 0 ? stepData : null;
  };

  // Format camelCase to readable
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Render field helper
  const renderField = (label: string, value: any) => {
    if (value === null || value === undefined || value === '') return null;
    
    // Skip createdAt and updatedAt fields
    if (label.toLowerCase().includes('created at') || label.toLowerCase().includes('updated at')) {
      return null;
    }
    
    // Handle boolean values
    if (typeof value === 'boolean') {
      return (
        <div key={label} className="py-2 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          <span className={`ml-2 text-sm font-semibold ${value ? 'text-green-600' : 'text-red-600'}`}>
            {value ? 'Yes' : 'No'}
          </span>
        </div>
      );
    }

    // Handle Online Presences specifically with table format
    if (label === 'Online Presences' && Array.isArray(value) && value.length > 0) {
      return (
        <div key={label} className="py-3 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700 block mb-2">{label}:</span>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {value.map((presence: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {presence.platformName || 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-sm text-blue-600">
                      <a
                        href={presence.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline break-all"
                      >
                        {presence.link}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Handle regular arrays (non-online presences)
    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      return (
        <div key={label} className="py-2 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {value.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-xs text-blue-700"
              >
                {typeof item === 'object' ? JSON.stringify(item) : String(item)}
              </span>
            ))}
          </div>
        </div>
      );
    }

    // Handle dates
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return (
        <div key={label} className="py-2 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          <span className="ml-2 text-sm text-gray-900">{formatDate(value)}</span>
        </div>
      );
    }

    // Handle objects (nested data - but not already handled above)
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={label} className="py-2 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          <div className="ml-4 mt-1 space-y-1 text-xs bg-gray-50 p-2 rounded">
            <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
          </div>
        </div>
      );
    }

    // Regular text/numbers
    return (
      <div key={label} className="py-2 border-b border-gray-100 last:border-0">
        <span className="text-sm font-medium text-gray-700">{label}:</span>
        <span className="ml-2 text-sm text-gray-900">{String(value)}</span>
      </div>
    );
  };

  // Render step details
  const renderStepDetails = (stepData: Record<string, any> | null) => {
    if (!stepData || Object.keys(stepData).length === 0) {
      return (
        <p className="text-gray-500 text-sm italic">No data entered yet</p>
      );
    }

    return (
      <div className="mt-3 bg-gray-50 rounded-lg p-4 space-y-1">
        {Object.entries(stepData)
          .filter(([key]) => 
            // Filter out internal/metadata fields
            key !== 'id' && 
            key !== 'prereportId' && 
            key !== 'createdAt' && 
            key !== 'updatedAt'
          )
          .map(([key, value]) =>
            renderField(formatLabel(key), value)
          )}
      </div>
    );
  };

  const totalSteps = preReport.leadType === 'CLIENT_LEAD' ? 10 : 11;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/operations/pre-report')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Reports
        </button>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{preReport.reportId}</h1>
            <p className="text-gray-600 mt-1">{preReport.clientName}</p>
          </div>
          <div className="flex items-center gap-3">
            <PreReportStatusBadge status={preReport.reportStatus} />
            <button
              onClick={() => navigate(`/operations/pre-report/${reportId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => navigate(`/operations/pre-report/${reportId}/pdf`)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500">Lead Type</p>
            <p className="font-medium text-gray-900">{formatLeadType(preReport.leadType)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created Date</p>
            <p className="font-medium text-gray-900">{formatDate(preReport.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium text-gray-900">{formatDate(preReport.updatedAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Completion</p>
            <p className="font-medium text-gray-900">{completionPercentage}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Products */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Products:</p>
          <div className="flex flex-wrap gap-2">
            {preReport.productNames.map((product, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-sm text-blue-700"
              >
                {product}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step Details - Expandable */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Step Details</h2>
        <div className="space-y-3">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => {
            const stepData = getStepData(stepNum);
            const isCompleted = preReport.currentStep >= stepNum;
            const isExpanded = expandedSteps.includes(stepNum);
            const hasData = stepData && Object.keys(stepData).length > 0;

            return (
              <div
                key={stepNum}
                className={`border rounded-lg transition-all ${
                  isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                }`}
              >
                {/* Step Header */}
                <button
                  onClick={() => toggleStep(stepNum)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-semibold ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {stepNum}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">
                        {getStepTitle(preReport.leadType, stepNum)}
                      </p>
                      {hasData && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {Object.keys(stepData).length} fields filled
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-medium ${
                        isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {isCompleted ? 'Completed' : 'Pending'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Step Content - Expandable */}
                {isExpanded && (
                  <div className="px-4 pb-4">
                    {renderStepDetails(stepData)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PreReportDetails;
