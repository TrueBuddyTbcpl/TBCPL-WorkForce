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
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};

const C_NAVY = '#0f2340';
const C_NAVY_MID = '#1a3a5c';
const C_GOLD = '#c8972b';
const C_HDR_BG = '#e8eef5';
const C_ROW_ALT = '#f4f7fb';
const C_BORDER = '#b8c8d8';
const C_TEXT = '#000000';
const C_MUTED = '#4a5568';
const C_WHITE = '#ffffff';

const STANDARD_LAYOUT = {
  hLineWidth: (i: number, node: any) => {
    if (i === 0 || i === node.table.body.length) return 1.2;
    if (i === 1) return 0.8;
    return 0.4;
  },
  vLineWidth: (i: number, node: any) => {
    if (i === 0 || i === node.table.widths.length) return 1.2;
    return 0.4;
  },
  hLineColor: (i: number, node: any) =>
    i === 0 || i === node.table.body.length ? C_NAVY_MID : C_BORDER,
  vLineColor: (i: number, node: any) =>
    i === 0 || i === node.table.widths.length ? C_NAVY_MID : C_BORDER,
  paddingLeft: () => 9,
  paddingRight: () => 9,
  paddingTop: () => 6,
  paddingBottom: () => 6,
  dontBreakRows: true,
};

const STYLES: any = {
  sectionHeader: { fontSize: 11, bold: true, marginTop: 14, marginBottom: 6 },
  tableHeader: { fontSize: 9, bold: true, fillColor: C_HDR_BG, color: C_NAVY },
  bodyText: { fontSize: 10, color: C_TEXT },
};

export interface PreReportPDFData {
  reportId: string;
  clientName: string;
  leadType: 'CLIENT_LEAD' | 'TRUE_BUDDY_LEAD';
  status: string;
  createdAt: string;
  updatedAt: string;
  products?: Array<{ name: string; category: string; status: string }>;
  clientLeadData?: ClientLeadData;
  trueBuddyLeadData?: TrueBuddyLeadData;
}

const toTitleCase = (value: string): string => {
  if (!value) return 'N/A';
  return value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const mapYesNo = (v: any): string =>
  !v ? 'N/A' : String(v).toUpperCase() === 'YES' ? 'Yes' : 'No';

const isVerificationDone = (v: any): boolean =>
  !!v && String(v).toUpperCase() === 'DONE';

const mapCompleteness = (v: any): string => {
  if (!v) return 'N/A';
  const s = String(v).toUpperCase();
  if (s === 'COMPLETE') return 'Complete';
  if (s === 'PARTIALLY_COMPLETE') return 'Partially Complete';
  if (s === 'INCOMPLETE') return 'Incomplete';
  return toTitleCase(v);
};

const mapAccuracy = (v: any): string => {
  if (!v) return 'N/A';
  const s = String(v).toUpperCase();
  return s === 'ACCURATE' ? 'Accurate' : s === 'INACCURATE' ? 'Inaccurate' : toTitleCase(v);
};

const mapRiskLevel = (v: any): string => {
  if (!v) return 'N/A';
  const s = String(v).toUpperCase();
  return s === 'LOW' ? 'Low' : s === 'MEDIUM' ? 'Medium' : s === 'HIGH' ? 'High' : toTitleCase(v);
};

const mapClientAssessment = (v: any): string => {
  if (!v) return 'N/A';
  const s = String(v).toUpperCase();
  if (s === 'ACTIONABLE') return 'Actionable Lead';
  if (s === 'POTENTIALLY_ACTIONABLE') return 'Potentially Actionable (Information Gaps Exist)';
  if (s === 'NON_ACTIONABLE') return 'Non-Actionable at Present';
  return toTitleCase(v);
};

const mapTrueBuddyAssessment = (v: any): string => {
  if (!v) return 'N/A';
  const s = String(v).toUpperCase();
  if (s === 'ACTIONABLE') return 'Actionable (Subject to Client Alignment)';
  if (s === 'ACTIONABLE_AFTER_VALIDATION') return 'Actionable After Controlled Validation';
  if (s === 'HOLD') return 'Hold -- Monitoring Recommended';
  return toTitleCase(v);
};

const mapProductCategory = (v: any): string => {
  if (!v) return 'N/A';
  const s = String(v).toUpperCase();
  return s === 'CROP_PROTECTION' ? 'Crop Protection' : s === 'SEEDS' ? 'Seeds' : toTitleCase(v);
};

const mapInfringementType = (v: any): string => {
  if (!v) return 'N/A';
  const s = String(v).toUpperCase();
  return s === 'COUNTERFEIT' ? 'Counterfeit' : s === 'LOOKALIKE' ? 'Lookalike' : toTitleCase(v);
};

const mapNatureOfEntity = (v: any): string => {
  if (!v) return 'N/A';
  const m: Record<string, string> = {
    SUPPLIER: 'Supplier', MANUFACTURER: 'Manufacturer',
    PACKAGER: 'Packager', STOCKIST: 'Stockist',
  };
  return m[String(v).toUpperCase()] ?? toTitleCase(v);
};

const mapIntelNature = (v: any): string => {
  if (!v) return 'N/A';
  const m: Record<string, string> = {
    MARKET: 'Market', SUPPLY_CHAIN: 'Supply Chain', MANUFACTURING: 'Manufacturing',
  };
  return m[String(v).toUpperCase()] ?? toTitleCase(v);
};

const mapSuspectedActivity = (v: any): string => {
  if (!v) return 'N/A';
  const m: Record<string, string> = {
    COUNTERFEITING: 'Counterfeiting', LOOKALIKE: 'Lookalike', SPURIOUS: 'Spurious',
  };
  return m[String(v).toUpperCase()] ?? toTitleCase(v);
};

const mapSupplyChainStage = (v: any): string => {
  if (!v) return 'N/A';
  const m: Record<string, string> = { UPSTREAM: 'Upstream', MIDSTREAM: 'Midstream' };
  return m[String(v).toUpperCase()] ?? toTitleCase(v);
};

const mapSourceReliability = (v: any): string => {
  if (!v) return 'N/A';
  const m: Record<string, string> = { HIGH: 'High', MEDIUM: 'Medium' };
  return m[String(v).toUpperCase()] ?? toTitleCase(v);
};

const row = (label: string, value: string, index = 0) => [
  { text: label, bold: true, fontSize: 9, color: C_NAVY, fillColor: index % 2 === 0 ? C_WHITE : C_ROW_ALT },
  { text: value || 'N/A', fontSize: 9, color: C_TEXT, fillColor: index % 2 === 0 ? C_WHITE : C_ROW_ALT },
];

const verRow = (activity: string, value: any, notes: string, index = 0) => {
  const done = isVerificationDone(value);
  return [
    { text: activity, fontSize: 9, color: C_TEXT, fillColor: index % 2 === 0 ? C_WHITE : C_ROW_ALT },
    { text: done ? 'DONE' : 'PENDING', fontSize: 8.5, bold: true, alignment: 'center' as const, color: done ? C_NAVY : C_MUTED, fillColor: done ? C_HDR_BG : C_WHITE },
    { text: notes || '-', fontSize: 9, color: C_TEXT, fillColor: index % 2 === 0 ? C_WHITE : C_ROW_ALT },
  ];
};

const buildCheckedList = (items: { label: string; checked: boolean | null | undefined }[]) => {
  const selected = items.filter((i) => !!i.checked);
  if (!selected.length) return null;
  return {
    table: {
      widths: ['6%', '94%'],
      body: selected.map((i, idx) => [
        { text: '>>', fontSize: 9, bold: true, alignment: 'center' as const, color: C_NAVY, fillColor: idx % 2 === 0 ? C_WHITE : C_ROW_ALT },
        { text: i.label, fontSize: 9, color: C_TEXT, fillColor: idx % 2 === 0 ? C_WHITE : C_ROW_ALT },
      ]),
    },
    layout: STANDARD_LAYOUT,
    marginBottom: 12,
  };
};

const buildVerificationTable = (rows: { activity: string; value: any; notes: string }[]) => {
  const done = rows.filter((r) => isVerificationDone(r.value));
  if (!done.length) return null;
  return {
    table: {
      widths: ['46%', '14%', '40%'],
      body: [
        [
          { text: 'Activity', ...STYLES.tableHeader },
          { text: 'Status', ...STYLES.tableHeader, alignment: 'center' },
          { text: 'Key Notes', ...STYLES.tableHeader },
        ],
        ...done.map((r, i) => verRow(r.activity, r.value, r.notes, i)),
      ],
    },
    layout: STANDARD_LAYOUT,
    marginBottom: 12,
  };
};

const buildObservationTable = (rows: { label: string; value: any }[]) => {
  const yes = rows.filter((r) => String(r.value || '').toUpperCase() === 'YES');
  if (!yes.length) return null;
  return {
    table: {
      widths: ['6%', '94%'],
      body: yes.map((r, idx) => [
        { text: '>>', fontSize: 9, bold: true, alignment: 'center' as const, color: C_NAVY, fillColor: idx % 2 === 0 ? C_WHITE : C_ROW_ALT },
        { text: r.label, fontSize: 9, color: C_TEXT, fillColor: idx % 2 === 0 ? C_WHITE : C_ROW_ALT },
      ]),
    },
    layout: STANDARD_LAYOUT,
    marginBottom: 12,
  };
};

const buildDataTable = (widths: string[], headers: string[], bodyRows: any[][]) => ({
  table: {
    widths,
    body: [
      headers.map((h) => ({ text: h, ...STYLES.tableHeader })),
      ...bodyRows,
    ],
  },
  layout: STANDARD_LAYOUT,
  marginBottom: 12,
});

// ── sectionBlock: NO unbreakable, NO page forcing, NO noteText ───────────────
const sectionBlock = (n: number, title: string, ...contentItems: any[]): any | null => {
  const filtered = contentItems.filter(Boolean);
  if (!filtered.length) return null;
  return {
    stack: [sec(n, title), ...filtered],
    marginTop: 14,
  };
};

const buildCoverPage = (data: PreReportPDFData, productNames: string, subtitle: string): any[] => [
  {
    table: {
      widths: ['*'],
      body: [
        [{ text: 'TRUE BUDDY CONSULTING PVT. LTD.', fontSize: 20, bold: true, color: C_WHITE, alignment: 'center', fillColor: C_NAVY, margin: [0, 28, 0, 6] }],
        [{ text: 'Due Diligence  |  IPR Investigation  |  Fraud Investigation | Market Surveys', fontSize: 9.5, italics: true, color: '#a8c4dc', alignment: 'center', fillColor: C_NAVY, margin: [0, 0, 0, 22] }],
      ],
    },
    layout: 'noBorders',
    marginBottom: 0,
  },
  { canvas: [{ type: 'rect', x: 0, y: 0, w: 495, h: 4, color: C_GOLD }], marginBottom: 50 },
  { text: 'PRELIMINARY LEAD ASSESSMENT REPORT', fontSize: 16, bold: true, color: C_NAVY, alignment: 'center', marginBottom: 6 },
  { canvas: [{ type: 'line', x1: 120, y1: 0, x2: 375, y2: 0, lineWidth: 1, lineColor: C_GOLD }], marginBottom: 10 },
  { text: subtitle, fontSize: 10, italics: true, color: C_MUTED, alignment: 'center', marginBottom: 50 },
  {
    table: {
      widths: ['34%', '66%'],
      body: [
        [
          { text: 'CLIENT', bold: true, fontSize: 8.5, color: C_WHITE, fillColor: C_NAVY, margin: [10, 8, 8, 8] },
          { text: data.clientName, fontSize: 10, bold: true, color: C_NAVY, fillColor: C_WHITE, margin: [10, 8, 8, 8] },
        ],
        [
          { text: 'PRODUCT(S)', bold: true, fontSize: 8.5, color: C_WHITE, fillColor: C_NAVY_MID, margin: [10, 8, 8, 8] },
          { text: productNames, fontSize: 9, color: C_TEXT, fillColor: C_ROW_ALT, margin: [10, 8, 8, 8] },
        ],
        [
          { text: 'REPORT ID', bold: true, fontSize: 8.5, color: C_WHITE, fillColor: C_NAVY, margin: [10, 8, 8, 8] },
          { text: data.reportId, fontSize: 9, color: C_TEXT, fillColor: C_WHITE, margin: [10, 8, 8, 8] },
        ],
        [
          { text: 'LEAD TYPE', bold: true, fontSize: 8.5, color: C_WHITE, fillColor: C_NAVY_MID, margin: [10, 8, 8, 8] },
          { text: data.leadType === 'CLIENT_LEAD' ? 'Client Lead' : 'True Buddy Lead', fontSize: 9, color: C_TEXT, fillColor: C_ROW_ALT, margin: [10, 8, 8, 8] },
        ],
        [
          { text: 'STATUS', bold: true, fontSize: 8.5, color: C_WHITE, fillColor: C_NAVY, margin: [10, 8, 8, 8] },
          { text: toTitleCase(data.status), fontSize: 9, color: C_TEXT, fillColor: C_WHITE, margin: [10, 8, 8, 8] },
        ],
        [
          { text: 'DATE GENERATED', bold: true, fontSize: 8.5, color: C_WHITE, fillColor: C_NAVY_MID, margin: [10, 8, 8, 8] },
          { text: new Date(data.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }), fontSize: 9, color: C_TEXT, fillColor: C_ROW_ALT, margin: [10, 8, 8, 8] },
        ],
      ],
    },
    layout: {
      hLineWidth: (i: number, node: any) => i === 0 || i === node.table.body.length ? 1.5 : 0.5,
      vLineWidth: (i: number, node: any) => i === 0 || i === node.table.widths.length ? 1.5 : 0.5,
      hLineColor: (i: number, node: any) => i === 0 || i === node.table.body.length ? C_NAVY : C_BORDER,
      vLineColor: (i: number, node: any) => i === 0 || i === node.table.widths.length ? C_NAVY : C_BORDER,
    },
    marginBottom: 50,
  },
  {
    table: {
      widths: ['*'],
      body: [[{
        stack: [
          { text: 'CONFIDENTIAL DOCUMENT', fontSize: 11, bold: true, color: C_NAVY, alignment: 'center', marginBottom: 5 },
          { text: 'This report contains sensitive information intended solely for authorised personnel.\nUnauthorised disclosure, reproduction, or distribution is strictly prohibited.', fontSize: 8.5, italics: true, color: C_MUTED, alignment: 'center' },
        ],
        fillColor: '#eef3f8',
        margin: [16, 14, 16, 14],
      }]],
    },
    layout: {
      hLineWidth: () => 1,
      vLineWidth: (i: number) => (i === 0 ? 3 : 1),
      hLineColor: () => C_BORDER,
      vLineColor: (i: number) => (i === 0 ? C_GOLD : C_BORDER),
    },
  },
  { text: '', pageBreak: 'after' },
];


const sec = (n: number, title: string) => ({
  table: {
    widths: [28, '*'],
    body: [[
      {
        text: String(n),
        fontSize: 10,
        bold: true,
        color: C_WHITE,
        fillColor: C_GOLD,
        alignment: 'center' as const,
        // no margin — padding handles spacing uniformly
      },
      {
        text: title,
        fontSize: 11,
        bold: true,
        color: C_WHITE,
        fillColor: C_NAVY,
      },
    ]],
  },
  layout: {
    // ── Outer border gold, inner divider invisible ────────────────────────
    hLineWidth: (i: number, node: any) =>
      i === 0 || i === node.table.body.length ? 2 : 0,
    vLineWidth: (i: number, node: any) =>
      i === 0 || i === node.table.widths.length ? 2 : (i === 1 ? 0 : 0),
    hLineColor: () => C_GOLD,
    vLineColor: () => C_GOLD,
    // ── Uniform padding so number is perfectly centred ────────────────────
    paddingLeft: (i: number) => i === 0 ? 0 : 10,
    paddingRight: (i: number) => i === 0 ? 0 : 6,
    paddingTop: () => 6,
    paddingBottom: () => 6,
  },
  marginBottom: 7,
});



// ── assessmentBlock: NO unbreakable ──────────────────────────────────────────
const assessmentBlock = (label: string, mappedValue: string, rationale: string | undefined, rationaleLabel: string) => ({
  stack: [
    {
      table: {
        widths: ['*'],
        body: [[{
          text: [
            { text: `${label}:   `, bold: true, fontSize: 10, color: C_NAVY },
            { text: mappedValue, bold: true, fontSize: 10, color: C_TEXT },
          ],
          fillColor: C_HDR_BG,
          margin: [10, 9, 10, 9],
        }]],
      },
      layout: {
        hLineWidth: (i: number, node: any) => i === 0 || i === node.table.body.length ? 1 : 0,
        vLineWidth: (i: number) => (i === 0 ? 4 : i === 1 ? 1 : 0),
        hLineColor: () => C_BORDER,
        vLineColor: (i: number) => (i === 0 ? C_GOLD : C_BORDER),
      },
      marginBottom: 12,
    },
    { text: `${rationaleLabel}:`, bold: true, fontSize: 9.5, color: C_NAVY, marginBottom: 4 },
    { text: rationale || '', fontSize: 9.5, color: C_TEXT, marginBottom: 15 },
  ],
});

const contentTitle = (line1: string, line2: string, line3?: string): any[] => [
  { text: line1, fontSize: 14, bold: true, alignment: 'center', color: C_NAVY, marginBottom: 4 },
  { canvas: [{ type: 'line', x1: 100, y1: 0, x2: 395, y2: 0, lineWidth: 1, lineColor: C_GOLD }], marginBottom: 6 },
  { text: line2, fontSize: 9.5, italics: true, alignment: 'center', color: C_MUTED, marginBottom: line3 ? 3 : 20 },
  ...(line3 ? [{ text: line3, fontSize: 9.5, bold: true, alignment: 'center', color: C_NAVY, marginBottom: 20 }] : []),
];

const buildNumberedDisclaimer = (n: number, text: string) => ({
  stack: [
    sec(n, 'Disclaimer'),
    {
      table: {
        widths: ['*'],
        body: [[{
          text,
          fontSize: 8.5,
          alignment: 'justify',
          color: C_MUTED,
          italics: true,
          margin: [10, 9, 10, 9],
          fillColor: '#f8f9fb',
        }]],
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: (i: number) => (i === 0 ? 3 : 0.5),
        hLineColor: () => C_BORDER,
        vLineColor: (i: number) => (i === 0 ? C_NAVY_MID : C_BORDER),
      },
      marginBottom: 20,
    },
  ],
  marginTop: 18,
});

// ── Helpers to check if a step has any filled data ───────────────────────────
const hasAnyChecked = (vals: any[]) => vals.some(Boolean);
const hasAnyDone = (vals: any[]) => vals.some(v => isVerificationDone(v));
const hasAnyYes = (vals: any[]) => vals.some(v => String(v || '').toUpperCase() === 'YES');
const hasValue = (...vals: any[]) => vals.some(v => v !== null && v !== undefined && v !== '');

// ==========================================================================
//  CLIENT LEAD PDF
// ==========================================================================

const generateClientLeadPDF = (data: PreReportPDFData): any => {
  const cl = data.clientLeadData!;
  const productNames = data.products?.map((p) => p.name).join(', ') || 'N/A';

  const sections: any[] = [
    ...buildCoverPage(data, productNames, '(Based on Client-Provided Information)'),
    ...contentTitle('PRELIMINARY LEAD ASSESSMENT REPORT', '(Based on Client-Provided Information)'),
  ];

  // 1. Client & Case Details — always present
  sections.push(sectionBlock(
    1, 'Client & Case Details',
    buildDataTable(
      ['44%', '56%'],
      ['Field', 'Details'],
      [
        row('Name of Client', data.clientName, 0),
        row('Product(s) Involved', productNames, 1),
        row('Date Information Received', cl.dateInfoReceived ? new Date(cl.dateInfoReceived).toLocaleDateString('en-IN') : 'N/A', 2),
        row('Location (State / District / City)', [cl.state, cl.city].filter(Boolean).join(', ') || 'N/A', 3),
      ]
    )
  ));

  // 2. Mandate / Scope — only if at least one scope is checked
  if (hasAnyChecked([cl.scopeDueDiligence, cl.scopeIprRetailer, cl.scopeIprSupplier, cl.scopeIprManufacturer, cl.scopeOnlinePurchase, cl.scopeOfflinePurchase]) || cl.scopeCustomIds?.length) {
    sections.push(sectionBlock(
      2, 'Mandate / Scope Requested',
      buildCheckedList([
        { label: 'Due Diligence', checked: cl.scopeDueDiligence },
        { label: 'IPR Investigation -- Retailer / Wholesaler', checked: cl.scopeIprRetailer },
        { label: 'IPR Investigation -- Supplier', checked: cl.scopeIprSupplier },
        { label: 'IPR Investigation -- Manufacturer / Packager / Warehouse', checked: cl.scopeIprManufacturer },
        { label: 'Online Sample Purchase', checked: cl.scopeOnlinePurchase },
        { label: 'Offline Sample Purchase', checked: cl.scopeOfflinePurchase },
      ]),
      ...(cl.scopeCustomIds?.length
        ? [{ text: `Additional Scope: ${cl.scopeCustomIds.join(', ')}`, fontSize: 9, color: C_TEXT, marginBottom: 10 }]
        : [])
    ));
  }

  // 3. Information Received — only if any field is filled
  if (hasValue(cl.entityName, cl.suspectName, cl.contactNumbers, cl.addressLine1, cl.productDetails, cl.sourceNarrative)) {
    sections.push(sectionBlock(
      3, 'Information Received from Client',
      buildDataTable(
        ['50%', '50%'],
        ['Parameter', 'Details'],
        [
          row('Name of Entity', cl.entityName || 'N/A', 0),
          row('Name of Suspect (if different)', cl.suspectName || 'N/A', 1),
          row('Contact Number(s)', cl.contactNumbers || 'N/A', 2),
          row('Address / Location', [cl.addressLine1, cl.addressLine2, cl.city, cl.state, cl.pincode].filter(Boolean).join(', ') || 'N/A', 3),
          row('Online Presence', Array.isArray(cl.onlinePresences) && cl.onlinePresences.length ? cl.onlinePresences.map((p: any) => `${p.platformName}: ${p.link}`).join(' | ') : 'N/A', 4),
          row('Product Details', cl.productDetails || 'N/A', 5),
          row('Product Photographs Provided', mapYesNo(cl.photosProvided), 6),
          row('Video Evidence Provided', mapYesNo(cl.videoProvided), 7),
          row('Invoice / Bill Available', mapYesNo(cl.invoiceAvailable), 8),
          row('Source Narrative (as shared by client)', cl.sourceNarrative || 'N/A', 9),
        ]
      )
    ));
  }

  // 4. Preliminary Verification — only if any verification done
  if (hasAnyDone([cl.verificationClientDiscussion, cl.verificationOsint, cl.verificationMarketplace, cl.verificationPretextCalling, cl.verificationProductReview])) {
    sections.push(sectionBlock(
      4, 'Preliminary Verification Conducted by True Buddy',
      buildVerificationTable([
        { activity: 'Case Discussion with Client Team', value: cl.verificationClientDiscussion, notes: cl.verificationClientDiscussionNotes || '' },
        { activity: 'Internet / OSINT Search', value: cl.verificationOsint, notes: cl.verificationOsintNotes || '' },
        { activity: 'Marketplace Verification (IndiaMART / Social Media)', value: cl.verificationMarketplace, notes: cl.verificationMarketplaceNotes || '' },
        { activity: 'Pretext Calling (if applicable)', value: cl.verificationPretextCalling, notes: cl.verificationPretextCallingNotes || '' },
        { activity: 'Preliminary Product Image Review', value: cl.verificationProductReview, notes: cl.verificationProductReviewNotes || '' },
      ])
    ));
  }

  // 5. Key Observations — only if any is YES
  const obsRows = [
    { label: 'Availability of Identifiable Target', value: cl.obsIdentifiableTarget },
    { label: 'Traceability of Entity / Contact', value: cl.obsTraceability },
    { label: 'Product Visibility / Market Presence', value: cl.obsProductVisibility },
    { label: 'Indications of Counterfeiting / Lookalike', value: cl.obsCounterfeitingIndications },
    { label: 'Evidentiary Gaps Identified', value: cl.obsEvidentiary_gaps },
    ...(cl.observationsCustomData || []).map((o: any) => ({ label: o.optionName || `Custom #${o.optionId}`, value: o.text })),
  ];
  if (hasAnyYes(obsRows.map(r => r.value))) {
    sections.push(sectionBlock(5, 'Key Observations', buildObservationTable(obsRows)));
  }

  // 6. Information Quality — only if any QA field filled
  if (hasValue(cl.qaCompleteness, cl.qaAccuracy, cl.qaIndependentInvestigation, cl.qaPriorConfrontation, cl.qaContaminationRisk)) {
    sections.push(sectionBlock(
      6, 'Information Quality Assessment',
      buildDataTable(
        ['56%', '44%'],
        ['Parameter', 'Assessment'],
        [
          row('Completeness of Initial Information', mapCompleteness(cl.qaCompleteness), 0),
          row('Accuracy of Case Description (prima facie)', mapAccuracy(cl.qaAccuracy), 1),
          row('Any Independent Client Investigation Conducted', mapYesNo(cl.qaIndependentInvestigation), 2),
          row('Any Prior Confrontation with Seller / Suspect', mapYesNo(cl.qaPriorConfrontation), 3),
          row('Risk of Information Contamination', mapRiskLevel(cl.qaContaminationRisk), 4),
        ]
      )
    ));
  }

  // 7. Assessment — only if overall assessment filled
  if (hasValue(cl.assessmentOverall)) {
    sections.push({
      stack: [
        sec(7, "True Buddy's Preliminary Assessment"),
        assessmentBlock('Overall Assessment of Lead', mapClientAssessment(cl.assessmentOverall), cl.assessmentRationale, 'Rationale'),
      ],
      unbreakable: true,
      marginTop: 14,
    });
  }

  // 8. Recommended Way Forward — only if any recommendation checked
  if (hasAnyChecked([cl.recMarketSurvey, cl.recCovertInvestigation, cl.recTestPurchase, cl.recEnforcementAction, cl.recAdditionalInfo, cl.recClosureHold]) || cl.recCustomIds?.length) {
    sections.push(sectionBlock(
      8, 'Recommended Way Forward',
      buildCheckedList([
        { label: 'Market Survey / Reconnaissance', checked: cl.recMarketSurvey },
        { label: 'Covert Investigation', checked: cl.recCovertInvestigation },
        { label: 'Evidential Test Purchase', checked: cl.recTestPurchase },
        { label: 'Direct Enforcement Action', checked: cl.recEnforcementAction },
        { label: 'Additional Information Required from Client', checked: cl.recAdditionalInfo },
        { label: 'Closure / Hold', checked: cl.recClosureHold },
      ]),
      ...(cl.recCustomIds?.length
        ? [{ text: `Additional Recommendations: ${cl.recCustomIds.join(', ')}`, fontSize: 9, color: C_TEXT, marginBottom: 10 }]
        : [])
    ));
  }

  // 9. Remarks — only if filled
  if (hasValue(cl.remarks)) {
    sections.push({
      stack: [
        sec(9, 'Remarks'),
        { text: cl.remarks, fontSize: 9.5, color: C_TEXT, marginBottom: 15 },
      ],
      marginTop: 14,
    });
  }

  // 10. Disclaimer — always present
  sections.push(buildNumberedDisclaimer(
    10,
    cl.customDisclaimer ||
    'This preliminary assessment is prepared solely on the basis of information provided by the client. True Buddy assumes the information to be complete and accurate at this stage. In the event that the information is found to be incomplete, inaccurate, or misleading during subsequent investigation or field deployment, additional costs towards team mobilisation and preliminary investigation shall be applicable as per the approved proposal. This document does not constitute a final investigative report or legal opinion.'
  ));

  return {
    pageSize: 'A4',
    pageMargins: [50, 48, 50, 48],
    defaultStyle: { font: 'Roboto', fontSize: 10, color: C_TEXT, lineHeight: 1.4 },
    styles: STYLES,
    content: sections.filter(Boolean),
  };
};

// ==========================================================================
//  TRUE BUDDY LEAD PDF
// ==========================================================================

const generateTrueBuddyLeadPDF = (data: PreReportPDFData): any => {
  const tb = data.trueBuddyLeadData!;
  const productNames = data.products?.map((p) => p.name).join(', ') || 'N/A';

  const sections: any[] = [
    ...buildCoverPage(data, productNames, '(Lead Generated Through True Buddy Intelligence Network)'),
    ...contentTitle(
      'PRELIMINARY LEAD ASSESSMENT REPORT',
      '(Lead Generated Through True Buddy Intelligence Network)',
      '[Confidential -- Client-Sanitised Version]'
    ),
  ];

  // 1. Client & Case Reference — always present
  sections.push(sectionBlock(
    1, 'Client & Case Reference',
    buildDataTable(
      ['44%', '56%'],
      ['Field', 'Details'],
      [
        row('Client Name', data.clientName, 0),
        row('Product Category', mapProductCategory(tb.productCategory), 1),
        row('Type of Infringement', mapInfringementType(tb.infringementType), 2),
        row('Date of Internal Lead Generation', tb.dateInternalLeadGeneration ? new Date(tb.dateInternalLeadGeneration).toLocaleDateString('en-IN') : 'N/A', 3),
        row('Broad Geography', tb.broadGeography || 'N/A', 4),
        row('Client SPOC', `${tb.clientSpocName || 'N/A'}${tb.clientSpocDesignation ? '  |  ' + tb.clientSpocDesignation : ''}`, 5),
        row('Nature of Entity', mapNatureOfEntity(tb.natureOfEntity), 6),
      ]
    )
  ));

  // 2. Mandate / Scope — only if any scope checked
  if (hasAnyChecked([tb.scopeIprSupplier, tb.scopeIprManufacturer, tb.scopeIprStockist, tb.scopeMarketVerification, tb.scopeEtp, tb.scopeEnforcement])) {
    sections.push(sectionBlock(
      2, 'Mandate / Scope Proposed',
      buildCheckedList([
        { label: 'IPR Investigation -- Supplier Level', checked: tb.scopeIprSupplier },
        { label: 'IPR Investigation -- Manufacturer / Packager', checked: tb.scopeIprManufacturer },
        { label: 'IPR Investigation -- Stockist / Warehouse', checked: tb.scopeIprStockist },
        { label: 'Covert Market Verification', checked: tb.scopeMarketVerification },
        { label: 'Evidential Test Purchase (ETP)', checked: tb.scopeEtp },
        { label: 'Enforcement Facilitation (If Applicable)', checked: tb.scopeEnforcement },
      ])
    ));
  }

  // 3. Lead Description — only if any field filled
  if (hasValue(tb.intelNature, tb.suspectedActivity, tb.productSegment, tb.supplyChainStage)) {
    sections.push(sectionBlock(
      3, 'High-Level Lead Description (Sanitised)',
      buildDataTable(
        ['46%', '54%'],
        ['Parameter', 'Description'],
        [
          row('Nature of Intelligence', mapIntelNature(tb.intelNature), 0),
          row('Type of Suspected Activity', mapSuspectedActivity(tb.suspectedActivity), 1),
          row('Product Segment', mapProductCategory(tb.productSegment), 2),
          row('Stage of Supply Chain', mapSupplyChainStage(tb.supplyChainStage), 3),
          row('Repeat Intelligence Indicator', mapYesNo(tb.repeatIntelligence), 4),
          row('Multi-Brand Exposure Risk', mapYesNo(tb.multiBrandRisk), 5),
        ]
      )
    ));
  }

  // 4. Preliminary Verification — only if any done
  if (hasAnyDone([tb.verificationIntelCorroboration, tb.verificationOsint, tb.verificationPatternMapping, tb.verificationJurisdiction, tb.verificationRiskAssessment])) {
    sections.push(sectionBlock(
      4, 'Preliminary Verification Conducted by True Buddy',
      buildVerificationTable([
        { activity: 'Internal Intelligence Corroboration', value: tb.verificationIntelCorroboration, notes: tb.verificationIntelCorroborationNotes || '' },
        { activity: 'OSINT / Market Footprint Review', value: tb.verificationOsint, notes: tb.verificationOsintNotes || '' },
        { activity: 'Pattern Mapping (Similar Past Cases)', value: tb.verificationPatternMapping, notes: tb.verificationPatternMappingNotes || '' },
        { activity: 'Jurisdiction Feasibility Review', value: tb.verificationJurisdiction, notes: tb.verificationJurisdictionNotes || '' },
        { activity: 'Risk & Sensitivity Assessment', value: tb.verificationRiskAssessment, notes: tb.verificationRiskAssessmentNotes || '' },
      ])
    ));
  }

  // 5. Key Observations — only if any YES
  const tbObsRows = [
    { label: 'Scale of Suspected Operations', value: tb.obsOperationScale },
    { label: 'Likelihood of Counterfeit Activity', value: tb.obsCounterfeitLikelihood },
    { label: 'Potential Brand Exposure', value: tb.obsBrandExposure },
    { label: 'Enforcement Sensitivity (Political / Local)', value: tb.obsEnforcementSensitivity },
    { label: 'Risk of Information Leakage', value: tb.obsLeakageRisk },
    ...(tb.observationsCustomData || []).map((o: any) => ({ label: o.optionName || `Custom #${o.optionId}`, value: o.text })),
  ];
  if (hasAnyYes(tbObsRows.map(r => r.value))) {
    sections.push(sectionBlock(5, 'Key Observations (Client-Safe)', buildObservationTable(tbObsRows)));
  }

  // 6. Integrity & Risk — only if any field filled
  if (hasValue(tb.riskSourceReliability, tb.riskClientConflict, tb.riskImmediateAction, tb.riskControlledValidation, tb.riskPrematureDisclosure)) {
    sections.push(sectionBlock(
      6, 'Information Integrity & Risk Assessment',
      buildDataTable(
        ['56%', '44%'],
        ['Parameter', 'Assessment'],
        [
          row('Source Reliability (Internal Assessment)', mapSourceReliability(tb.riskSourceReliability), 0),
          row('Risk of Cross-Client Conflict', mapRiskLevel(tb.riskClientConflict), 1),
          row('Suitability for Immediate Action', mapYesNo(tb.riskImmediateAction), 2),
          row('Requirement for Controlled Validation', mapYesNo(tb.riskControlledValidation), 3),
          row('Risk of Premature Disclosure', mapRiskLevel(tb.riskPrematureDisclosure), 4),
        ]
      )
    ));
  }

  // 7. Assessment — only if filled
  if (hasValue(tb.assessmentOverall)) {
    sections.push({
      stack: [
        sec(7, "True Buddy's Preliminary Assessment"),
        assessmentBlock('Overall Assessment of Lead', mapTrueBuddyAssessment(tb.assessmentOverall), tb.assessmentRationale, 'Assessment Rationale'),
      ],
      unbreakable: true,
      marginTop: 14,
    });
  }

  // 8. Recommended Way Forward — only if any checked
  if (hasAnyChecked([tb.recCovertValidation, tb.recEtp, tb.recMarketReconnaissance, tb.recEnforcementDeferred, tb.recContinuedMonitoring, tb.recClientSegregation])) {
    sections.push(sectionBlock(
      8, 'Recommended Way Forward',
      buildCheckedList([
        { label: 'Covert Intelligence Validation', checked: tb.recCovertValidation },
        { label: 'Evidential Test Purchase (ETP)', checked: tb.recEtp },
        { label: 'Controlled Market Reconnaissance', checked: tb.recMarketReconnaissance },
        { label: 'Enforcement Planning (Deferred)', checked: tb.recEnforcementDeferred },
        { label: 'Continued Monitoring', checked: tb.recContinuedMonitoring },
        { label: 'Client-Specific Segregation Required', checked: tb.recClientSegregation },
      ])
    ));
  }

  // 9. Confidentiality Note — only if filled
  if (hasValue(tb.confidentialityNote)) {
    sections.push({
      stack: [
        sec(9, 'Confidentiality & Ring-Fencing Note'),
        { text: tb.confidentialityNote, fontSize: 9.5, alignment: 'justify', color: C_TEXT, marginBottom: 15 },
      ],
      marginTop: 14,
    });
  }

  // 10. Remarks — only if filled
  if (hasValue(tb.remarks)) {
    sections.push({
      stack: [
        sec(10, 'Remarks'),
        { text: tb.remarks, fontSize: 9.5, color: C_TEXT, marginBottom: 15 },
      ],
      marginTop: 14,
    });
  }

  // 11. Disclaimer — always present
  sections.push(buildNumberedDisclaimer(
    11,
    tb.customDisclaimer ||
    'This preliminary assessment is based on internally generated intelligence and limited non-intrusive verification. Specific source details, identities, and methods have been deliberately withheld to preserve confidentiality and prevent information contamination. This document does not constitute a final investigative report or confirmation of infringement. Any further action will be undertaken only upon written client approval and under a client-specific scope of work.'
  ));

  return {
    pageSize: 'A4',
    pageMargins: [50, 48, 50, 48],
    defaultStyle: { font: 'Roboto', fontSize: 10, color: C_TEXT, lineHeight: 1.4 },
    styles: STYLES,
    content: sections.filter(Boolean),
  };
};

// ==========================================================================
//  PUBLIC EXPORTS
// ==========================================================================

export const getPreReportDocDefinition = (data: PreReportPDFData) =>
  data.leadType === 'CLIENT_LEAD'
    ? generateClientLeadPDF(data)
    : generateTrueBuddyLeadPDF(data);

export const openPreReportInNewTab = (data: PreReportPDFData) => {
  try {
    pdfMake.createPdf(getPreReportDocDefinition(data)).open();
    return { success: true };
  } catch (error) {
    console.error('PDF Preview Error:', error);
    throw new Error('Failed to open PDF preview. Please try again.');
  }
};

export const exportPreReportToPDF = async (data: PreReportPDFData) => {
  try {
    const fileName = `PreReport_${data.reportId}_${Date.now()}.pdf`;
    pdfMake.createPdf(getPreReportDocDefinition(data)).download(fileName);
    return { success: true };
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};
