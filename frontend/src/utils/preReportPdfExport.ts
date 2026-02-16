// src/utils/preReportPdfExport.ts
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { ClientLeadData, TrueBuddyLeadData } from '../types/prereport.types';

// @ts-ignore
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;

pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

const BRAND_COLOR = '#1e40af';
const SECONDARY_COLOR = '#64748b';
const TEXT_COLOR = '#1f2937';

export interface PreReportPDFData {
  reportId: string;
  clientName: string;
  leadType: 'CLIENT_LEAD' | 'TRUE_BUDDY_LEAD';
  status: string;
  createdAt: string;
  updatedAt: string;
  products?: Array<{
    name: string;
    category: string;
    status: string;
  }>;
  clientLeadData?: ClientLeadData;
  trueBuddyLeadData?: TrueBuddyLeadData;
}

// ========== ENUM MAPPING HELPERS ==========

// YesNo enum mapper
const mapYesNo = (value: any): string => {
  if (!value) return 'No';
  const str = String(value).toUpperCase();
  return str === 'YES' ? 'Yes' : 'No';
};

// VerificationStatus mapper
const isVerificationDone = (value: any): boolean => {
  if (!value) return false;
  const str = String(value).toUpperCase();
  return str === 'DONE';
};

// CompletenessLevel mapper
const mapCompleteness = (value: any): string => {
  if (!value) return 'N/A';
  const str = String(value).toUpperCase();
  switch (str) {
    case 'COMPLETE': return 'Complete';
    case 'PARTIALLY_COMPLETE': return 'Partially Complete';
    case 'INCOMPLETE': return 'Incomplete';
    default: return value;
  }
};

// AccuracyLevel mapper
const mapAccuracy = (value: any): string => {
  if (!value) return 'N/A';
  const str = String(value).toUpperCase();
  return str === 'ACCURATE' ? 'Accurate' : 'Inaccurate';
};

// RiskLevel mapper
const mapRiskLevel = (value: any): string => {
  if (!value) return 'N/A';
  const str = String(value).toUpperCase();
  switch (str) {
    case 'LOW': return 'Low';
    case 'MEDIUM': return 'Medium';
    case 'HIGH': return 'High';
    default: return value;
  }
};

// ClientLeadAssessment mapper
const mapClientAssessment = (value: any): string => {
  if (!value) return 'N/A';
  const str = String(value).toUpperCase();
  switch (str) {
    case 'ACTIONABLE': return 'Actionable Lead';
    case 'POTENTIALLY_ACTIONABLE': return 'Potentially Actionable (Information Gaps Exist)';
    case 'NON_ACTIONABLE': return 'Non-Actionable at Present';
    default: return value;
  }
};

// TrueBuddyLeadAssessment mapper
const mapTrueBuddyAssessment = (value: any): string => {
  if (!value) return 'N/A';
  const str = String(value).toUpperCase();
  switch (str) {
    case 'ACTIONABLE': return 'Actionable (Subject to Client Alignment)';
    case 'ACTIONABLE_AFTER_VALIDATION': return 'Actionable After Controlled Validation';
    case 'HOLD': return 'Hold -- Monitoring Recommended';
    default: return value;
  }
};

// ProductCategory mapper
const mapProductCategory = (value: any): string => {
  if (!value) return 'N/A';
  const str = String(value).toUpperCase();
  switch (str) {
    case 'CROP_PROTECTION': return 'Crop Protection';
    case 'SEEDS': return 'Seeds';
    default: return value;
  }
};

// InfringementType mapper
const mapInfringementType = (value: any): string => {
  if (!value) return 'N/A';
  const str = String(value).toUpperCase();
  switch (str) {
    case 'COUNTERFEIT': return 'Counterfeit';
    case 'LOOKALIKE': return 'Lookalike';
    default: return value;
  }
};

// NatureOfEntity mapper
const mapNatureOfEntity = (value: any): string => {
  if (!value) return 'N/A';
  const str = String(value).toUpperCase();
  switch (str) {
    case 'SUPPLIER': return 'Supplier';
    case 'MANUFACTURER': return 'Manufacturer';
    case 'PACKAGER': return 'Packager';
    case 'STOCKIST': return 'Stockist';
    default: return value;
  }
};

// IntelligenceNature mapper
const mapIntelNature = (value: any): string => {
  if (!value) return 'N/A';
  const str = String(value).toUpperCase();
  switch (str) {
    case 'MARKET': return 'Market';
    case 'SUPPLY_CHAIN': return 'Supply Chain';
    case 'MANUFACTURING': return 'Manufacturing';
    default: return value;
  }
};

// SuspectedActivity mapper
const mapSuspectedActivity = (value: any): string => {
  if (!value) return 'N/A';
  const str = String(value).toUpperCase();
  switch (str) {
    case 'COUNTERFEITING': return 'Counterfeiting';
    case 'LOOKALIKE': return 'Lookalike';
    case 'SPURIOUS': return 'Spurious';
    default: return value;
  }
};

// SupplyChainStage mapper
const mapSupplyChainStage = (value: any): string => {
  if (!value) return 'N/A';
  const str = String(value).toUpperCase();
  switch (str) {
    case 'UPSTREAM': return 'Upstream';
    case 'MIDSTREAM': return 'Midstream';
    default: return value;
  }
};

// OperationScale mapper
const mapOperationScale = (value: any): string => {
  if (!value) return 'N/A';
  const str = String(value).toUpperCase();
  switch (str) {
    case 'SMALL': return 'Small';
    case 'MEDIUM': return 'Medium';
    case 'LARGE': return 'Large';
    default: return value;
  }
};

// BrandExposure mapper
const mapBrandExposure = (value: any): string => {
  if (!value) return 'N/A';
  const str = String(value).toUpperCase();
  switch (str) {
    case 'SINGLE_BRAND': return 'Single Brand';
    case 'MULTIPLE_BRANDS': return 'Multiple Brands';
    default: return value;
  }
};

// SourceReliability mapper
const mapSourceReliability = (value: any): string => {
  if (!value) return 'N/A';
  const str = String(value).toUpperCase();
  switch (str) {
    case 'HIGH': return 'High';
    case 'MEDIUM': return 'Medium';
    default: return value;
  }
};

// LikelihoodLevel mapper
const mapLikelihoodLevel = (value: any): string => {
  return mapRiskLevel(value); // Same as RiskLevel
};

// Helper function to create table row
const createTableRow = (label: string, value: string, noBorder = false) => {
  return [
    {
      text: label,
      bold: true,
      fontSize: 10,
      border: noBorder ? [false, false, false, false] : [true, true, false, true],
    },
    {
      text: value,
      fontSize: 10,
      border: noBorder ? [false, false, false, false] : [false, true, true, true],
    },
  ];
};


// Helper to create verification table row
const createVerificationRow = (activity: string, value: any, notes: string) => {
  const isDone = isVerificationDone(value);
  return [
    { text: activity, fontSize: 9 },
    {
      text: isDone ? 'Yes' : 'No',
      fontSize: 10,
      alignment: 'center' as const,
      bold: true,
      color: isDone ? '#059669' : '#dc2626'
    },
    { text: notes, fontSize: 9 },
  ];
};





const generateClientLeadPDF = (data: PreReportPDFData) => {
  const clientData = data.clientLeadData!;
  const productNames = data.products?.map(p => p.name).join(', ') || 'N/A';

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [50, 60, 50, 60],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10,
      color: TEXT_COLOR,
      lineHeight: 1.3,
    },
    styles: {
      title: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        marginBottom: 5,
      },
      subtitle: {
        fontSize: 11,
        italics: true,
        alignment: 'center',
        marginBottom: 20,
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        marginTop: 15,
        marginBottom: 8,
      },
      tableHeader: {
        fontSize: 9,
        bold: true,
        fillColor: '#f3f4f6',
      },
    },
    header: (currentPage: number) => {
      if (currentPage === 1) return null;
      return {
        text: 'PRELIMINARY LEAD ASSESSMENT REPORT',
        fontSize: 9,
        color: SECONDARY_COLOR,
        alignment: 'center',
        margin: [0, 20, 0, 0],
      };
    },
    content: [
      // ========== COVER PAGE ==========
      {
        text: 'TRUE BUDDY CONSULTING PVT. LTD.',
        fontSize: 18,
        bold: true,
        color: BRAND_COLOR,
        alignment: 'center',
        marginTop: 60,
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 150,
            y1: 5,
            x2: 345,
            y2: 5,
            lineWidth: 2,
            lineColor: BRAND_COLOR,
          },
        ],
        marginBottom: 40,
      },
      {
        text: 'PRELIMINARY LEAD ASSESSMENT REPORT',
        fontSize: 14,
        bold: true,
        alignment: 'center',
        marginBottom: 50,
      },

      // Cover Page Info Box
      {
        table: {
          widths: ['40%', '60%'],
          body: [
            createTableRow('Client Name', data.clientName),
            createTableRow('Product(s) Involved', productNames),
            createTableRow('Report ID', data.reportId),
            createTableRow('Created Date', new Date(data.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })),
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 40,
      },

      {
        text: 'CONFIDENTIAL DOCUMENT',
        fontSize: 11,
        bold: true,
        color: '#dc2626',
        alignment: 'center',
        marginBottom: 5,
      },
      {
        text: 'This report contains sensitive information and is intended solely for authorized personnel.',
        fontSize: 9,
        italics: true,
        color: SECONDARY_COLOR,
        alignment: 'center',
        marginBottom: 40,
      },

      // Page Break
      { text: '', pageBreak: 'after' },

      // ========== MAIN CONTENT ==========
      {
        text: 'PRELIMINARY LEAD ASSESSMENT REPORT',
        style: 'title',
      },
      {
        text: '(Based on Client-Provided Information)',
        style: 'subtitle',
      },

      // 1. Client & Case Details
      {
        text: '1. Client & Case Details',
        style: 'sectionHeader',
      },
      {
        table: {
          widths: ['45%', '55%'],
          body: [
            [
              { text: 'Field', style: 'tableHeader' },
              { text: 'Details', style: 'tableHeader' },
            ],
            createTableRow('Name of Client', data.clientName, true),
            createTableRow('Product(s) Involved', productNames, true),
            createTableRow('Date Information Received', clientData.dateInfoReceived
              ? new Date(clientData.dateInfoReceived).toLocaleDateString('en-IN')
              : 'N/A', true),
            createTableRow('Location (State / District / City)',
              [clientData.state, clientData.city].filter(Boolean).join(', ') || 'N/A', true),
            createTableRow('Client SPOC',
              `${clientData.clientSpocName || 'N/A'}${clientData.clientSpocContact ? ' & ' + clientData.clientSpocContact : ''}`, true),
          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 15,
      },

      // 2. Mandate / Scope Requested
      {
        text: '2. Mandate / Scope Requested',
        style: 'sectionHeader',
      },
      {
        text: '(Tick applicable)',
        fontSize: 9,
        italics: true,
        marginBottom: 5,
      },
      {
        table: {
          widths: ['75%', '25%'],
          body: [
            [
              { text: 'Scope', style: 'tableHeader' },
              { text: 'Selected', style: 'tableHeader', alignment: 'center' },
            ],
            [
              'Due Diligence',
              {
                text: clientData.scopeDueDiligence ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: clientData.scopeDueDiligence ? '#059669' : '#dc2626'
              }
            ],
            [
              'IPR Investigation -- Retailer / Wholesaler',
              {
                text: clientData.scopeIprRetailer ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: clientData.scopeIprRetailer ? '#059669' : '#dc2626'
              }
            ],
            [
              'IPR Investigation -- Supplier',
              {
                text: clientData.scopeIprSupplier ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: clientData.scopeIprSupplier ? '#059669' : '#dc2626'
              }
            ],
            [
              'IPR Investigation -- Manufacturer / Packager / Warehouse',
              {
                text: clientData.scopeIprManufacturer ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: clientData.scopeIprManufacturer ? '#059669' : '#dc2626'
              }
            ],
            [
              'Online Sample Purchase',
              {
                text: clientData.scopeOnlinePurchase ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: clientData.scopeOnlinePurchase ? '#059669' : '#dc2626'
              }
            ],
            [
              'Offline Sample Purchase',
              {
                text: clientData.scopeOfflinePurchase ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: clientData.scopeOfflinePurchase ? '#059669' : '#dc2626'
              }
            ],
            [
              'Other (Specify)',
              {
                text: clientData.scopeCustomIds && clientData.scopeCustomIds.length > 0
                  ? clientData.scopeCustomIds.join(', ')
                  : 'N/A',
                alignment: 'center',
                fontSize: 9
              }
            ],
          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 15,
      },


      // 3. Information Received from Client
      {
        text: '3. Information Received from Client',
        style: 'sectionHeader',
      },
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            [
              { text: 'Parameter', style: 'tableHeader' },
              { text: 'Details', style: 'tableHeader' },
            ],
            createTableRow('Name of Entity', clientData.entityName || 'N/A', true),
            createTableRow('Name of Suspect (if different)', clientData.suspectName || 'N/A', true),
            createTableRow('Contact Number(s)', clientData.contactNumbers || 'N/A', true),
            createTableRow('Address / Location',
              [clientData.addressLine1, clientData.addressLine2, clientData.city, clientData.state, clientData.pincode]
                .filter(Boolean)
                .join(', ') || 'N/A', true),
            createTableRow('Online Presence (IndiaMART / Facebook / Website / Others)',
              Array.isArray(clientData.onlinePresences) && clientData.onlinePresences.length > 0
                ? clientData.onlinePresences.map((p: any) => `${p.platformName}: ${p.link}`).join(', ')
                : 'N/A', true),
            createTableRow('Product Details', clientData.productDetails || 'N/A', true),
            createTableRow('Product Photographs Provided', mapYesNo(clientData.photosProvided), true),
            createTableRow('Video Evidence Provided', mapYesNo(clientData.videoProvided), true),
            createTableRow('Invoice / Bill Available', mapYesNo(clientData.invoiceAvailable), true),
            createTableRow('Source Narrative (as shared by client)', clientData.sourceNarrative || 'N/A', true),
          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 15,
      },

      // 4. Preliminary Verification Conducted by True Buddy
      {
        text: '4. Preliminary Verification Conducted by True Buddy',
        style: 'sectionHeader',
      },
      {
        text: '(Desk-based assessment only; no field deployment at this stage)',
        fontSize: 9,
        italics: true,
        marginBottom: 5,
      },
      {
        table: {
          widths: ['45%', '15%', '40%'],
          body: [
            [
              { text: 'Activity', style: 'tableHeader' },
              { text: 'Done (✔/✖)', style: 'tableHeader', alignment: 'center' },
              { text: 'Key Notes', style: 'tableHeader' },
            ],
            createVerificationRow(
              'Case Discussion with Client Team',
              clientData.verificationClientDiscussion, // ✅ Pass raw value
              clientData.verificationClientDiscussionNotes || ''
            ),
            createVerificationRow(
              'Internet / OSINT Search',
              clientData.verificationOsint, // ✅ Pass raw value
              clientData.verificationOsintNotes || ''
            ),
            createVerificationRow(
              'Marketplace Verification (IndiaMART / Social Media)',
              clientData.verificationMarketplace, // ✅ Pass raw value
              clientData.verificationMarketplaceNotes || ''
            ),
            createVerificationRow(
              'Pretext Calling (if applicable)',
              clientData.verificationPretextCalling, // ✅ Pass raw value
              clientData.verificationPretextCallingNotes || ''
            ),
            createVerificationRow(
              'Preliminary Product Image Review',
              clientData.verificationProductReview, // ✅ Pass raw value
              clientData.verificationProductReviewNotes || ''
            ),

          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 15,
      },

      // 5. Key Observations
      {
        text: '5. Key Observations',
        style: 'sectionHeader',
      },
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            [
              { text: 'Parameter', style: 'tableHeader' },
              { text: 'Observation', style: 'tableHeader' },
            ],
            createTableRow('Availability of Identifiable Target', clientData.obsIdentifiableTarget || 'N/A', true),
            createTableRow('Traceability of Entity / Contact', clientData.obsTraceability || 'N/A', true),
            createTableRow('Product Visibility / Market Presence', clientData.obsProductVisibility || 'N/A', true),
            createTableRow('Indications of Counterfeiting / Lookalike', clientData.obsCounterfeitingIndications || 'N/A', true),
            createTableRow('Evidentiary Gaps Identified', clientData.obsEvidentiary_gaps || 'N/A', true),
          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 15,
      },

      // 6. Information Quality Assessment
      {
        text: '6. Information Quality Assessment',
        style: 'sectionHeader',
      },
      {
        table: {
          widths: ['55%', '45%'],
          body: [
            [
              { text: 'Parameter', style: 'tableHeader' },
              { text: 'Assessment', style: 'tableHeader' },
            ],
            createTableRow('Completeness of Initial Information', mapCompleteness(clientData.qaCompleteness), true),
            createTableRow('Accuracy of Case Description (prima facie)', mapAccuracy(clientData.qaAccuracy), true),
            createTableRow('Any Independent Client Investigation Conducted', mapYesNo(clientData.qaIndependentInvestigation), true),
            createTableRow('Any Prior Confrontation with Seller / Suspect', mapYesNo(clientData.qaPriorConfrontation), true),
            createTableRow('Risk of Information Contamination', mapRiskLevel(clientData.qaContaminationRisk), true),
          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 15,
      },

      // 7. True Buddy's Preliminary Assessment
      {
        text: "7. True Buddy's Preliminary Assessment",
        style: 'sectionHeader',
      },
      {
        text: 'Overall Assessment of Lead:',
        bold: true,
        fontSize: 10,
        marginBottom: 5,
      },
      {
        text: mapClientAssessment(clientData.assessmentOverall),
        fontSize: 10,
        bold: true,
        marginBottom: 10,
      },
      {
        text: 'Rationale:',
        bold: true,
        fontSize: 10,
        marginBottom: 5,
      },
      {
        text: clientData.assessmentRationale || '(Brief justification for the above assessment)',
        fontSize: 10,
        italics: !clientData.assessmentRationale,
        marginBottom: 15,
      },

      // 8. Recommended Way Forward
      {
        text: '8. Recommended Way Forward',
        style: 'sectionHeader',
      },
      {
        text: '(Based on current information)',
        fontSize: 9,
        italics: true,
        marginBottom: 5,
      },
      {
        table: {
          widths: ['75%', '25%'],
          body: [
            [
              { text: 'Recommendation', style: 'tableHeader' },
              { text: 'Selected', style: 'tableHeader', alignment: 'center' },
            ],
            [
              'Market Survey / Reconnaissance',
              {
                text: clientData.recMarketSurvey ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: clientData.recMarketSurvey ? '#059669' : '#dc2626'
              }
            ],
            [
              'Covert Investigation',
              {
                text: clientData.recCovertInvestigation ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: clientData.recCovertInvestigation ? '#059669' : '#dc2626'
              }
            ],
            [
              'Evidential Test Purchase',
              {
                text: clientData.recTestPurchase ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: clientData.recTestPurchase ? '#059669' : '#dc2626'
              }
            ],
            [
              'Direct Enforcement Action',
              {
                text: clientData.recEnforcementAction ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: clientData.recEnforcementAction ? '#059669' : '#dc2626'
              }
            ],
            [
              'Additional Information Required from Client',
              {
                text: clientData.recAdditionalInfo ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: clientData.recAdditionalInfo ? '#059669' : '#dc2626'
              }
            ],
            [
              'Closure / Hold',
              {
                text: clientData.recClosureHold ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: clientData.recClosureHold ? '#059669' : '#dc2626'
              }
            ],
          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 15,
      },


      // 9. Remarks
      {
        text: '9. Remarks',
        style: 'sectionHeader',
      },
      {
        text: clientData.remarks || '(Any additional comments, assumptions, or risk flags)',
        fontSize: 10,
        italics: !clientData.remarks,
        marginBottom: 15,
      },

      // 10. Disclaimer
      {
        text: '10. Disclaimer',
        style: 'sectionHeader',
      },
      {
        text: clientData.customDisclaimer ||
          'This preliminary assessment is prepared solely on the basis of information provided by the client. True Buddy assumes the information to be complete and accurate at this stage. In the event that the information is found to be incomplete, inaccurate, or misleading during subsequent investigation or field deployment, additional costs towards team mobilisation and preliminary investigation shall be applicable as per the approved proposal. This document does not constitute a final investigative report or legal opinion.',
        fontSize: 9,
        alignment: 'justify',
        marginBottom: 20,
      },
    ],
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount}`,
      fontSize: 9,
      color: SECONDARY_COLOR,
      alignment: 'center',
      margin: [0, 10, 0, 0],
    }),
  };

  return docDefinition;
};

const generateTrueBuddyLeadPDF = (data: PreReportPDFData) => {
  const tbData = data.trueBuddyLeadData!;
  const productNames = data.products?.map(p => p.name).join(', ') || 'N/A';

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [50, 60, 50, 60],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10,
      color: TEXT_COLOR,
      lineHeight: 1.3,
    },
    styles: {
      title: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        marginBottom: 5,
      },
      subtitle: {
        fontSize: 11,
        italics: true,
        alignment: 'center',
        marginBottom: 10,
      },
      confidential: {
        fontSize: 11,
        bold: true,
        alignment: 'center',
        marginBottom: 20,
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        marginTop: 15,
        marginBottom: 8,
      },
      tableHeader: {
        fontSize: 9,
        bold: true,
        fillColor: '#f3f4f6',
      },
      note: {
        fontSize: 9,
        italics: true,
        marginBottom: 15,
      },
    },
    header: (currentPage: number) => {
      if (currentPage === 1) return null;
      return {
        text: 'PRELIMINARY LEAD ASSESSMENT REPORT',
        fontSize: 9,
        color: SECONDARY_COLOR,
        alignment: 'center',
        margin: [0, 20, 0, 0],
      };
    },
    content: [
      // ========== COVER PAGE ==========
      {
        text: 'TRUE BUDDY CONSULTING PVT. LTD.',
        fontSize: 18,
        bold: true,
        color: BRAND_COLOR,
        alignment: 'center',
        marginTop: 60,
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 150,
            y1: 5,
            x2: 345,
            y2: 5,
            lineWidth: 2,
            lineColor: BRAND_COLOR,
          },
        ],
        marginBottom: 40,
      },
      {
        text: 'PRELIMINARY LEAD ASSESSMENT REPORT',
        fontSize: 14,
        bold: true,
        alignment: 'center',
        marginBottom: 50,
      },

      // Cover Page Info Box
      {
        table: {
          widths: ['40%', '60%'],
          body: [
            createTableRow('Client Name', data.clientName),
            createTableRow('Product(s) Involved', productNames),
            createTableRow('Report ID', data.reportId),
            createTableRow('Created Date', new Date(data.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })),
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 40,
      },

      {
        text: 'CONFIDENTIAL DOCUMENT',
        fontSize: 11,
        bold: true,
        color: '#dc2626',
        alignment: 'center',
        marginBottom: 5,
      },
      {
        text: 'This report contains sensitive information and is intended solely for authorized personnel.',
        fontSize: 9,
        italics: true,
        color: SECONDARY_COLOR,
        alignment: 'center',
        marginBottom: 40,
      },

      // Page Break
      { text: '', pageBreak: 'after' },

      // ========== MAIN CONTENT ==========
      {
        text: 'PRELIMINARY LEAD ASSESSMENT REPORT',
        style: 'title',
      },
      {
        text: '(Lead Generated Through True Buddy Intelligence Network)',
        style: 'subtitle',
      },
      {
        text: '[Confidential -- Client-Sanitised Version]',
        style: 'confidential',
      },

      // 1. Client & Case Reference
      {
        text: '1. Client & Case Reference',
        style: 'sectionHeader',
      },
      {
        table: {
          widths: ['45%', '55%'],
          body: [
            [
              { text: 'Field', style: 'tableHeader' },
              { text: 'Details', style: 'tableHeader' },
            ],
            createTableRow('Client Name', data.clientName, true),
            createTableRow('Product Category', mapProductCategory(tbData.productCategory), true),
            createTableRow('Type of Infringement', mapInfringementType(tbData.infringementType), true),
            createTableRow('Date of Internal Lead Generation',
              tbData.dateInternalLeadGeneration
                ? new Date(tbData.dateInternalLeadGeneration).toLocaleDateString('en-IN')
                : 'N/A', true),
            createTableRow('Broad Geography', tbData.broadGeography || 'N/A', true),
            createTableRow('Client SPOC',
              `${tbData.clientSpocName || 'N/A'}${tbData.clientSpocDesignation ? ' & ' + tbData.clientSpocDesignation : ''}`, true),
            createTableRow('Nature of Entity', mapNatureOfEntity(tbData.natureOfEntity), true),
          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 5,
      },
      {
        text: "Note: The lead has been generated through True Buddy's independent intelligence channels. Specific source identifiers and proprietary intelligence inputs are intentionally withheld.",
        style: 'note',
      },

      // 2. Mandate / Scope Proposed
      {
        text: '2. Mandate / Scope Proposed',
        style: 'sectionHeader',
      },
      {
        text: '(Indicative -- subject to client approval)',
        fontSize: 9,
        italics: true,
        marginBottom: 5,
      },
      {
        table: {
          widths: ['75%', '25%'],
          body: [
            [
              { text: 'Scope', style: 'tableHeader' },
              { text: 'Selected', style: 'tableHeader', alignment: 'center' },
            ],
            [
              'IPR Investigation -- Supplier Level',
              {
                text: tbData.scopeIprSupplier ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: tbData.scopeIprSupplier ? '#059669' : '#dc2626'
              }
            ],
            [
              'IPR Investigation -- Manufacturer / Packager',
              {
                text: tbData.scopeIprManufacturer ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: tbData.scopeIprManufacturer ? '#059669' : '#dc2626'
              }
            ],
            [
              'IPR Investigation -- Stockist / Warehouse',
              {
                text: tbData.scopeIprStockist ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: tbData.scopeIprStockist ? '#059669' : '#dc2626'
              }
            ],
            [
              'Covert Market Verification',
              {
                text: tbData.scopeMarketVerification ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: tbData.scopeMarketVerification ? '#059669' : '#dc2626'
              }
            ],
            [
              'Evidential Test Purchase (ETP)',
              {
                text: tbData.scopeEtp ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: tbData.scopeEtp ? '#059669' : '#dc2626'
              }
            ],
            [
              'Enforcement Facilitation (If Applicable)',
              {
                text: tbData.scopeEnforcement ? 'Yes' : 'No',
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: tbData.scopeEnforcement ? '#059669' : '#dc2626'
              }
            ],
          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 15,
      },


      // 3. High-Level Lead Description (Sanitised)
      {
        text: '3. High-Level Lead Description (Sanitised)',
        style: 'sectionHeader',
      },
      {
        table: {
          widths: ['45%', '55%'],
          body: [
            [
              { text: 'Parameter', style: 'tableHeader' },
              { text: 'Description', style: 'tableHeader' },
            ],
            createTableRow('Nature of Intelligence', mapIntelNature(tbData.intelNature), true),
            createTableRow('Type of Suspected Activity', mapSuspectedActivity(tbData.suspectedActivity), true),
            createTableRow('Product Segment', mapProductCategory(tbData.productSegment), true),
            createTableRow('Stage of Supply Chain', mapSupplyChainStage(tbData.supplyChainStage), true),
            createTableRow('Repeat Intelligence Indicator', mapYesNo(tbData.repeatIntelligence), true),
            createTableRow('Multi-Brand Exposure Risk', mapYesNo(tbData.multiBrandRisk), true),
          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 5,
      },
      {
        text: 'Specific entity names, contact details, and exact locations are withheld at this stage to maintain confidentiality and prevent contamination across clients.',
        style: 'note',
      },

      // 4. Preliminary Verification Conducted by True Buddy
      {
        text: '4. Preliminary Verification Conducted by True Buddy',
        style: 'sectionHeader',
      },
      {
        text: '(Non-intrusive, desk and intelligence-based assessment only)',
        fontSize: 9,
        italics: true,
        marginBottom: 5,
      },
      {
        table: {
          widths: ['45%', '15%', '40%'],
          body: [
            [
              { text: 'Activity', style: 'tableHeader' },
              { text: 'Status', style: 'tableHeader', alignment: 'center' },
              { text: 'Notes', style: 'tableHeader' },
            ],
            createVerificationRow(
              'Internal Intelligence Corroboration',
              tbData.verificationIntelCorroboration, // ✅ Pass raw value
              tbData.verificationIntelCorroborationNotes || ''
            ),
            createVerificationRow(
              'OSINT / Market Footprint Review',
              tbData.verificationOsint, // ✅ Pass raw value
              tbData.verificationOsintNotes || ''
            ),
            createVerificationRow(
              'Pattern Mapping (Similar Past Cases)',
              tbData.verificationPatternMapping, // ✅ Pass raw value
              tbData.verificationPatternMappingNotes || ''
            ),
            createVerificationRow(
              'Jurisdiction Feasibility Review',
              tbData.verificationJurisdiction, // ✅ Pass raw value
              tbData.verificationJurisdictionNotes || ''
            ),
            createVerificationRow(
              'Risk & Sensitivity Assessment',
              tbData.verificationRiskAssessment, // ✅ Pass raw value
              tbData.verificationRiskAssessmentNotes || ''
            ),

          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 15,
      },

      // 5. Key Observations (Client-Safe)
      {
        text: '5. Key Observations (Client-Safe)',
        style: 'sectionHeader',
      },
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            [
              { text: 'Parameter', style: 'tableHeader' },
              { text: 'Observation', style: 'tableHeader' },
            ],
            createTableRow('Scale of Suspected Operations', mapOperationScale(tbData.obsOperationScale), true),
            createTableRow('Likelihood of Counterfeit Activity', mapLikelihoodLevel(tbData.obsCounterfeitLikelihood), true),
            createTableRow('Potential Brand Exposure', mapBrandExposure(tbData.obsBrandExposure), true),
            createTableRow('Enforcement Sensitivity (Political / Local)', mapRiskLevel(tbData.obsEnforcementSensitivity), true),
            createTableRow('Risk of Information Leakage', mapRiskLevel(tbData.obsLeakageRisk), true),
          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 15,
      },

      // 6. Information Integrity & Risk Assessment
      {
        text: '6. Information Integrity & Risk Assessment',
        style: 'sectionHeader',
      },
      {
        table: {
          widths: ['55%', '45%'],
          body: [
            [
              { text: 'Parameter', style: 'tableHeader' },
              { text: 'Assessment', style: 'tableHeader' },
            ],
            createTableRow('Source Reliability (Internal Assessment)', mapSourceReliability(tbData.riskSourceReliability), true),
            createTableRow('Risk of Cross-Client Conflict', mapRiskLevel(tbData.riskClientConflict), true),
            createTableRow('Suitability for Immediate Action', mapYesNo(tbData.riskImmediateAction), true),
            createTableRow('Requirement for Controlled Validation', mapYesNo(tbData.riskControlledValidation), true),
            createTableRow('Risk of Premature Disclosure', mapRiskLevel(tbData.riskPrematureDisclosure), true),
          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 15,
      },

      // 7. True Buddy's Preliminary Assessment
      {
        text: "7. True Buddy's Preliminary Assessment",
        style: 'sectionHeader',
      },
      {
        text: 'Overall Assessment of Lead:',
        bold: true,
        fontSize: 10,
        marginBottom: 5,
      },
      {
        text: mapTrueBuddyAssessment(tbData.assessmentOverall),
        fontSize: 10,
        bold: true,
        marginBottom: 10,
      },
      {
        text: 'Assessment Rationale:',
        bold: true,
        fontSize: 10,
        marginBottom: 5,
      },
      {
        text: tbData.assessmentRationale || '(High-level justification without disclosing proprietary intelligence)',
        fontSize: 10,
        italics: !tbData.assessmentRationale,
        marginBottom: 15,
      },

      // 8. Recommended Way Forward
      {
        text: '8. Recommended Way Forward',
        style: 'sectionHeader',
      },
      {
        text: '(Client-specific execution will be ring-fenced)',
        fontSize: 9,
        italics: true,
        marginBottom: 5,
      },
{
  table: {
    widths: ['75%', '25%'],
    body: [
      [
        { text: 'Recommendation', style: 'tableHeader' },
        { text: 'Selected', style: 'tableHeader', alignment: 'center' },
      ],
      [
        'Covert Intelligence Validation',
        { 
          text: tbData.recCovertValidation ? 'Yes' : 'No',
          alignment: 'center',
          fontSize: 10,
          bold: true,
          color: tbData.recCovertValidation ? '#059669' : '#dc2626'
        }
      ],
      [
        'Evidential Test Purchase (ETP)',
        { 
          text: tbData.recEtp ? 'Yes' : 'No',
          alignment: 'center',
          fontSize: 10,
          bold: true,
          color: tbData.recEtp ? '#059669' : '#dc2626'
        }
      ],
      [
        'Controlled Market Reconnaissance',
        { 
          text: tbData.recMarketReconnaissance ? 'Yes' : 'No',
          alignment: 'center',
          fontSize: 10,
          bold: true,
          color: tbData.recMarketReconnaissance ? '#059669' : '#dc2626'
        }
      ],
      [
        'Enforcement Planning (Deferred)',
        { 
          text: tbData.recEnforcementDeferred ? 'Yes' : 'No',
          alignment: 'center',
          fontSize: 10,
          bold: true,
          color: tbData.recEnforcementDeferred ? '#059669' : '#dc2626'
        }
      ],
      [
        'Continued Monitoring',
        { 
          text: tbData.recContinuedMonitoring ? 'Yes' : 'No',
          alignment: 'center',
          fontSize: 10,
          bold: true,
          color: tbData.recContinuedMonitoring ? '#059669' : '#dc2626'
        }
      ],
      [
        'Client-Specific Segregation Required',
        { 
          text: tbData.recClientSegregation ? 'Yes' : 'No',
          alignment: 'center',
          fontSize: 10,
          bold: true,
          color: tbData.recClientSegregation ? '#059669' : '#dc2626'
        }
      ],
    ],
  },
  layout: {
    hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0.5),
    vLineWidth: () => 1,
    hLineColor: () => '#e5e7eb',
    vLineColor: () => '#e5e7eb',
  },
  marginBottom: 15,
},


      // 9. Confidentiality & Ring-Fencing Note
      {
        text: '9. Confidentiality & Ring-Fencing Note',
        style: 'sectionHeader',
      },
      {
        text: tbData.confidentialityNote ||
          "This lead has been generated through True Buddy's proprietary intelligence mechanisms and may be relevant to more than one brand or client. Accordingly, all investigations, validations, and actions---if approved---will be strictly ring-fenced for the concerned client. No cross-sharing of intelligence, sources, or findings will occur across clients.",
        fontSize: 10,
        alignment: 'justify',
        marginBottom: 15,
      },

      // 10. Remarks
      {
        text: '10. Remarks',
        style: 'sectionHeader',
      },
      {
        text: tbData.remarks || '(Operational sensitivities, timing considerations, or risk flags)',
        fontSize: 10,
        italics: !tbData.remarks,
        marginBottom: 15,
      },

      // 11. Disclaimer
      {
        text: '11. Disclaimer',
        style: 'sectionHeader',
      },
      {
        text: tbData.customDisclaimer ||
          'This preliminary assessment is based on internally generated intelligence and limited non-intrusive verification. Specific source details, identities, and methods have been deliberately withheld to preserve confidentiality and prevent information contamination. This document does not constitute a final investigative report or confirmation of infringement. Any further action will be undertaken only upon written client approval and under a client-specific scope of work. Additional costs for validation, mobilisation, or enforcement shall be applicable as per the agreed proposal.',
        fontSize: 9,
        alignment: 'justify',
        marginBottom: 20,
      },
    ],
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount}`,
      fontSize: 9,
      color: SECONDARY_COLOR,
      alignment: 'center',
      margin: [0, 10, 0, 0],
    }),
  };

  return docDefinition;
};

// ✅ ADD THIS NEW FUNCTION - Export the doc definition for preview
export const getPreReportDocDefinition = (data: PreReportPDFData) => {
  const isClientLead = data.leadType === 'CLIENT_LEAD';
  return isClientLead
    ? generateClientLeadPDF(data)
    : generateTrueBuddyLeadPDF(data);
};

// ✅ NEW - Open PDF in new browser tab (for preview)
export const openPreReportInNewTab = (data: PreReportPDFData) => {
  try {
    const isClientLead = data.leadType === 'CLIENT_LEAD';
    const docDefinition = isClientLead
      ? generateClientLeadPDF(data)
      : generateTrueBuddyLeadPDF(data);

    // Open PDF in new browser tab
    pdfMake.createPdf(docDefinition).open();
    
    return { success: true };
  } catch (error) {
    console.error('PDF Preview Error:', error);
    throw new Error('Failed to open PDF preview. Please try again.');
  }
};

export const exportPreReportToPDF = async (data: PreReportPDFData) => {
  try {
    const isClientLead = data.leadType === 'CLIENT_LEAD';
    const docDefinition = isClientLead
      ? generateClientLeadPDF(data)
      : generateTrueBuddyLeadPDF(data);

    const fileName = `PreReport_${data.reportId}_${new Date().getTime()}.pdf`;
    pdfMake.createPdf(docDefinition).download(fileName);

    return { success: true };
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};
