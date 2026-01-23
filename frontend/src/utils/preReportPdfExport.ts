// src/utils/preReportPdfExport.ts
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// @ts-ignore
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;

// Define fonts with all variants
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};
const BRAND_COLOR = '#1e40af';
const SECONDARY_COLOR = '#64748b';
const TEXT_COLOR = '#1f2937';
const LIGHT_BG = '#f8fafc';

export interface PreReportPDFData {
  // Basic Info
  reportId: string;
  clientName: string;
  leadType: 'CLIENT_LEAD' | 'TRUE_BUDDY_LEAD';
  status: string;
  createdAt: string;
  updatedAt: string;
  
  // Client Lead Data
  clientLeadData?: {
    // Step 1: Basic Info
    investigationDate?: string;
    investigatorName?: string;
    location?: string;
    
    // Step 2: Scope
    scopeOfWork?: string;
    objectives?: string;
    
    // Step 3: Target Details
    targetName?: string;
    targetAddress?: string;
    targetContact?: string;
    
    // Step 4: Verification
    verificationMethod?: string;
    verificationStatus?: string;
    verifiedBy?: string;
    
    // Step 5: Observations
    observations?: string;
    findings?: string;
    
    // Step 6: Quality
    qualityRating?: string;
    qualityNotes?: string;
    
    // Step 7: Assessment
    riskLevel?: string;
    assessmentSummary?: string;
    
    // Step 8: Recommendations
    recommendations?: string;
    actionItems?: string;
    
    // Step 9: Remarks
    additionalRemarks?: string;
    
    // Step 10: Disclaimer
    disclaimer?: string;
  };
  
  // TrueBuddy Lead Data
  trueBuddyLeadData?: {
    // Step 1: Basic Info
    investigationDate?: string;
    investigatorName?: string;
    location?: string;
    
    // Step 2: Scope
    scopeOfWork?: string;
    objectives?: string;
    
    // Step 3: Intelligence
    intelligenceGathered?: string;
    sources?: string;
    
    // Step 4: Verification
    verificationMethod?: string;
    verificationStatus?: string;
    
    // Step 5: Observations
    observations?: string;
    
    // Step 6: Risk
    riskAssessment?: string;
    riskLevel?: string;
    
    // Step 7: Assessment
    overallAssessment?: string;
    
    // Step 8: Recommendations
    recommendations?: string;
    
    // Step 9: Confidentiality
    confidentialityNotes?: string;
    
    // Step 10: Remarks
    remarks?: string;
    
    // Step 11: Disclaimer
    disclaimer?: string;
  };
  
  // Products
  products?: Array<{
    name: string;
    category: string;
    status: string;
  }>;
}

export const generatePreReportPDF = (data: PreReportPDFData) => {
  const isClientLead = data.leadType === 'CLIENT_LEAD';
  const reportData = isClientLead ? data.clientLeadData : data.trueBuddyLeadData;

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10,
      color: TEXT_COLOR,
      lineHeight: 1.4,
    },
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        color: BRAND_COLOR,
        marginBottom: 5,
      },
      subheader: {
        fontSize: 12,
        color: SECONDARY_COLOR,
        marginBottom: 15,
      },
      sectionTitle: {
        fontSize: 13,
        bold: true,
        color: BRAND_COLOR,
        marginTop: 15,
        marginBottom: 8,
        decoration: 'underline',
      },
      label: {
        fontSize: 9,
        bold: true,
        color: SECONDARY_COLOR,
        marginBottom: 3,
      },
      value: {
        fontSize: 10,
        color: TEXT_COLOR,
        marginBottom: 10,
      },
      badge: {
        fontSize: 9,
        bold: true,
        alignment: 'center',
        color: '#ffffff',
      },
      tableHeader: {
        fontSize: 10,
        bold: true,
        fillColor: LIGHT_BG,
        color: TEXT_COLOR,
      },
    },
    header: (currentPage: number) => {
      if (currentPage === 1) return null;
      return {
        columns: [
          {
            text: 'PRE-EMPLOYMENT VERIFICATION REPORT',
            fontSize: 9,
            color: SECONDARY_COLOR,
            margin: [40, 20, 0, 0],
          },
          {
            text: data.reportId,
            fontSize: 9,
            color: SECONDARY_COLOR,
            alignment: 'right',
            margin: [0, 20, 40, 0],
          },
        ],
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
        marginTop: 40,
      },
      {
        text: 'TBCPL Workforce Management System',
        fontSize: 11,
        color: SECONDARY_COLOR,
        alignment: 'center',
        marginBottom: 50,
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 150,
            y1: 0,
            x2: 365,
            y2: 0,
            lineWidth: 2,
            lineColor: BRAND_COLOR,
          },
        ],
        marginBottom: 30,
      },
      {
        text: 'PRE-EMPLOYMENT VERIFICATION REPORT',
        style: 'header',
        alignment: 'center',
        marginBottom: 10,
      },
      {
        text: isClientLead ? 'CLIENT LEAD INVESTIGATION' : 'TRUE BUDDY LEAD INVESTIGATION',
        fontSize: 12,
        bold: true,
        color: SECONDARY_COLOR,
        alignment: 'center',
        marginBottom: 50,
      },

      // Report Info Box
      {
        table: {
          widths: ['30%', '70%'],
          body: [
            [
              { text: 'Report ID:', style: 'label', border: [true, true, false, false] },
              { text: data.reportId, style: 'value', border: [false, true, true, false] },
            ],
            [
              { text: 'Client Name:', style: 'label', border: [true, false, false, false] },
              { text: data.clientName, style: 'value', border: [false, false, true, false] },
            ],
            [
              { text: 'Report Status:', style: 'label', border: [true, false, false, false] },
              {
                text: data.status,
                style: 'badge',
                fillColor: getStatusColor(data.status),
                border: [false, false, true, false],
              },
            ],
            [
              { text: 'Generated Date:', style: 'label', border: [true, false, false, false] },
              {
                text: new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }),
                style: 'value',
                border: [false, false, true, false],
              },
            ],
            [
              { text: 'Investigation Date:', style: 'label', border: [true, false, false, true] },
              {
                text: reportData?.investigationDate
                  ? new Date(reportData.investigationDate).toLocaleDateString('en-IN')
                  : 'N/A',
                style: 'value',
                border: [false, false, true, true],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        marginBottom: 30,
      },

      // Confidentiality Notice
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
        text: 'INVESTIGATION DETAILS',
        style: 'sectionTitle',
      },

      // Basic Information Section
      {
        text: 'Basic Information',
        fontSize: 11,
        bold: true,
        color: TEXT_COLOR,
        marginTop: 10,
        marginBottom: 5,
      },
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'Investigator Name', style: 'label' },
              { text: reportData?.investigatorName || 'N/A', style: 'value' },
              { text: 'Investigation Date', style: 'label' },
              {
                text: reportData?.investigationDate
                  ? new Date(reportData.investigationDate).toLocaleDateString('en-IN')
                  : 'N/A',
                style: 'value',
              },
            ],
          },
          {
            width: '50%',
            stack: [
              { text: 'Location', style: 'label' },
              { text: reportData?.location || 'N/A', style: 'value' },
              { text: 'Lead Type', style: 'label' },
              {
                text: isClientLead ? 'Client Lead' : 'True Buddy Lead',
                style: 'value',
              },
            ],
          },
        ],
        columnGap: 20,
        marginBottom: 15,
      },

      // Scope of Work
      ...(reportData?.scopeOfWork
        ? [
            { text: 'Scope of Work', style: 'sectionTitle' },
            {
              text: reportData.scopeOfWork,
              style: 'value',
              alignment: 'justify',
            },
          ]
        : []),

      // Objectives
      ...(reportData?.objectives
        ? [
            { text: 'Objectives', style: 'sectionTitle' },
            {
              text: reportData.objectives,
              style: 'value',
              alignment: 'justify',
            },
          ]
        : []),

      // CLIENT LEAD SPECIFIC SECTIONS
      ...(isClientLead && data.clientLeadData
        ? [
            // Target Details
            ...(data.clientLeadData.targetName
              ? [
                  { text: 'Target Details', style: 'sectionTitle' },
                  {
                    columns: [
                      {
                        width: '50%',
                        stack: [
                          { text: 'Target Name', style: 'label' },
                          { text: data.clientLeadData.targetName, style: 'value' },
                          { text: 'Contact', style: 'label' },
                          { text: data.clientLeadData.targetContact || 'N/A', style: 'value' },
                        ],
                      },
                      {
                        width: '50%',
                        stack: [
                          { text: 'Address', style: 'label' },
                          { text: data.clientLeadData.targetAddress || 'N/A', style: 'value' },
                        ],
                      },
                    ],
                    columnGap: 20,
                    marginBottom: 15,
                  },
                ]
              : []),

            // Verification
            ...(data.clientLeadData.verificationStatus
              ? [
                  { text: 'Verification Details', style: 'sectionTitle' },
                  {
                    table: {
                      widths: ['40%', '60%'],
                      body: [
                        [
                          { text: 'Verification Method', style: 'tableHeader' },
                          { text: data.clientLeadData.verificationMethod || 'N/A' },
                        ],
                        [
                          { text: 'Verification Status', style: 'tableHeader' },
                          { text: data.clientLeadData.verificationStatus || 'N/A' },
                        ],
                        [
                          { text: 'Verified By', style: 'tableHeader' },
                          { text: data.clientLeadData.verifiedBy || 'N/A' },
                        ],
                      ],
                    },
                    marginBottom: 15,
                  },
                ]
              : []),

            // Observations & Findings
            ...(data.clientLeadData.observations || data.clientLeadData.findings
              ? [
                  { text: 'Observations & Findings', style: 'sectionTitle' },
                  ...(data.clientLeadData.observations
                    ? [
                        { text: 'Observations', style: 'label' },
                        {
                          text: data.clientLeadData.observations,
                          style: 'value',
                          alignment: 'justify',
                        },
                      ]
                    : []),
                  ...(data.clientLeadData.findings
                    ? [
                        { text: 'Findings', style: 'label' },
                        {
                          text: data.clientLeadData.findings,
                          style: 'value',
                          alignment: 'justify',
                        },
                      ]
                    : []),
                ]
              : []),

            // Quality Assessment
            ...(data.clientLeadData.qualityRating
              ? [
                  { text: 'Quality Assessment', style: 'sectionTitle' },
                  { text: 'Quality Rating', style: 'label' },
                  { text: data.clientLeadData.qualityRating, style: 'value' },
                  ...(data.clientLeadData.qualityNotes
                    ? [
                        { text: 'Quality Notes', style: 'label' },
                        {
                          text: data.clientLeadData.qualityNotes,
                          style: 'value',
                          alignment: 'justify',
                        },
                      ]
                    : []),
                ]
              : []),

            // Risk Assessment
            ...(data.clientLeadData.riskLevel || data.clientLeadData.assessmentSummary
              ? [
                  { text: 'Risk Assessment', style: 'sectionTitle' },
                  ...(data.clientLeadData.riskLevel
                    ? [
                        { text: 'Risk Level', style: 'label' },
                        {
                          text: data.clientLeadData.riskLevel,
                          style: 'badge',
                          fillColor: getRiskColor(data.clientLeadData.riskLevel),
                          marginBottom: 10,
                        },
                      ]
                    : []),
                  ...(data.clientLeadData.assessmentSummary
                    ? [
                        { text: 'Assessment Summary', style: 'label' },
                        {
                          text: data.clientLeadData.assessmentSummary,
                          style: 'value',
                          alignment: 'justify',
                        },
                      ]
                    : []),
                ]
              : []),

            // Recommendations
            ...(data.clientLeadData.recommendations || data.clientLeadData.actionItems
              ? [
                  { text: 'Recommendations & Action Items', style: 'sectionTitle' },
                  ...(data.clientLeadData.recommendations
                    ? [
                        { text: 'Recommendations', style: 'label' },
                        {
                          text: data.clientLeadData.recommendations,
                          style: 'value',
                          alignment: 'justify',
                        },
                      ]
                    : []),
                  ...(data.clientLeadData.actionItems
                    ? [
                        { text: 'Action Items', style: 'label' },
                        {
                          text: data.clientLeadData.actionItems,
                          style: 'value',
                          alignment: 'justify',
                        },
                      ]
                    : []),
                ]
              : []),

            // Additional Remarks
            ...(data.clientLeadData.additionalRemarks
              ? [
                  { text: 'Additional Remarks', style: 'sectionTitle' },
                  {
                    text: data.clientLeadData.additionalRemarks,
                    style: 'value',
                    alignment: 'justify',
                  },
                ]
              : []),
          ]
        : []),

      // TRUE BUDDY LEAD SPECIFIC SECTIONS
      ...(!isClientLead && data.trueBuddyLeadData
        ? [
            // Intelligence Gathered
            ...(data.trueBuddyLeadData.intelligenceGathered
              ? [
                  { text: 'Intelligence Gathered', style: 'sectionTitle' },
                  {
                    text: data.trueBuddyLeadData.intelligenceGathered,
                    style: 'value',
                    alignment: 'justify',
                  },
                  ...(data.trueBuddyLeadData.sources
                    ? [
                        { text: 'Sources', style: 'label' },
                        { text: data.trueBuddyLeadData.sources, style: 'value' },
                      ]
                    : []),
                ]
              : []),

            // Verification
            ...(data.trueBuddyLeadData.verificationStatus
              ? [
                  { text: 'Verification', style: 'sectionTitle' },
                  { text: 'Method', style: 'label' },
                  { text: data.trueBuddyLeadData.verificationMethod || 'N/A', style: 'value' },
                  { text: 'Status', style: 'label' },
                  { text: data.trueBuddyLeadData.verificationStatus, style: 'value' },
                ]
              : []),

            // Observations
            ...(data.trueBuddyLeadData.observations
              ? [
                  { text: 'Observations', style: 'sectionTitle' },
                  {
                    text: data.trueBuddyLeadData.observations,
                    style: 'value',
                    alignment: 'justify',
                  },
                ]
              : []),

            // Risk Assessment
            ...(data.trueBuddyLeadData.riskAssessment || data.trueBuddyLeadData.riskLevel
              ? [
                  { text: 'Risk Assessment', style: 'sectionTitle' },
                  ...(data.trueBuddyLeadData.riskLevel
                    ? [
                        { text: 'Risk Level', style: 'label' },
                        {
                          text: data.trueBuddyLeadData.riskLevel,
                          style: 'badge',
                          fillColor: getRiskColor(data.trueBuddyLeadData.riskLevel),
                          marginBottom: 10,
                        },
                      ]
                    : []),
                  ...(data.trueBuddyLeadData.riskAssessment
                    ? [
                        { text: 'Risk Assessment Details', style: 'label' },
                        {
                          text: data.trueBuddyLeadData.riskAssessment,
                          style: 'value',
                          alignment: 'justify',
                        },
                      ]
                    : []),
                ]
              : []),

            // Overall Assessment
            ...(data.trueBuddyLeadData.overallAssessment
              ? [
                  { text: 'Overall Assessment', style: 'sectionTitle' },
                  {
                    text: data.trueBuddyLeadData.overallAssessment,
                    style: 'value',
                    alignment: 'justify',
                  },
                ]
              : []),

            // Recommendations
            ...(data.trueBuddyLeadData.recommendations
              ? [
                  { text: 'Recommendations', style: 'sectionTitle' },
                  {
                    text: data.trueBuddyLeadData.recommendations,
                    style: 'value',
                    alignment: 'justify',
                  },
                ]
              : []),

            // Confidentiality
            ...(data.trueBuddyLeadData.confidentialityNotes
              ? [
                  { text: 'Confidentiality Notes', style: 'sectionTitle' },
                  {
                    text: data.trueBuddyLeadData.confidentialityNotes,
                    style: 'value',
                    alignment: 'justify',
                    color: '#dc2626',
                    bold: true,
                  },
                ]
              : []),

            // Remarks
            ...(data.trueBuddyLeadData.remarks
              ? [
                  { text: 'Remarks', style: 'sectionTitle' },
                  {
                    text: data.trueBuddyLeadData.remarks,
                    style: 'value',
                    alignment: 'justify',
                  },
                ]
              : []),
          ]
        : []),

      // Products Section (if any)
      ...(data.products && data.products.length > 0
        ? [
            { text: 'Associated Products', style: 'sectionTitle' },
            {
              table: {
                headerRows: 1,
                widths: ['*', '*', 'auto'],
                body: [
                  [
                    { text: 'Product Name', style: 'tableHeader' },
                    { text: 'Category', style: 'tableHeader' },
                    { text: 'Status', style: 'tableHeader' },
                  ],
                  ...data.products.map((product) => [
                    product.name,
                    product.category,
                    {
                      text: product.status,
                      style: 'badge',
                      fillColor: getStatusColor(product.status),
                    },
                  ]),
                ],
              },
              marginBottom: 15,
            },
          ]
        : []),

      // Disclaimer Section
      {
        text: 'DISCLAIMER',
        style: 'sectionTitle',
        marginTop: 20,
      },
      {
        text:
          reportData?.disclaimer ||
          'This report is based on the information available at the time of investigation. True Buddy Consulting Pvt. Ltd. makes no warranties or representations as to the accuracy of the information contained herein. This report is confidential and intended solely for the use of the client.',
        fontSize: 9,
        italics: true,
        color: SECONDARY_COLOR,
        alignment: 'justify',
        marginBottom: 30,
      },

      // Signature Section
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: '_____________________', marginTop: 30 },
              { text: 'Authorized Signature', fontSize: 9, color: SECONDARY_COLOR, marginTop: 5 },
              { text: reportData?.investigatorName || 'Investigator', fontSize: 10, bold: true },
            ],
          },
          {
            width: '50%',
            stack: [
              { text: '_____________________', marginTop: 30 },
              { text: 'Date', fontSize: 9, color: SECONDARY_COLOR, marginTop: 5 },
              {
                text: new Date().toLocaleDateString('en-IN'),
                fontSize: 10,
                bold: true,
              },
            ],
          },
        ],
        columnGap: 50,
      },
    ],
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        {
          text: '© 2026 True Buddy Consulting Pvt. Ltd. | Confidential Document',
          fontSize: 8,
          color: SECONDARY_COLOR,
          width: '*',
        },
        {
          text: `Page ${currentPage} of ${pageCount}`,
          fontSize: 8,
          color: SECONDARY_COLOR,
          width: 'auto',
          alignment: 'right',
        },
      ],
      margin: [40, 10, 40, 0],
    }),
  };

  // Generate and download PDF
  const fileName = `PreReport_${data.reportId}_${new Date().getTime()}.pdf`;
  pdfMake.createPdf(docDefinition).download(fileName);
};

// Helper Functions
function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    DRAFT: '#f59e0b',
    PENDING: '#3b82f6',
    IN_PROGRESS: '#8b5cf6',
    COMPLETED: '#10b981',
    SUBMITTED: '#10b981',
    APPROVED: '#059669',
    REJECTED: '#ef4444',
    ACTIVE: '#10b981',
    INACTIVE: '#6b7280',
  };
  return statusColors[status.toUpperCase()] || '#6b7280';
}

function getRiskColor(riskLevel: string): string {
  const riskColors: Record<string, string> = {
    LOW: '#10b981',
    MEDIUM: '#f59e0b',
    HIGH: '#ef4444',
    CRITICAL: '#dc2626',
  };
  return riskColors[riskLevel.toUpperCase()] || '#6b7280';
}

export const exportPreReportToPDF = async (data: PreReportPDFData) => {
  try {
    generatePreReportPDF(data);
    return { success: true };
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};
