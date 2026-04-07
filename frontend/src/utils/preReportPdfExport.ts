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

const C_NAVY     = '#0f2340';
const C_NAVY_MID = '#1a3a5c';
const C_GOLD     = '#c8972b';
const C_HDR_BG   = '#e8eef5';
const C_ROW_ALT  = '#f4f7fb';
const C_BORDER   = '#b8c8d8';
const C_TEXT     = '#000000';
const C_MUTED    = '#4a5568';
const C_WHITE    = '#ffffff';

const buildCustomOptionsMap = (
  options?: Array<{ id: number; optionName: string }>
): Map<number, string> => {
  const map = new Map<number, string>();
  (options || []).forEach(opt => map.set(opt.id, opt.optionName));
  return map;
};

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
  paddingLeft:  () => 9,
  paddingRight: () => 9,
  paddingTop:   () => 6,
  paddingBottom:() => 6,
  dontBreakRows: true,
};

const STYLES: any = {
  sectionHeader: { fontSize: 11, bold: true, marginTop: 14, marginBottom: 6 },
  tableHeader:   { fontSize: 9,  bold: true, fillColor: C_HDR_BG, color: C_NAVY },
  bodyText:      { fontSize: 10, color: C_TEXT },
};

export interface PreReportPDFData {
  reportId:    string;
  clientName:  string;
  leadType:    'CLIENT_LEAD' | 'TRUE_BUDDY_LEAD';
  createdAt:   string;
  updatedAt:   string;
  products?:   Array<{ name: string; category: string; status: string }>;
  clientLeadData?:    ClientLeadData;
  trueBuddyLeadData?: TrueBuddyLeadData;
  customOptions?: Array<{ id: number; optionName: string; optionDescription?: string }>;
}

const toTitleCase = (value: string): string => {
  if (!value) return 'N/A';
  return value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const hasValue = (...vals: any[]) => vals.some(v => {
  if (v === null || v === undefined || v === '') return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.keys(v).length > 0;
  return true;
});

const hasAnyChecked = (vals: any[]) => vals.some(Boolean);
const hasAnyDone    = (vals: any[]) => vals.some(v => !!v && String(v).toUpperCase() === 'DONE');

const mapYesNo = (v: any): string =>
  !v ? 'N/A' : String(v).toUpperCase() === 'YES' ? 'Yes' : 'No';

const isVerificationDone = (v: any): boolean =>
  !!v && String(v).toUpperCase() === 'DONE';

const mapCompleteness = (v: any): string => {
  if (!v) return 'N/A';
  const s = String(v).toUpperCase();
  if (s === 'COMPLETED')           return 'Completed';
  if (s === 'PARTIALLY_COMPLETED') return 'Partially Completed';
  if (s === 'INCOMPLETED')         return 'Incompleted';
  return toTitleCase(v);
};

const mapAccuracy = (v: any): string => {
  if (!v) return 'N/A';
  const s = String(v).toUpperCase();
  if (s === 'ACCURATE')   return 'Accurate';
  if (s === 'INACCURATE') return 'Inaccurate';
  if (s === 'UNCERTAIN')  return 'Uncertain';
  return toTitleCase(v);
};

const mapRiskLevel = (v: any): string => {
  if (!v) return 'N/A';
  const s = String(v).toUpperCase();
  if (s === 'LOW')    return 'Low';
  if (s === 'MEDIUM') return 'Medium';
  if (s === 'HIGH')   return 'High';
  return toTitleCase(v);
};

const mapAssessment = (v: any): string => {
  if (!v) return 'N/A';
  const s = String(v).toUpperCase();
  if (s === 'ACTIONABLE')                  return 'Actionable';
  if (s === 'NOT_ACTIONABLE')              return 'Not Actionable';
  if (s === 'ACTIONABLE_AFTER_VALIDATION') return 'Actionable After Validation';
  if (s === 'HOLD')                        return 'Hold';
  return toTitleCase(v);
};

const mapProductCategory   = (v: any, customText?: string): string => {
  if (!v && !customText) return 'N/A';
  if (String(v).toUpperCase() === 'CUSTOM') return customText || 'Custom';
  return toTitleCase(v || customText);
};
const mapInfringementType  = (v: any, customText?: string): string => {
  if (!v && !customText) return 'N/A';
  if (String(v).toUpperCase() === 'CUSTOM') return customText || 'Custom';
  return toTitleCase(v || customText);
};
const mapNatureOfEntity    = (v: any, customText?: string): string => {
  if (!v && !customText) return 'N/A';
  if (String(v).toUpperCase() === 'CUSTOM') return customText || 'Custom';
  return toTitleCase(v || customText);
};
const mapIntelNature       = (v: any, customText?: string): string => {
  if (!v && !customText) return 'N/A';
  if (String(v).toUpperCase() === 'CUSTOM') return customText || 'Custom';
  return toTitleCase(v || customText);
};
const mapSuspectedActivity = (v: any, customText?: string): string => {
  if (!v && !customText) return 'N/A';
  if (String(v).toUpperCase() === 'CUSTOM') return customText || 'Custom';
  return toTitleCase(v || customText);
};
const mapBrandExposure     = (v: any, customText?: string): string => {
  if (!v && !customText) return 'N/A';
  if (String(v).toUpperCase() === 'CUSTOM') return customText || 'Custom';
  return toTitleCase(v || customText);
};

const row = (label: string, value: string, index = 0) => [
  { text: label,        bold: true, fontSize: 9, color: C_NAVY, fillColor: index % 2 === 0 ? C_WHITE : C_ROW_ALT },
  { text: value || 'N/A',           fontSize: 9, color: C_TEXT, fillColor: index % 2 === 0 ? C_WHITE : C_ROW_ALT },
];

const verRow = (activity: string, value: any, notes: string, index = 0) => {
  const done = isVerificationDone(value);
  return [
    { text: activity,                   fontSize: 9,   color: C_TEXT,                  fillColor: index % 2 === 0 ? C_WHITE : C_ROW_ALT },
    { text: done ? 'DONE' : 'PENDING',  fontSize: 8.5, bold: true, alignment: 'center' as const, color: done ? C_NAVY : C_MUTED, fillColor: done ? C_HDR_BG : C_WHITE },
    { text: notes || '-',               fontSize: 9,   color: C_TEXT,                  fillColor: index % 2 === 0 ? C_WHITE : C_ROW_ALT },
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
          { text: 'Activity',  ...STYLES.tableHeader },
          { text: 'Status',    ...STYLES.tableHeader, alignment: 'center' },
          { text: 'Key Notes', ...STYLES.tableHeader },
        ],
        ...done.map((r, i) => verRow(r.activity, r.value, r.notes, i)),
      ],
    },
    layout: STANDARD_LAYOUT,
    marginBottom: 12,
  };
};

const buildBulletTextList = (items: string[]) => {
  const filtered = items.filter(Boolean);
  if (!filtered.length) return null;
  return {
    ul: filtered.map(item => ({ text: item, fontSize: 9, color: C_TEXT })),
    margin: [10, 0, 0, 12],
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

const sec = (n: number, title: string) => ({
  table: {
    widths: [28, '*'],
    body: [[
      { text: String(n), fontSize: 10, bold: true, color: C_WHITE, fillColor: C_GOLD, alignment: 'center' as const },
      { text: title,     fontSize: 11, bold: true, color: C_WHITE, fillColor: C_NAVY },
    ]],
  },
  layout: {
    hLineWidth: (i: number, node: any) => i === 0 || i === node.table.body.length ? 2 : 0,
    vLineWidth: (i: number, node: any) => i === 0 || i === node.table.widths.length ? 2 : 0,
    hLineColor: () => C_GOLD,
    vLineColor: () => C_GOLD,
    paddingLeft:  (i: number) => i === 0 ? 0 : 10,
    paddingRight: (i: number) => i === 0 ? 0 : 6,
    paddingTop:   () => 6,
    paddingBottom:() => 6,
  },
  marginBottom: 7,
});

const sectionBlock = (n: number, title: string, ...contentItems: any[]): any | null => {
  const filtered = contentItems.filter(Boolean);
  if (!filtered.length) return null;
  return { stack: [sec(n, title), ...filtered], marginTop: 14 };
};

const assessmentBlock = (
  label: string, mappedValue: string, rationale: string | undefined, rationaleLabel: string
) => ({
  stack: [
    {
      table: {
        widths: ['*'],
        body: [[{
          text: [
            { text: `${label}:   `, bold: true, fontSize: 10, color: C_NAVY },
            { text: mappedValue,   bold: true, fontSize: 10, color: C_TEXT },
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
    ...(rationale ? [
      { text: `${rationaleLabel}:`, bold: true, fontSize: 9.5, color: C_NAVY, marginBottom: 4 },
      { text: rationale, fontSize: 9.5, color: C_TEXT, marginBottom: 15 },
    ] : []),
  ],
});

const contentTitle = (line1: string, line2: string, line3?: string): any[] => [
  { text: line1, fontSize: 14, bold: true, alignment: 'center', color: C_NAVY, marginBottom: 4 },
  { canvas: [{ type: 'line', x1: 100, y1: 0, x2: 395, y2: 0, lineWidth: 1, lineColor: C_GOLD }], marginBottom: 6 },
  { text: line2, fontSize: 9.5, italics: true, alignment: 'center', color: C_MUTED, marginBottom: line3 ? 3 : 20 },
  ...(line3 ? [{ text: line3, fontSize: 9.5, bold: true, alignment: 'center', color: C_NAVY, marginBottom: 20 }] : []),
];

const buildNumberedDisclaimer = (n: number, text: string | undefined) => ({
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
          { text: 'CLIENT',         bold: true, fontSize: 8.5, color: C_WHITE, fillColor: C_NAVY,     margin: [10, 8, 8, 8] },
          { text: data.clientName,  fontSize: 10, bold: true,  color: C_NAVY,  fillColor: C_WHITE,    margin: [10, 8, 8, 8] },
        ],
        [
          { text: 'PRODUCT(S)',     bold: true, fontSize: 8.5, color: C_WHITE, fillColor: C_NAVY_MID, margin: [10, 8, 8, 8] },
          { text: productNames,     fontSize: 9,               color: C_TEXT,  fillColor: C_ROW_ALT,  margin: [10, 8, 8, 8] },
        ],
        [
          { text: 'REPORT ID',      bold: true, fontSize: 8.5, color: C_WHITE, fillColor: C_NAVY,     margin: [10, 8, 8, 8] },
          { text: data.reportId,    fontSize: 9,               color: C_TEXT,  fillColor: C_WHITE,    margin: [10, 8, 8, 8] },
        ],
        [
          { text: 'LEAD TYPE',      bold: true, fontSize: 8.5, color: C_WHITE, fillColor: C_NAVY_MID, margin: [10, 8, 8, 8] },
          { text: data.leadType === 'CLIENT_LEAD' ? 'Client Lead' : 'True Buddy Lead', fontSize: 9, color: C_TEXT, fillColor: C_ROW_ALT, margin: [10, 8, 8, 8] },
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

// ============================================================
// ✅ CLIENT LEAD — all four sections fixed
// ============================================================
const generateClientLeadPDF = (data: PreReportPDFData): any => {
  const cl = data.clientLeadData!;
  const productNames = data.products?.map((p) => p.name).join(', ') || 'N/A';
  const customOptMap = buildCustomOptionsMap(data.customOptions);

  const sections: any[] = [
    ...buildCoverPage(data, productNames, '(Based on Client-Provided Information)'),
    ...contentTitle('PRELIMINARY LEAD ASSESSMENT REPORT', '(Based on Client-Provided Information)'),
  ];

  let sectionNumber = 1;

  // ── Section 1: Client & Case Details ─────────────────────────────────────
  sections.push(sectionBlock(
    sectionNumber++, 'Client & Case Details',
    buildDataTable(
      ['44%', '56%'],
      ['Field', 'Details'],
      [
        row('Name of Client',                  data.clientName, 0),
        row('Product(s) Involved',             productNames, 1),
        row('Date Information Received',       cl.dateInfoReceived ? new Date(cl.dateInfoReceived).toLocaleDateString('en-IN') : 'N/A', 2),
        row('Location (State / District / City)', [cl.state, cl.city].filter(Boolean).join(', ') || 'N/A', 3),
      ]
    )
  ));

  // ── Section 2: Mandate / Scope ────────────────────────────────────────────
  // ✅ FIX — custom scope items resolved by name and merged into the SAME list
  const customScopeItems = (cl.scopeCustomIds || []).map(id => ({
    label:   customOptMap.get(Number(id)) || `Custom Option #${id}`,
    checked: true as const,
  }));

  if (
    hasAnyChecked([
      cl.scopeDueDiligence, cl.scopeIprRetailer, cl.scopeIprSupplier,
      cl.scopeIprManufacturer, cl.scopeOnlinePurchase, cl.scopeOfflinePurchase,
    ]) || customScopeItems.length
  ) {
    sections.push(sectionBlock(
      sectionNumber++, 'Mandate / Scope Requested',
      buildCheckedList([
        { label: 'Due Diligence',                                           checked: cl.scopeDueDiligence },
        { label: 'IPR Retailer / Wholesaler',              checked: cl.scopeIprRetailer },
        { label: 'IPR Supplier',                           checked: cl.scopeIprSupplier },
        { label: 'IPR Manufacturer / Packager / Warehouse',checked: cl.scopeIprManufacturer },
        { label: 'Online Sample Purchase',                                  checked: cl.scopeOnlinePurchase },
        { label: 'Offline Sample Purchase',                                 checked: cl.scopeOfflinePurchase },
        ...customScopeItems,  // ✅ appended inline — same table, name resolved
      ])
    ));
  }

  // ── Section 3: Information Received from Client ───────────────────────────
  if (hasValue(
    cl.entityName, cl.suspectName, cl.contactNumbers, cl.addressLine1, cl.addressLine2,
    cl.city, cl.state, cl.pincode, cl.onlinePresences, cl.productDetails,
    cl.photosProvided, cl.videoProvided, cl.invoiceAvailable, cl.sourceNarrative
  )) {
    sections.push(sectionBlock(
      sectionNumber++, 'Information Received from Client',
      buildDataTable(
        ['50%', '50%'],
        ['Parameter', 'Details'],
        [
          row('Name of Entity',                          cl.entityName || 'N/A', 0),
          row('Name of Suspect (if different)',          cl.suspectName || 'N/A', 1),
          row('Contact Number(s)',                       cl.contactNumbers || 'N/A', 2),
          row('Address / Location',                      [cl.addressLine1, cl.addressLine2, cl.city, cl.state, cl.pincode].filter(Boolean).join(', ') || 'N/A', 3),
          row('Online Presence',                         Array.isArray(cl.onlinePresences) && cl.onlinePresences.length ? cl.onlinePresences.map((p: any) => `${p.platformName}: ${p.link}`).join(' | ') : 'N/A', 4),
          row('Product Details',                         cl.productDetails || 'N/A', 5),
          row('Product Photographs Provided',            mapYesNo(cl.photosProvided), 6),
          row('Video Evidence Provided',                 mapYesNo(cl.videoProvided), 7),
          row('Invoice / Bill Available',                mapYesNo(cl.invoiceAvailable), 8),
          row('Source Narrative (as shared by client)',  cl.sourceNarrative || 'N/A', 9),
        ]
      )
    ));
  }

  // ── Section 4: Preliminary Verification ──────────────────────────────────
  // ✅ FIX — custom verification rows resolved by name and merged into the SAME table
  const customVerificationRows = (cl.verificationCustomData || []).map((item: any) => ({
    activity: customOptMap.get(Number(item.optionId)) || `Custom Verification #${item.optionId}`,
    value:    item.status,
    notes:    item.notes || '',
  }));

  const allVerificationRows = [
    { activity: 'Case Discussion with Client Team',                    value: cl.verificationClientDiscussion, notes: cl.verificationClientDiscussionNotes || '' },
    { activity: 'Internet / OSINT Search',                             value: cl.verificationOsint,            notes: cl.verificationOsintNotes || '' },
    { activity: 'Marketplace Verification (IndiaMART / Social Media)', value: cl.verificationMarketplace,      notes: cl.verificationMarketplaceNotes || '' },
    { activity: 'Pretext Calling (if applicable)',                     value: cl.verificationPretextCalling,   notes: cl.verificationPretextCallingNotes || '' },
    { activity: 'Preliminary Product Image Review',                    value: cl.verificationProductReview,    notes: cl.verificationProductReviewNotes || '' },
    ...customVerificationRows,  // ✅ appended inline — same table, name resolved
  ];

  // ✅ hasAnyDone now covers custom rows too
  if (hasAnyDone(allVerificationRows.map(r => r.value))) {
    sections.push(sectionBlock(
      sectionNumber++, 'Preliminary Verification Conducted by True Buddy',
      buildVerificationTable(allVerificationRows)
    ));
  }

  // ── Section 5: Key Observations ──────────────────────────────────────────
  // ✅ FIX — custom obs names resolved from customOptMap (requires call site to pass all options)
  if (hasValue(
    cl.obsIdentifiableTarget, cl.obsTraceability, cl.obsProductVisibility,
    cl.obsCounterfeitingIndications, cl.obsEvidentiary_gaps, cl.observationsCustomData
  )) {
    const obsItems = [
      cl.obsIdentifiableTarget      && `Availability of Identifiable Target: ${cl.obsIdentifiableTarget}`,
      cl.obsTraceability            && `Traceability of Entity / Contact: ${cl.obsTraceability}`,
      cl.obsProductVisibility       && `Product Visibility / Market Presence: ${cl.obsProductVisibility}`,
      cl.obsCounterfeitingIndications && `Indications of Counterfeiting / Lookalike: ${cl.obsCounterfeitingIndications}`,
      cl.obsEvidentiary_gaps        && `Evidentiary Gaps Identified: ${cl.obsEvidentiary_gaps}`,
      ...((cl.observationsCustomData || []).map((o: any) => {
        // ✅ name resolved — shows actual option name, not "Custom Option #X"
        const name = customOptMap.get(Number(o.optionId)) || `Custom Option #${o.optionId}`;
        return o.text ? `${name}: ${o.text}` : name;
      })),
    ].filter(Boolean) as string[];

    sections.push(sectionBlock(sectionNumber++, 'Key Observations', buildBulletTextList(obsItems)));
  }

  // ── Section 6: Information Quality Assessment ────────────────────────────
  if (hasValue(cl.qaCompleteness, cl.qaAccuracy, cl.qaIndependentInvestigation, cl.qaPriorConfrontation, cl.qaContaminationRisk)) {
    sections.push(sectionBlock(
      sectionNumber++, 'Information Quality Assessment',
      buildDataTable(
        ['56%', '44%'],
        ['Parameter', 'Assessment'],
        [
          row('Completeness of Initial Information',              mapCompleteness(cl.qaCompleteness), 0),
          row('Accuracy of Case Description (prima facie)',       mapAccuracy(cl.qaAccuracy), 1),
          row('Any Independent Client Investigation Conducted',   mapYesNo(cl.qaIndependentInvestigation), 2),
          row('Any Prior Confrontation with Seller / Suspect',    mapYesNo(cl.qaPriorConfrontation), 3),
          row('Risk of Information Contamination',                mapRiskLevel(cl.qaContaminationRisk), 4),
        ]
      )
    ));
  }

  // ── Section 7: Preliminary Assessment ────────────────────────────────────
  if (hasValue(cl.assessmentOverall, cl.assessmentRationale)) {
    sections.push({
      stack: [
        sec(sectionNumber++, "True Buddy's Preliminary Assessment"),
        assessmentBlock('Overall Assessment of Lead', mapAssessment(cl.assessmentOverall), cl.assessmentRationale, 'Rationale'),
      ],
      marginTop: 14,
    });
  }

  // ── Section 8: Recommended Way Forward ───────────────────────────────────
  // ✅ FIX — custom rec items resolved by name and merged into the SAME list
  const customRecItems = (cl.recCustomIds || []).map(id => ({
    label:   customOptMap.get(Number(id)) || `Custom Option #${id}`,
    checked: true as const,
  }));

  if (
    hasAnyChecked([
      cl.recMarketSurvey, cl.recCovertInvestigation, cl.recTestPurchase,
      cl.recEnforcementAction, cl.recAdditionalInfo, cl.recClosureHold,
    ]) || customRecItems.length
  ) {
    sections.push(sectionBlock(
      sectionNumber++, 'Recommended Way Forward',
      buildCheckedList([
        { label: 'Market Survey',                  checked: cl.recMarketSurvey },
        { label: 'Covert Investigation',                            checked: cl.recCovertInvestigation },
        { label: 'Test Purchase',                        checked: cl.recTestPurchase },
        { label: 'Enforcement Action',                       checked: cl.recEnforcementAction },
        { label: 'Additional Information Required',     checked: cl.recAdditionalInfo },
        { label: 'Closure / Hold',                                  checked: cl.recClosureHold },
        ...customRecItems,  // ✅ appended inline — same table, name resolved
      ])
    ));
  }

  // ── Remarks ───────────────────────────────────────────────────────────────
  if (hasValue(cl.remarks)) {
    sections.push({
      stack: [
        sec(sectionNumber++, 'Remarks'),
        { text: cl.remarks, fontSize: 9.5, color: C_TEXT, marginBottom: 15 },
      ],
      marginTop: 14,
    });
  }

  // ── Disclaimer ────────────────────────────────────────────────────────────
  if (hasValue(cl.customDisclaimer)) {
    sections.push(buildNumberedDisclaimer(sectionNumber++, cl.customDisclaimer));
  }

  return {
    pageSize: 'A4',
    pageMargins: [50, 48, 50, 48],
    defaultStyle: { font: 'Roboto', fontSize: 10, color: C_TEXT, lineHeight: 1.4 },
    styles: STYLES,
    content: sections.filter(Boolean),
  };
};

// ── True Buddy Lead — UNCHANGED ───────────────────────────────────────────
const generateTrueBuddyLeadPDF = (data: PreReportPDFData): any => {
  const tb = data.trueBuddyLeadData!;
  const productNames = data.products?.map((p) => p.name).join(', ') || 'N/A';
  const customOptMap = buildCustomOptionsMap(data.customOptions);

  const sections: any[] = [
    ...buildCoverPage(data, productNames, '(Lead Generated Through True Buddy Intelligence Network)'),
    ...contentTitle(
      'PRELIMINARY LEAD ASSESSMENT REPORT',
      '(Lead Generated Through True Buddy Intelligence Network)',
      '[Confidential -- Client-Sanitised Version]'
    ),
  ];

  let sectionNumber = 1;

  sections.push(sectionBlock(
    sectionNumber++, 'Client & Case Reference',
    buildDataTable(
      ['44%', '56%'],
      ['Field', 'Details'],
      [
        row('Client Name',                       data.clientName, 0),
        row('Product Category',                  mapProductCategory(tb.productCategory, tb.productCategoryCustomText), 1),
        row('Type of Infringement',              mapInfringementType(tb.infringementType, tb.infringementTypeCustomText), 2),
        row('Date of Internal Lead Generation',  tb.dateInternalLeadGeneration ? new Date(tb.dateInternalLeadGeneration).toLocaleDateString('en-IN') : 'N/A', 3),
        row('Broad Geography',                   tb.broadGeography || 'N/A', 4),
        row('Reason of Suspicion',               Array.isArray(tb.reasonOfSuspicion) && tb.reasonOfSuspicion.length
          ? tb.reasonOfSuspicion.filter((x: string) => x.toUpperCase() !== 'CUSTOM').map((x: string) => toTitleCase(x)).join(', ') || 'N/A'
          : 'N/A', 5),
        row('Reason of Suspicion (Custom)',      tb.reasonOfSuspicionCustomText || 'N/A', 6),
        row('Expected Seizure',                  tb.expectedSeizure || 'N/A', 7),
        row('Nature of Entity',                  mapNatureOfEntity(tb.natureOfEntity, tb.natureOfEntityCustomText), 8),
      ]
    )
  ));

  sections.push(sectionBlock(
    sectionNumber++, 'Mandate / Scope Proposed',
    buildCheckedList([
      { label: 'IPR Investigation -- Supplier Level',          checked: tb.scopeIprSupplier },
      { label: 'IPR Investigation -- Manufacturer / Packager', checked: tb.scopeIprManufacturer },
      { label: 'IPR Investigation -- Stockist / Warehouse',    checked: tb.scopeIprStockist },
      { label: 'Covert Market Verification',                   checked: tb.scopeMarketVerification },
      { label: 'Evidential Test Purchase (ETP)',               checked: tb.scopeEtp },
      { label: 'Enforcement Facilitation (If Applicable)',     checked: tb.scopeEnforcement },
      ...(tb.scopeCustomIds || []).map(id => ({
        label: customOptMap.get(Number(id)) || `Custom Option #${id}`,
        checked: true,
      })),
    ])
  ));

  if (hasValue(tb.intelNature, tb.intelNatureCustomText, tb.suspectedActivity, tb.suspectedActivityCustomText, tb.productSegment, tb.productSegmentCustomText, tb.repeatIntelligence, tb.multiBrandRisk)) {
    sections.push(sectionBlock(
      sectionNumber++, 'High-Level Lead Description (Sanitised)',
      buildDataTable(
        ['46%', '54%'],
        ['Parameter', 'Description'],
        [
          row('Nature of Intelligence',         mapIntelNature(tb.intelNature, tb.intelNatureCustomText), 0),
          row('Type of Suspected Activity',     mapSuspectedActivity(tb.suspectedActivity, tb.suspectedActivityCustomText), 1),
          row('Product Segment',                mapProductCategory(tb.productSegment, tb.productSegmentCustomText), 2),
          row('Repeat Intelligence Indicator',  mapYesNo(tb.repeatIntelligence), 3),
          row('Multi-Brand Exposure Risk',      mapYesNo(tb.multiBrandRisk), 4),
        ]
      )
    ));
  }

  if (hasAnyDone([tb.verificationIntelCorroboration, tb.verificationOsint, tb.verificationPatternMapping, tb.verificationJurisdiction, tb.verificationRiskAssessment])) {
    sections.push(sectionBlock(
      sectionNumber++, 'Preliminary Verification Conducted by True Buddy',
      buildVerificationTable([
        { activity: 'Internal Intelligence Corroboration',    value: tb.verificationIntelCorroboration, notes: tb.verificationIntelCorroborationNotes || '' },
        { activity: 'OSINT / Market Footprint Review',        value: tb.verificationOsint,              notes: tb.verificationOsintNotes || '' },
        { activity: 'Pattern Mapping (Similar Past Cases)',   value: tb.verificationPatternMapping,     notes: tb.verificationPatternMappingNotes || '' },
        { activity: 'Jurisdiction Feasibility Review',        value: tb.verificationJurisdiction,       notes: tb.verificationJurisdictionNotes || '' },
        { activity: 'Risk & Sensitivity Assessment',          value: tb.verificationRiskAssessment,     notes: tb.verificationRiskAssessmentNotes || '' },
      ])
    ));
  }

  if (hasValue(tb.obsOperationScale, tb.obsCounterfeitLikelihood, tb.obsBrandExposure, tb.obsBrandExposureCustomText, tb.obsEnforcementSensitivity, tb.observationsCustomData)) {
    const obsItems = [
      tb.obsOperationScale         && `Scale of Suspected Operations: ${toTitleCase(tb.obsOperationScale)}`,
      tb.obsCounterfeitLikelihood  && `Likelihood of Counterfeit Activity: ${mapRiskLevel(tb.obsCounterfeitLikelihood)}`,
      tb.obsBrandExposure          && `Potential Brand Exposure: ${mapBrandExposure(tb.obsBrandExposure, tb.obsBrandExposureCustomText)}`,
      tb.obsEnforcementSensitivity && `Enforcement Sensitivity (Political / Local): ${mapRiskLevel(tb.obsEnforcementSensitivity)}`,
      ...((tb.observationsCustomData || []).map((o: any) => {
        const name = customOptMap.get(Number(o.optionId)) || `Custom Option #${o.optionId}`;
        return o.text ? `${name}: ${o.text}` : name;
      })),
    ].filter(Boolean) as string[];
    sections.push(sectionBlock(sectionNumber++, 'Key Observations (Client-Safe)', buildBulletTextList(obsItems)));
  }

  if (hasValue(tb.riskSourceReliability, tb.riskClientConflict, tb.riskImmediateAction, tb.riskControlledValidation, tb.riskCustomData)) {
    sections.push(sectionBlock(
      sectionNumber++, 'Information Integrity & Risk Assessment',
      buildDataTable(
        ['56%', '44%'],
        ['Parameter', 'Assessment'],
        [
          row('Source Reliability (Internal Assessment)', mapRiskLevel(tb.riskSourceReliability), 0),
          row('Risk of Cross-Client Conflict',            mapRiskLevel(tb.riskClientConflict), 1),
          row('Suitability for Immediate Action',         mapYesNo(tb.riskImmediateAction), 2),
          row('Requirement for Controlled Validation',    mapYesNo(tb.riskControlledValidation), 3),
          row('Custom Risk Inputs',                       Array.isArray(tb.riskCustomData) && tb.riskCustomData.length
            ? tb.riskCustomData.map((r: any) => {
              const name = customOptMap.get(Number(r.optionId)) || `Custom Option #${r.optionId}`;
              return r.value ? `${name}: ${r.value}` : name;
            }).join(', ')
            : 'N/A', 4),
        ]
      )
    ));
  }

  if (hasValue(tb.assessmentOverall, tb.assessmentRationale)) {
    sections.push({
      stack: [
        sec(sectionNumber++, "True Buddy's Preliminary Assessment"),
        assessmentBlock('Overall Assessment of Lead', mapAssessment(tb.assessmentOverall), tb.assessmentRationale, 'Assessment Rationale'),
      ],
      marginTop: 14,
    });
  }

  if (hasAnyChecked([tb.recCovertValidation, tb.recEtp, tb.recMarketReconnaissance, tb.recEnforcementDeferred, tb.recContinuedMonitoring, tb.recClientSegregation]) || tb.recCustomIds?.length) {
    sections.push(sectionBlock(
      sectionNumber++, 'Recommended Way Forward',
      buildCheckedList([
        { label: 'Covert Validation',            checked: tb.recCovertValidation },
        { label: 'ETP (Evidence Test Purchase)',            checked: tb.recEtp },
        { label: 'Market Reconnaissance',          checked: tb.recMarketReconnaissance },
        { label: 'Enforcement Planning',           checked: tb.recEnforcementDeferred },
        { label: 'Continued Monitoring',                      checked: tb.recContinuedMonitoring },
        { label: 'Client Segregation',      checked: tb.recClientSegregation },
        ...(tb.recCustomIds || []).map(id => ({
          label: customOptMap.get(Number(id)) || `Custom Option #${id}`,
          checked: true,
        })),
      ])
    ));
  }

  if (hasValue(tb.remarks)) {
    sections.push({
      stack: [
        sec(sectionNumber++, 'Remarks'),
        { text: tb.remarks, fontSize: 9.5, color: C_TEXT, marginBottom: 15 },
      ],
      marginTop: 14,
    });
  }

  if (hasValue(tb.customDisclaimer)) {
    sections.push(buildNumberedDisclaimer(sectionNumber++, tb.customDisclaimer));
  }

  return {
    pageSize: 'A4',
    pageMargins: [50, 48, 50, 48],
    defaultStyle: { font: 'Roboto', fontSize: 10, color: C_TEXT, lineHeight: 1.4 },
    styles: STYLES,
    content: sections.filter(Boolean),
  };
};

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