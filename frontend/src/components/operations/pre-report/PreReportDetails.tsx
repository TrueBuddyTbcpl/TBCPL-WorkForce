import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit, Download, Loader2,
  ChevronDown, ChevronUp, Mail, Eye,
  AlertTriangle, XCircle,
} from 'lucide-react';
import { usePreReportDetail } from '../../../hooks/prereport/usePreReportDetail';
import { useCustomScopes } from '../../../hooks/prereport/useCustomScope';
import { PreReportStatusBadge } from './PreReportStatusBadge';
import { formatDate, formatLeadType } from '../../../utils/formatters';
import { getCompletionPercentage } from '../../../utils/stepValidation';
import { exportPreReportToPDF, type PreReportPDFData } from '../../../utils/preReportPdfExport';
import { toast } from 'sonner';
import { useAuthStore } from '../../../stores/authStore';
// ✅ ADD this import (after useAuthStore import):
import { apiClient } from '../../../lib/api-client';
import { SendMailModal } from './SendMailModal';

type StepConfig = {
  stepNumber: number;
  title: string;
  fields: string[];
};

// ✅ Fix
// ✅ Match exactly what backend returns
type CustomScopeItem = {
  id: number;
  stepNumber: number;
  optionName: string;
  optionDescription?: string;
  leadType: string;
  fieldKey?: string;
};

type VerificationCustomItem = {
  optionId: number;
  status?: string;
  notes?: string;
};

type ObservationCustomItem = {
  optionId: number;
  text?: string;
};

type RiskCustomItem = {
  optionId: number;
  value?: string;
};

const FIELD_LABELS: Record<string, string> = {
  dateInfoReceived: 'Date Info Received',
  scopeCustomIds: 'Custom Scope Options',
  verificationCustomData: 'Custom Verification Items',
  observationsCustomData: 'Custom Observations',
  riskCustomData: 'Custom Risk Factors',
  recCustomIds: 'Custom Recommendations',
  productCategoryCustomText: 'Product Category (Custom)',
  infringementTypeCustomText: 'Infringement Type (Custom)',
  reasonOfSuspicionCustomText: 'Reason of Suspicion (Custom)',
  natureOfEntityCustomText: 'Nature of Entity (Custom)',
  intelNatureCustomText: 'Nature of Intelligence (Custom)',
  suspectedActivityCustomText: 'Suspected Activity (Custom)',
  productSegmentCustomText: 'Product Segment (Custom)',
  obsBrandExposureCustomText: 'Brand Exposure (Custom)',
  obsEvidentiary_gaps: 'Evidentiary Gaps',
};

const formatLabel = (key: string) =>
  FIELD_LABELS[key] ??
  key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\s+/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .trim();

const formatDisplayText = (value: unknown) =>
  String(value ?? '').replace(/_/g, ' ');

export const PreReportDetails = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  // Add these right after const [isExporting, setIsExporting] = useState(false);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);

  const { user } = useAuthStore();

  const isAdmin =
    user?.roleName === 'SUPER_ADMIN' || user?.roleName === 'ADMIN';

  const canPreview =
    user?.roleName === 'SUPER_ADMIN' ||
    user?.roleName === 'ADMIN' ||
    user?.roleName === 'ASSOCIATE';

  const preReportsPath =
    user?.roleName === 'SUPER_ADMIN' || user?.roleName === 'ADMIN'
      ? '/admin/pre-reports'
      : '/operations/pre-reports';

  const { data, isLoading, isError } = usePreReportDetail(reportId!);

  const { data: customScopes = [] } = useCustomScopes();
  console.log('✅ customScopes from API:', customScopes);


  const preReport = data?.preReport;
  const clientLeadData = data?.clientLeadData;
  const trueBuddyLeadData = data?.trueBuddyLeadData;
  const [allCustomOptions, setAllCustomOptions] = useState<CustomScopeItem[]>([]);
  useEffect(() => {
    if (!preReport?.leadType) return;
    const leadType = preReport.leadType;

    Promise.all([
      apiClient.get(`/operation/prereport/custom-options?stepNumber=2&leadType=${leadType}`),
      apiClient.get(`/operation/prereport/custom-options?stepNumber=4&leadType=${leadType}`),
      apiClient.get(`/operation/prereport/custom-options?stepNumber=5&leadType=${leadType}`),
      apiClient.get(`/operation/prereport/custom-options?stepNumber=6&leadType=${leadType}`),
      apiClient.get(`/operation/prereport/custom-options?stepNumber=8&leadType=${leadType}`),
    ]).then(([step2, step4, step5, step6, step8]) => {
      setAllCustomOptions([
        ...(step2.data.data ?? []),
        ...(step4.data.data ?? []),
        ...(step5.data.data ?? []),
        ...(step6.data.data ?? []),
        ...(step8.data.data ?? []),
      ]);
    }).catch(() => { });
  }, [preReport?.leadType]);


  const customScopeMap = useMemo(
    () => new Map<number, CustomScopeItem>(
      [...(customScopes as CustomScopeItem[]), ...allCustomOptions]
        .map(scope => [scope.id, scope])
    ),
    [customScopes, allCustomOptions]
  );

  console.log('🗺️ customScopeMap:', customScopeMap);
  console.log('🗺️ map keys:', [...customScopeMap.keys()]);

  const completionPercentage = useMemo(() => {
    if (!preReport) return 0;
    return getCompletionPercentage(
      preReport.leadType,
      clientLeadData,
      trueBuddyLeadData
    );
  }, [preReport, clientLeadData, trueBuddyLeadData]);

  const isRequestedForChanges =
    preReport?.reportStatus === 'REQUESTED_FOR_CHANGES';

  const isDisapproved =
    preReport?.reportStatus === 'DISAPPROVED_BY_CLIENT';

  const getStepConfigs = (isClientLead: boolean): StepConfig[] => {
    if (isClientLead) {
      return [
        {
          stepNumber: 1,
          title: 'Client & Case Details',
          fields: ['dateInfoReceived', 'clientSpocName', 'clientSpocContact'],
        },
        {
          stepNumber: 2,
          title: 'Mandate / Scope Requested',
          fields: [
            'scopeDueDiligence',
            'scopeIprRetailer',
            'scopeIprSupplier',
            'scopeIprManufacturer',
            'scopeOnlinePurchase',
            'scopeOfflinePurchase',
            'scopeCustomIds',
            'scopetitle',
          ],
        },
        {
          stepNumber: 3,
          title: 'Information Received from Client',
          fields: [
            'entityName',
            'suspectName',
            'contactNumbers',
            'addressLine1',
            'addressLine2',
            'city',
            'state',
            'pincode',
            'onlinePresences',
            'productDetails',
            'photosProvided',
            'videoProvided',
            'invoiceAvailable',
            'sourceNarrative',
          ],
        },
        {
          stepNumber: 4,
          title: 'Preliminary Verification Conducted by True Buddy',
          fields: [
            'verificationClientDiscussion',
            'verificationClientDiscussionNotes',
            'verificationOsint',
            'verificationOsintNotes',
            'verificationMarketplace',
            'verificationMarketplaceNotes',
            'verificationPretextCalling',
            'verificationPretextCallingNotes',
            'verificationProductReview',
            'verificationProductReviewNotes',
            'verificationCustomData',
          ],
        },
        {
          stepNumber: 5,
          title: 'Key Observations',
          fields: [
            'obsIdentifiableTarget',
            'obsTraceability',
            'obsProductVisibility',
            'obsCounterfeitingIndications',
            'obsEvidentiary_gaps',
            'observationsCustomData',
          ],
        },
        {
          stepNumber: 6,
          title: 'Information Quality Assessment',
          fields: [
            'qaCompleteness',
            'qaAccuracy',
            'qaIndependentInvestigation',
            'qaPriorConfrontation',
            'qaContaminationRisk',
          ],
        },
        {
          stepNumber: 7,
          title: "True Buddy's Preliminary Assessment",
          fields: ['assessmentOverall', 'assessmentRationale'],
        },
        {
          stepNumber: 8,
          title: 'Recommended Way Forward',
          fields: [
            'recMarketSurvey',
            'recCovertInvestigation',
            'recTestPurchase',
            'recEnforcementAction',
            'recAdditionalInfo',
            'recClosureHold',
            'recCustomIds',
          ],
        },
        {
          stepNumber: 9,
          title: 'Remarks',
          fields: ['remarks'],
        },
        {
          stepNumber: 10,
          title: 'Disclaimer',
          fields: ['customDisclaimer'],
        },
      ];
    }

    return [
      {
        stepNumber: 1,
        title: 'Client & Case Reference',
        fields: [
          'dateInternalLeadGeneration',
          'productCategory',
          'productCategoryCustomText',
          'infringementType',
          'infringementTypeCustomText',
          'broadGeography',
          'reasonOfSuspicion',
          'reasonOfSuspicionCustomText',
          'expectedSeizure',
          'natureOfEntity',
          'natureOfEntityCustomText',
        ],
      },
      {
        stepNumber: 2,
        title: 'Mandate / Scope Proposed',
        fields: [
          'scopeIprSupplier',
          'scopeIprManufacturer',
          'scopeIprStockist',
          'scopeMarketVerification',
          'scopeEtp',
          'scopeEnforcement',
          'scopeCustomIds',
        ],
      },
      {
        stepNumber: 3,
        title: 'High-Level Lead Description (Sanitised)',
        fields: [
          'intelNature',
          'intelNatureCustomText',
          'suspectedActivity',
          'suspectedActivityCustomText',
          'productSegment',
          'productSegmentCustomText',
          'repeatIntelligence',
          'multiBrandRisk',
        ],
      },
      {
        stepNumber: 4,
        title: 'Preliminary Verification Conducted by True Buddy',
        fields: [
          'verificationIntelCorroboration',
          'verificationIntelCorroborationNotes',
          'verificationOsint',
          'verificationOsintNotes',
          'verificationPatternMapping',
          'verificationPatternMappingNotes',
          'verificationJurisdiction',
          'verificationJurisdictionNotes',
          'verificationRiskAssessment',
          'verificationRiskAssessmentNotes',
          'verificationCustomData',
        ],
      },
      {
        stepNumber: 5,
        title: 'Key Observations (Client-Safe)',
        fields: [
          'obsOperationScale',
          'obsCounterfeitLikelihood',
          'obsBrandExposure',
          'obsBrandExposureCustomText',
          'obsEnforcementSensitivity',
          'observationsCustomData',
        ],
      },
      {
        stepNumber: 6,
        title: 'Information Integrity & Risk Assessment',
        fields: [
          'riskSourceReliability',
          'riskClientConflict',
          'riskImmediateAction',
          'riskControlledValidation',
          'riskCustomData',
        ],
      },
      {
        stepNumber: 7,
        title: "True Buddy's Preliminary Assessment",
        fields: ['assessmentOverall', 'assessmentRationale'],
      },
      {
        stepNumber: 8,
        title: 'Recommended Way Forward',
        fields: [
          'recCovertValidation',
          'recEtp',
          'recMarketReconnaissance',
          'recEnforcementDeferred',
          'recContinuedMonitoring',
          'recClientSegregation',
          'recCustomIds',
        ],
      },
      {
        stepNumber: 9,
        title: 'Remarks',
        fields: ['remarks'],
      },
      {
        stepNumber: 10,
        title: 'Disclaimer',
        fields: ['customDisclaimer'],
      },
    ];
  };

  const isMeaningfulValue = (value: any): boolean => {
    if (value === null || value === undefined || value === '') return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  };

  const getStepData = (fields: string[]) => {
    if (!preReport) return null;

    const isClientLead = preReport.leadType === 'CLIENT_LEAD';
    const sourceData = isClientLead ? clientLeadData : trueBuddyLeadData;
    if (!sourceData) return null;

    const stepData: Record<string, any> = {};
    fields.forEach(field => {
      const value = sourceData[field as keyof typeof sourceData];
      if (isMeaningfulValue(value)) {
        stepData[field] = value;
      }
    });

    return Object.keys(stepData).length > 0 ? stepData : null;
  };

  const stepConfigs = useMemo(() => {
    if (!preReport) return [];
    return getStepConfigs(preReport.leadType === 'CLIENT_LEAD');
  }, [preReport?.leadType]);

  const visibleSteps = useMemo(() => {
    return stepConfigs
      .map(config => {
        const stepData = getStepData(config.fields);
        return stepData ? { ...config, stepData } : null;
      })
      .filter(Boolean) as Array<StepConfig & { stepData: Record<string, any> }>;
  }, [stepConfigs, clientLeadData, trueBuddyLeadData, preReport]);

  const toggleStep = (stepNum: number) => {
    setExpandedSteps(prev =>
      prev.includes(stepNum)
        ? prev.filter(s => s !== stepNum)
        : [...prev, stepNum]
    );
  };

  const handleExportPDF = async () => {
    if (!data || !isAdmin) return;

    setIsExporting(true);
    try {
      const { preReport, clientLeadData, trueBuddyLeadData } = data;
      const pdfLeadType =
        preReport.leadType === 'TRUEBUDDY_LEAD'
          ? 'TRUE_BUDDY_LEAD'
          : 'CLIENT_LEAD';

      const pdfData: PreReportPDFData = {
        reportId: preReport.reportId,
        clientName: preReport.clientName,
        leadType: pdfLeadType,
        createdAt: preReport.createdAt,
        updatedAt: preReport.updatedAt,
        products: preReport.productNames?.map((name: string) => ({
          name,
          category: 'N/A',
          status: 'ACTIVE',
        })),
        customOptions: customScopes,
      };

      if (preReport.leadType === 'CLIENT_LEAD' && clientLeadData) {
        pdfData.clientLeadData = clientLeadData;
      } else if (
        preReport.leadType === 'TRUEBUDDY_LEAD' &&
        trueBuddyLeadData
      ) {
        pdfData.trueBuddyLeadData = trueBuddyLeadData;
      }

      await exportPreReportToPDF(pdfData);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreview = () => {
    if (!canPreview) return;
    navigate(`/operations/pre-report/${reportId}/preview`);
  };

  const handleSendMail = () => {
    if (!isAdmin) return;
    setIsMailModalOpen(true);
  };

  const handleMailConfirm = async (toEmail: string, toName: string, notes: string) => {
    if (!reportId) return;
    try {
      await apiClient.post(`/operation/pre-reports/${reportId}/send-mail`, {
        toEmail,
        toName,
        notes,
      });
      toast.success(`Report sent successfully to ${toEmail}`);
      setIsMailModalOpen(false);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to send mail. Please try again.';
      toast.error(message);
      throw error; // keeps modal open for retry
    } finally {
    }
  };

  const renderCustomScopes = (ids: number[]) => {
    if (!ids || ids.length === 0) return null;

    const resolvedScopes = ids
      .map((id) => customScopeMap.get(Number(id)))
      .filter(Boolean) as CustomScopeItem[];

    if (resolvedScopes.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {resolvedScopes.map((scope: CustomScopeItem) => (
          <span
            key={scope.id}
            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm border border-blue-200"
          >
            {scope.optionName}  {/* ✅ correct field */}
          </span>
        ))}
      </div>
    );
  };

  const renderVerificationCustomData = (items: VerificationCustomItem[]) => {
    if (!items.length) return null;
    return (
      <div className="mt-2 space-y-3">
        {items.map((item, idx) => {
          const optionName = customScopeMap.get(item.optionId)?.optionName ?? `Custom Verification #${item.optionId}`;
          return (
            <div key={`${item.optionId}-${idx}`} className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm font-semibold text-blue-900">{optionName}</p>
              <p className="mt-1 text-sm text-blue-800">Status: {formatDisplayText(item.status || 'N/A')}</p>
              {item.notes && <p className="mt-1 text-sm text-blue-700">Notes: {item.notes}</p>}
            </div>
          );
        })}
      </div>
    );
  };

  // ✅ REPLACE entire function:
  const renderObservationsCustomData = (items: ObservationCustomItem[]) => {
    if (!items.length) return null;
    return (
      <div className="mt-2 space-y-3">
        {items.map((item, idx) => {
          const optionName = customScopeMap.get(item.optionId)?.optionName ?? `Custom Observation #${item.optionId}`;
          return (
            <div key={`${item.optionId}-${idx}`} className="rounded-lg border border-purple-200 bg-purple-50 p-3">
              <p className="text-sm font-semibold text-purple-900">{optionName}</p>
              <p className="mt-1 text-sm text-purple-700">{item.text || 'N/A'}</p>
            </div>
          );
        })}
      </div>
    );
  };

  // ✅ REPLACE entire function:
  const renderRiskCustomData = (items: RiskCustomItem[]) => {
    if (!items.length) return null;
    return (
      <div className="mt-2 space-y-3">
        {items.map((item, idx) => {
          const optionName = customScopeMap.get(item.optionId)?.optionName ?? `Custom Risk #${item.optionId}`;
          return (
            <div key={`${item.optionId}-${idx}`} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm font-semibold text-amber-900">{optionName}</p>
              <p className="mt-1 text-sm text-amber-700">Value: {formatDisplayText(item.value || 'N/A')}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const prettifyValue = (value: any) => {
    if (Array.isArray(value) && value.every(v => typeof v === 'string')) {
      return value.map(v => v.replace(/_/g, ' '));
    }
    return value;
  };

  const renderField = (label: string, value: any, key?: string) => {
    if (value === null || value === undefined || value === '') return null;
    if (
      label.toLowerCase().includes('created at') ||
      label.toLowerCase().includes('updated at')
    ) {
      return null;
    }

    const safeValue = prettifyValue(value);

    if (key === 'scopeCustomIds' && Array.isArray(safeValue)) {
      return (
        <div key={label} className="py-3 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          {renderCustomScopes(safeValue.map(Number))}
        </div>
      );
    }

    if (key === 'verificationCustomData' && Array.isArray(safeValue)) {
      return (
        <div key={label} className="py-3 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          {renderVerificationCustomData(safeValue as VerificationCustomItem[])}
        </div>
      );
    }

    if (key === 'observationsCustomData' && Array.isArray(safeValue)) {
      return (
        <div key={label} className="py-3 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          {renderObservationsCustomData(safeValue as ObservationCustomItem[])}
        </div>
      );
    }

    if (key === 'riskCustomData' && Array.isArray(safeValue)) {
      return (
        <div key={label} className="py-3 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          {renderRiskCustomData(safeValue as RiskCustomItem[])}
        </div>
      );
    }

    if (key === 'recCustomIds' && Array.isArray(safeValue)) {
      return (
        <div key={label} className="py-3 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          {renderCustomScopes(safeValue.map(Number))}
        </div>
      );
    }

    if (typeof safeValue === 'boolean') {
      return (
        <div key={label} className="py-2 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          <span
            className={`ml-2 text-sm font-semibold ${safeValue ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {safeValue ? 'Yes' : 'No'}
          </span>
        </div>
      );
    }

    if (
      label === 'Online Presences' &&
      Array.isArray(safeValue) &&
      safeValue.length > 0
    ) {
      return (
        <div key={label} className="py-3 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700 block mb-2">
            {label}:
          </span>
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
                {safeValue.map((presence: any, idx: number) => (
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

    if (Array.isArray(safeValue)) {
      if (safeValue.length === 0) return null;
      return (
        <div key={label} className="py-2 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {safeValue.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-xs text-blue-700"
              >
                {typeof item === 'object'
                  ? JSON.stringify(item)
                  : formatDisplayText(item)}
              </span>
            ))}
          </div>
        </div>
      );
    }

    if (
      typeof safeValue === 'string' &&
      safeValue.match(/^\d{4}-\d{2}-\d{2}/)
    ) {
      return (
        <div key={label} className="py-2 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          <span className="ml-2 text-sm text-gray-900">
            {formatDate(safeValue)}
          </span>
        </div>
      );
    }

    if (typeof safeValue === 'object' && safeValue !== null) {
      return (
        <div key={label} className="py-2 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700">{label}:</span>
          <div className="ml-4 mt-1 text-xs bg-gray-50 p-2 rounded">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(safeValue, null, 2)}
            </pre>
          </div>
        </div>
      );
    }

    return (
      <div key={label} className="py-2 border-b border-gray-100 last:border-0">
        <span className="text-sm font-medium text-gray-700">{label}:</span>
        <span className="ml-2 text-sm text-gray-900">
          {formatDisplayText(safeValue)}
        </span>
      </div>
    );
  };

  const renderStepDetails = (stepData: Record<string, any> | null) => {
    if (!stepData || Object.keys(stepData).length === 0) {
      return null;
    }

    return (
      <div className="mt-3 bg-gray-50 rounded-lg p-4 space-y-1">
        {Object.entries(stepData)
          .filter(([key]) => !['id', 'prereportId', 'createdAt', 'updatedAt'].includes(key))
          .map(([key, value]) => renderField(formatLabel(key), value, key))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !data || !preReport) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">Error loading report</p>
          <button
            onClick={() => navigate(preReportsPath)}
            className="text-blue-600 hover:underline"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <button
          onClick={() => navigate(preReportsPath)}
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
          <div className="flex items-center gap-3 flex-wrap">
            <PreReportStatusBadge status={preReport.reportStatus} />

            <button
              onClick={() => navigate(`/operations/pre-report/${reportId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>

            <button
              onClick={handlePreview}
              disabled={!canPreview}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${canPreview
                ? 'border border-purple-600 text-purple-700 hover:bg-purple-50'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
            >
              <Eye className="w-4 h-4" />
              Preview PDF
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExporting || !isAdmin}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isAdmin && !isExporting
                ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export PDF
                </>
              )}
            </button>

            <button
              onClick={handleSendMail}
              disabled={!isAdmin}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isAdmin
                ? 'border border-green-600 text-green-700 hover:bg-green-50'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
            >
              <Mail className="w-4 h-4" />
              Send Mail
            </button>
          </div>
        </div>
      </div>

      {isRequestedForChanges && (
        <div className="mb-6 border border-amber-300 bg-amber-50 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800 mb-1">
                Changes Requested
              </p>
              <p className="text-sm text-amber-700 leading-relaxed">
                {preReport.changeComments?.trim()
                  ? preReport.changeComments
                  : 'The reviewer has requested changes to this report. Please review and update accordingly.'}
              </p>
              <p className="text-xs text-amber-600 mt-2">
                Last updated: {formatDate(preReport.updatedAt)}
              </p>
            </div>
            <button
              onClick={() => navigate(`/operations/pre-report/${reportId}/edit`)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-md hover:bg-amber-700 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Now
            </button>
          </div>
        </div>
      )}

      {isDisapproved && (
        <div className="mb-6 border border-red-300 bg-red-50 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-800 mb-1">
                Disapproved by Client
              </p>
              <p className="text-sm text-red-700 leading-relaxed">
                {preReport.rejectionReason?.trim()
                  ? preReport.rejectionReason
                  : 'This report has been disapproved by the client. Please review the report and take appropriate action.'}
              </p>
              <p className="text-xs text-red-500 mt-2">
                Last updated: {formatDate(preReport.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      )}

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

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Products:</p>
          <div className="flex flex-wrap gap-2">
            {(preReport.productNames ?? []).map((product: string, idx: number) => (
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

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Step Details</h2>
        <div className="space-y-3">
          {visibleSteps.map((step, index) => {
            const originalStepNum = step.stepNumber;
            const visibleStepNum = index + 1;
            const isCompleted = preReport.currentStep >= originalStepNum;
            const isExpanded = expandedSteps.includes(originalStepNum);

            return (
              <div
                key={originalStepNum}
                className={`border rounded-lg transition-all ${isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                  }`}
              >
                <button
                  onClick={() => toggleStep(originalStepNum)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-semibold ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                      {visibleStepNum}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {Object.keys(step.stepData).length} fields filled
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-gray-400'
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

                {isExpanded && (
                  <div className="px-4 pb-4">{renderStepDetails(step.stepData)}</div>
                )}
              </div>
            );
          })}



          {visibleSteps.length === 0 && (
            <div className="text-sm text-gray-500 italic">No step data available.</div>
          )}
        </div>
      </div>
      <SendMailModal
        isOpen={isMailModalOpen}
        reportId={preReport.reportId}
        clientName={preReport.clientName}
        defaultEmail=""
        onClose={() => setIsMailModalOpen(false)}
        onConfirm={handleMailConfirm}
      />
    </div>
  );
};

export default PreReportDetails;