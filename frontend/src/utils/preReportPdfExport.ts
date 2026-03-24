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

// ── Corporate Design Tokens ───────────────────────────────────────────────────
const C_NAVY      = '#0f2340';
const C_NAVY_MID  = '#1a3a5c';
const C_GOLD      = '#c8972b';
const C_HDR_BG    = '#e8eef5';
const C_ROW_ALT   = '#f4f7fb';
const C_BORDER    = '#b8c8d8';
const C_TEXT      = '#000000';
const C_MUTED     = '#4a5568';
const C_WHITE     = '#ffffff';

// ── Uniform Table Layout ──────────────────────────────────────────────────────
// FIX: dontBreakRows: true prevents any single row from splitting across pages
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
  paddingLeft:   () => 9,
  paddingRight:  () => 9,
  paddingTop:    () => 6,
  paddingBottom: () => 6,
  // ▼ KEY FIX: no single table row will ever be split across a page break
  dontBreakRows: true,
};

// ── Global Styles ─────────────────────────────────────────────────────────────
const STYLES: any = {
  sectionHeader: { fontSize: 11, bold: true, marginTop: 14, marginBottom: 6 },
  tableHeader:   { fontSize: 9,  bold: true, fillColor: C_HDR_BG, color: C_NAVY },
  noteText:      { fontSize: 8.5, italics: true, color: C_MUTED, marginBottom: 8 },
  bodyText:      { fontSize: 10, color: C_TEXT },
};

// ── Interface ─────────────────────────────────────────────────────────────────
export interface PreReportPDFData {
  reportId:   string;
  clientName: string;
  leadType:   'CLIENT_LEAD' | 'TRUE_BUDDY_LEAD';
  status:     string;
  createdAt:  string;
  updatedAt:  string;
  products?: Array<{ name: string; category: string; status: string }>;
  clientLeadData?:    ClientLeadData;
  trueBuddyLeadData?: TrueBuddyLeadData;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const toTitleCase = (value: string): string => {
  if (!value) return 'N/A';
  return value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

// ── Enum Mappers ──────────────────────────────────────────────────────────────
const mapYesNo = (v: any): string =>
  !v ? 'N/A' : String(v).toUpperCase() === 'YES' ? 'Yes' : 'No';

const isVerificationDone = (v: any): boolean =>
  !!v && String(v).toUpperCase() === 'DONE';

const mapCompleteness = (v: any): string => {
  if (!v) return 'N/A';
  const s = String(v).toUpperCase();
  if (s === 'COMPLETE')           return 'Complete';
  if (s === 'PARTIALLY_COMPLETE') return 'Partially Complete';
  if (s === 'INCOMPLETE')         return 'Incomplete';
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
  if (s === 'ACTIONABLE')             return 'Actionable Lead';
  if (s === 'POTENTIALLY_ACTIONABLE') return 'Potentially Actionable (Information Gaps Exist)';
  if (s === 'NON_ACTIONABLE')         return 'Non-Actionable at Present';
  return toTitleCase(v);
};

const mapTrueBuddyAssessment = (v: any): string => {
  if (!v) return 'N/A';
  const s = String(v).toUpperCase();
  if (s === 'ACTIONABLE')                  return 'Actionable (Subject to Client Alignment)';
  if (s === 'ACTIONABLE_AFTER_VALIDATION') return 'Actionable After Controlled Validation';
  if (s === 'HOLD')                        return 'Hold -- Monitoring Recommended';
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



// ── Row Builders ──────────────────────────────────────────────────────────────
const row = (label: string, value: string, index = 0) => [
  {
    text: label,
    bold: true,
    fontSize: 9,
    color: C_NAVY,
    fillColor: index % 2 === 0 ? C_WHITE : C_ROW_ALT,
  },
  {
    text: value || 'N/A',
    fontSize: 9,
    color: C_TEXT,
    fillColor: index % 2 === 0 ? C_WHITE : C_ROW_ALT,
  },
];

const verRow = (activity: string, value: any, notes: string, index = 0) => {
  const done = isVerificationDone(value);
  return [
    {
      text: activity,
      fontSize: 9,
      color: C_TEXT,
      fillColor: index % 2 === 0 ? C_WHITE : C_ROW_ALT,
    },
    {
      text: done ? 'DONE' : 'PENDING',
      fontSize: 8.5,
      bold: true,
      alignment: 'center' as const,
      color: done ? C_NAVY : C_MUTED,
      fillColor: done ? C_HDR_BG : C_WHITE,
    },
    {
      text: notes || '-',
      fontSize: 9,
      color: C_TEXT,
      fillColor: index % 2 === 0 ? C_WHITE : C_ROW_ALT,
    },
  ];
};

// ── Checked-Only Section Builders ─────────────────────────────────────────────
const buildCheckedList = (
  items: { label: string; checked: boolean | null | undefined }[]
) => {
  const selected = items.filter((i) => !!i.checked);
  if (!selected.length) {
    return {
      text: 'None selected.',
      fontSize: 9,
      italics: true,
      color: C_MUTED,
      marginBottom: 10,
    };
  }
  return {
    table: {
      widths: ['6%', '94%'],
      body: selected.map((i, idx) => [
        {
          text: '>>',
          fontSize: 9,
          bold: true,
          alignment: 'center' as const,
          color: C_NAVY,
          fillColor: idx % 2 === 0 ? C_WHITE : C_ROW_ALT,
        },
        {
          text: i.label,
          fontSize: 9,
          color: C_TEXT,
          fillColor: idx % 2 === 0 ? C_WHITE : C_ROW_ALT,
        },
      ]),
    },
    layout: STANDARD_LAYOUT,
    marginBottom: 12,
  };
};

const buildVerificationTable = (
  rows: { activity: string; value: any; notes: string }[]
) => {
  const done = rows.filter((r) => isVerificationDone(r.value));
  if (!done.length) {
    return {
      text: 'No verifications marked as done.',
      fontSize: 9,
      italics: true,
      color: C_MUTED,
      marginBottom: 10,
    };
  }
  return {
    table: {
      widths: ['46%', '14%', '40%'],
      body: [
        [
          { text: 'Activity',   ...STYLES.tableHeader },
          { text: 'Status',     ...STYLES.tableHeader, alignment: 'center' },
          { text: 'Key Notes',  ...STYLES.tableHeader },
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
  if (!yes.length) {
    return {
      text: 'No observations marked as Yes.',
      fontSize: 9,
      italics: true,
      color: C_MUTED,
      marginBottom: 10,
    };
  }
  return {
    table: {
      widths: ['6%', '94%'],
      body: yes.map((r, idx) => [
        {
          text: '>>',
          fontSize: 9,
          bold: true,
          alignment: 'center' as const,
          color: C_NAVY,
          fillColor: idx % 2 === 0 ? C_WHITE : C_ROW_ALT,
        },
        {
          text: r.label,
          fontSize: 9,
          color: C_TEXT,
          fillColor: idx % 2 === 0 ? C_WHITE : C_ROW_ALT,
        },
      ]),
    },
    layout: STANDARD_LAYOUT,
    marginBottom: 12,
  };
};

const buildDataTable = (
  widths: string[],
  headers: string[],
  bodyRows: any[][]
) => ({
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

// ── FIX: sectionBlock wraps header + content in unbreakable stack ─────────────
// If the entire block fits on remaining page space → stays together.
// If it does NOT fit → the whole block (header + table) moves to next page.
// For very large tables (> 1 full page), dontBreakRows in STANDARD_LAYOUT
// ensures at minimum no single row is ever split mid-row.
const sectionBlock = (
  n: number,
  title: string,
  noteText: string | null,
  ...contentItems: any[]
): any => ({
  stack: [
    sec(n, title),
    ...(noteText
      ? [{ text: noteText, ...STYLES.noteText }]
      : []),
    ...contentItems,
  ],
  // Keeps header + table together — moves to next page as a unit if needed
  unbreakable: true,
});

// ── Corporate Cover Page ──────────────────────────────────────────────────────
const buildCoverPage = (
  data: PreReportPDFData,
  productNames: string,
  subtitle: string
): any[] => [
  {
    table: {
      widths: ['*'],
      body: [
        [{
          text: 'TRUE BUDDY CONSULTING PVT. LTD.',
          fontSize: 20,
          bold: true,
          color: C_WHITE,
          alignment: 'center',
          fillColor: C_NAVY,
          margin: [0, 28, 0, 6],
        }],
        [{
          text: 'Due Diligence  |  IPR Investigation  |  Fraud Investigation | Market Surveys',
          fontSize: 9.5,
          italics: true,
          color: '#a8c4dc',
          alignment: 'center',
          fillColor: C_NAVY,
          margin: [0, 0, 0, 22],
        }],
      ],
    },
    layout: 'noBorders',
    marginBottom: 0,
  },

  {
    canvas: [{ type: 'rect', x: 0, y: 0, w: 495, h: 4, color: C_GOLD }],
    marginBottom: 50,
  },

  {
    text: 'PRELIMINARY LEAD ASSESSMENT REPORT',
    fontSize: 16,
    bold: true,
    color: C_NAVY,
    alignment: 'center',
    marginBottom: 6,
  },
  {
    canvas: [
      { type: 'line', x1: 120, y1: 0, x2: 375, y2: 0, lineWidth: 1, lineColor: C_GOLD },
    ],
    marginBottom: 10,
  },
  {
    text: subtitle,
    fontSize: 10,
    italics: true,
    color: C_MUTED,
    alignment: 'center',
    marginBottom: 50,
  },

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
          { text: productNames,     fontSize: 9, color: C_TEXT,                fillColor: C_ROW_ALT,  margin: [10, 8, 8, 8] },
        ],
        [
          { text: 'REPORT ID',      bold: true, fontSize: 8.5, color: C_WHITE, fillColor: C_NAVY,     margin: [10, 8, 8, 8] },
          { text: data.reportId,    fontSize: 9, color: C_TEXT,                fillColor: C_WHITE,    margin: [10, 8, 8, 8] },
        ],
        [
          { text: 'LEAD TYPE',      bold: true, fontSize: 8.5, color: C_WHITE, fillColor: C_NAVY_MID, margin: [10, 8, 8, 8] },
          {
            text: data.leadType === 'CLIENT_LEAD' ? 'Client Lead' : 'True Buddy Lead',
            fontSize: 9, color: C_TEXT, fillColor: C_ROW_ALT, margin: [10, 8, 8, 8],
          },
        ],
        [
          { text: 'STATUS',         bold: true, fontSize: 8.5, color: C_WHITE, fillColor: C_NAVY,     margin: [10, 8, 8, 8] },
          { text: toTitleCase(data.status), fontSize: 9, color: C_TEXT,         fillColor: C_WHITE,   margin: [10, 8, 8, 8] },
        ],
        [
          { text: 'DATE GENERATED', bold: true, fontSize: 8.5, color: C_WHITE, fillColor: C_NAVY_MID, margin: [10, 8, 8, 8] },
          {
            text: new Date(data.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'long', year: 'numeric',
            }),
            fontSize: 9, color: C_TEXT, fillColor: C_ROW_ALT, margin: [10, 8, 8, 8],
          },
        ],
      ],
    },
    layout: {
      hLineWidth: (i: number, node: any) =>
        i === 0 || i === node.table.body.length ? 1.5 : 0.5,
      vLineWidth: (i: number, node: any) =>
        i === 0 || i === node.table.widths.length ? 1.5 : 0.5,
      hLineColor: (i: number, node: any) =>
        i === 0 || i === node.table.body.length ? C_NAVY : C_BORDER,
      vLineColor: (i: number, node: any) =>
        i === 0 || i === node.table.widths.length ? C_NAVY : C_BORDER,
    },
    marginBottom: 50,
  },

  {
    table: {
      widths: ['*'],
      body: [[{
        stack: [
          {
            text: 'CONFIDENTIAL DOCUMENT',
            fontSize: 11,
            bold: true,
            color: C_NAVY,
            alignment: 'center',
            marginBottom: 5,
          },
          {
            text: 'This report contains sensitive information intended solely for authorised personnel.\nUnauthorised disclosure, reproduction, or distribution is strictly prohibited.',
            fontSize: 8.5,
            italics: true,
            color: C_MUTED,
            alignment: 'center',
          },
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

// ── Section Header ────────────────────────────────────────────────────────────
const sec = (n: number, title: string) => ({
  stack: [
    {
      table: {
        widths: ['*'],
        body: [[{
          columns: [
            {
              table: {
                widths: [22],
                body: [[{
                  text: String(n),
                  fontSize: 10,
                  bold: true,
                  color: C_WHITE,
                  fillColor: C_GOLD,
                  alignment: 'center',
                  margin: [0, 3, 0, 3],
                }]],
              },
              layout: 'noBorders',
              width: 28,
            },
            {
              text: title,
              fontSize: 11,
              bold: true,
              color: C_WHITE,
              margin: [8, 4, 0, 4],
            },
          ],
          fillColor: C_NAVY,
          margin: [4, 2, 4, 2],
        }]],
      },
      layout: 'noBorders',
    },
  ],
  // No extra marginTop here — sectionBlock handles spacing
  marginBottom: 7,
});

// ── Assessment Block ──────────────────────────────────────────────────────────
const assessmentBlock = (
  label: string,
  mappedValue: string,
  rationale: string | undefined,
  rationaleLabel: string
) => ({
  // Entire assessment (label + rationale) is unbreakable as one unit
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
        hLineWidth: (i: number, node: any) =>
          i === 0 || i === node.table.body.length ? 1 : 0,
        vLineWidth: (i: number) => (i === 0 ? 4 : i === 1 ? 1 : 0),
        hLineColor: () => C_BORDER,
        vLineColor: (i: number) => (i === 0 ? C_GOLD : C_BORDER),
      },
      marginBottom: 12,
    },
    {
      text: `${rationaleLabel}:`,
      bold: true,
      fontSize: 9.5,
      color: C_NAVY,
      marginBottom: 4,
    },
    {
      text: rationale || '(Brief justification for the above assessment)',
      fontSize: 9.5,
      italics: !rationale,
      color: C_TEXT,
      marginBottom: 15,
    },
  ],
  unbreakable: true,
});

// ── Content Title (after cover break) ────────────────────────────────────────
const contentTitle = (line1: string, line2: string, line3?: string): any[] => [
  { text: line1, fontSize: 14, bold: true, alignment: 'center', color: C_NAVY, marginBottom: 4 },
  {
    canvas: [
      { type: 'line', x1: 100, y1: 0, x2: 395, y2: 0, lineWidth: 1, lineColor: C_GOLD },
    ],
    marginBottom: 6,
  },
  { text: line2, fontSize: 9.5, italics: true, alignment: 'center', color: C_MUTED, marginBottom: line3 ? 3 : 20 },
  ...(line3
    ? [{ text: line3, fontSize: 9.5, bold: true, alignment: 'center', color: C_NAVY, marginBottom: 20 }]
    : []),
];



// Helper to build a numbered disclaimer sec correctly
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
  unbreakable: true,
  marginTop: 18,
});

// ==========================================================================
//  CLIENT LEAD PDF
// ==========================================================================

const generateClientLeadPDF = (data: PreReportPDFData): any => {
  const cl = data.clientLeadData!;
  const productNames = data.products?.map((p) => p.name).join(', ') || 'N/A';

  return {
    pageSize: 'A4',
    pageMargins: [50, 48, 50, 48],
    defaultStyle: { font: 'Roboto', fontSize: 10, color: C_TEXT, lineHeight: 1.4 },
    styles: STYLES,

    content: [
      // ── Cover ──────────────────────────────────────────────────────────────
      ...buildCoverPage(data, productNames, '(Based on Client-Provided Information)'),

      // ── Content title ──────────────────────────────────────────────────────
      ...contentTitle(
        'PRELIMINARY LEAD ASSESSMENT REPORT',
        '(Based on Client-Provided Information)'
      ),

      // ── 1. Client & Case Details ───────────────────────────────────────────
      // sectionBlock: if header + table don't fit on remaining page → entire block
      // moves to next page as a unit. dontBreakRows ensures no row splits mid-row.
      sectionBlock(
        1, 'Client & Case Details', null,
        buildDataTable(
          ['44%', '56%'],
          ['Field', 'Details'],
          [
            row('Name of Client',                      data.clientName,                                                                                                 0),
            row('Product(s) Involved',                 productNames,                                                                                                    1),
            row('Date Information Received',           cl.dateInfoReceived ? new Date(cl.dateInfoReceived).toLocaleDateString('en-IN') : 'N/A',                        2),
            row('Location (State / District / City)',  [cl.state, cl.city].filter(Boolean).join(', ') || 'N/A',                                                        3),
            row('Client SPOC',                         `${cl.clientSpocName || 'N/A'}${cl.clientSpocContact ? '  |  ' + cl.clientSpocContact : ''}`,                   4),
          ]
        )
      ),

      // ── 2. Mandate / Scope Requested ──────────────────────────────────────
      sectionBlock(
        2, 'Mandate / Scope Requested',
        'Only selected scope items are listed below.',
        buildCheckedList([
          { label: 'Due Diligence',                                            checked: cl.scopeDueDiligence },
          { label: 'IPR Investigation -- Retailer / Wholesaler',               checked: cl.scopeIprRetailer },
          { label: 'IPR Investigation -- Supplier',                            checked: cl.scopeIprSupplier },
          { label: 'IPR Investigation -- Manufacturer / Packager / Warehouse', checked: cl.scopeIprManufacturer },
          { label: 'Online Sample Purchase',                                   checked: cl.scopeOnlinePurchase },
          { label: 'Offline Sample Purchase',                                  checked: cl.scopeOfflinePurchase },
        ]),
        ...(cl.scopeCustomIds?.length
          ? [{ text: `Additional Scope: ${cl.scopeCustomIds.join(', ')}`, fontSize: 9, color: C_TEXT, marginBottom: 10 }]
          : [])
      ),

      // ── 3. Information Received from Client ────────────────────────────────
      sectionBlock(
        3, 'Information Received from Client', null,
        buildDataTable(
          ['50%', '50%'],
          ['Parameter', 'Details'],
          [
            row('Name of Entity',                          cl.entityName || 'N/A',                                                                                                                                      0),
            row('Name of Suspect (if different)',          cl.suspectName || 'N/A',                                                                                                                                     1),
            row('Contact Number(s)',                       cl.contactNumbers || 'N/A',                                                                                                                                  2),
            row('Address / Location',                     [cl.addressLine1, cl.addressLine2, cl.city, cl.state, cl.pincode].filter(Boolean).join(', ') || 'N/A',                                                       3),
            row('Online Presence',                        Array.isArray(cl.onlinePresences) && cl.onlinePresences.length ? cl.onlinePresences.map((p: any) => `${p.platformName}: ${p.link}`).join(' | ') : 'N/A',     4),
            row('Product Details',                        cl.productDetails || 'N/A',                                                                                                                                   5),
            row('Product Photographs Provided',           mapYesNo(cl.photosProvided),                                                                                                                                  6),
            row('Video Evidence Provided',                mapYesNo(cl.videoProvided),                                                                                                                                   7),
            row('Invoice / Bill Available',               mapYesNo(cl.invoiceAvailable),                                                                                                                                8),
            row('Source Narrative (as shared by client)', cl.sourceNarrative || 'N/A',                                                                                                                                  9),
          ]
        )
      ),

      // ── 4. Preliminary Verification ────────────────────────────────────────
      sectionBlock(
        4, 'Preliminary Verification Conducted by True Buddy',
        'Desk-based assessment only; no field deployment at this stage. Only completed activities are listed.',
        buildVerificationTable([
          { activity: 'Case Discussion with Client Team',                    value: cl.verificationClientDiscussion,  notes: cl.verificationClientDiscussionNotes || '' },
          { activity: 'Internet / OSINT Search',                             value: cl.verificationOsint,             notes: cl.verificationOsintNotes || '' },
          { activity: 'Marketplace Verification (IndiaMART / Social Media)', value: cl.verificationMarketplace,       notes: cl.verificationMarketplaceNotes || '' },
          { activity: 'Pretext Calling (if applicable)',                     value: cl.verificationPretextCalling,    notes: cl.verificationPretextCallingNotes || '' },
          { activity: 'Preliminary Product Image Review',                    value: cl.verificationProductReview,     notes: cl.verificationProductReviewNotes || '' },
        ])
      ),

      // ── 5. Key Observations ────────────────────────────────────────────────
      sectionBlock(
        5, 'Key Observations',
        'Only observations confirmed as applicable are listed below.',
        buildObservationTable([
          { label: 'Availability of Identifiable Target',       value: cl.obsIdentifiableTarget },
          { label: 'Traceability of Entity / Contact',          value: cl.obsTraceability },
          { label: 'Product Visibility / Market Presence',      value: cl.obsProductVisibility },
          { label: 'Indications of Counterfeiting / Lookalike', value: cl.obsCounterfeitingIndications },
          { label: 'Evidentiary Gaps Identified',               value: cl.obsEvidentiary_gaps },
          ...(cl.observationsCustomData || []).map((o: any) => ({
            label: o.optionName || `Custom #${o.optionId}`,
            value: o.text,
          })),
        ])
      ),

      // ── 6. Information Quality Assessment ─────────────────────────────────
      sectionBlock(
        6, 'Information Quality Assessment', null,
        buildDataTable(
          ['56%', '44%'],
          ['Parameter', 'Assessment'],
          [
            row('Completeness of Initial Information',                mapCompleteness(cl.qaCompleteness),        0),
            row('Accuracy of Case Description (prima facie)',         mapAccuracy(cl.qaAccuracy),                1),
            row('Any Independent Client Investigation Conducted',     mapYesNo(cl.qaIndependentInvestigation),   2),
            row('Any Prior Confrontation with Seller / Suspect',      mapYesNo(cl.qaPriorConfrontation),         3),
            row('Risk of Information Contamination',                  mapRiskLevel(cl.qaContaminationRisk),      4),
          ]
        )
      ),

      // ── 7. Preliminary Assessment ──────────────────────────────────────────
      // sectionBlock wraps sec header + assessmentBlock together
      {
        stack: [
          sec(7, "True Buddy's Preliminary Assessment"),
          assessmentBlock(
            'Overall Assessment of Lead',
            mapClientAssessment(cl.assessmentOverall),
            cl.assessmentRationale,
            'Rationale'
          ),
        ],
        unbreakable: true,
        marginTop: 18,
      },

      // ── 8. Recommended Way Forward ─────────────────────────────────────────
      sectionBlock(
        8, 'Recommended Way Forward',
        'Based on current information. Only selected recommendations are listed.',
        buildCheckedList([
          { label: 'Market Survey / Reconnaissance',               checked: cl.recMarketSurvey },
          { label: 'Covert Investigation',                         checked: cl.recCovertInvestigation },
          { label: 'Evidential Test Purchase',                     checked: cl.recTestPurchase },
          { label: 'Direct Enforcement Action',                    checked: cl.recEnforcementAction },
          { label: 'Additional Information Required from Client',  checked: cl.recAdditionalInfo },
          { label: 'Closure / Hold',                               checked: cl.recClosureHold },
        ]),
        ...(cl.recCustomIds?.length
          ? [{ text: `Additional Recommendations: ${cl.recCustomIds.join(', ')}`, fontSize: 9, color: C_TEXT, marginBottom: 10 }]
          : [])
      ),

      // ── 9. Remarks ─────────────────────────────────────────────────────────
      {
        stack: [
          sec(9, 'Remarks'),
          {
            text: cl.remarks || '(No additional remarks provided.)',
            fontSize: 9.5,
            italics: !cl.remarks,
            color: C_TEXT,
            marginBottom: 15,
          },
        ],
        unbreakable: true,
        marginTop: 18,
      },

      // ── 10. Disclaimer ─────────────────────────────────────────────────────
      buildNumberedDisclaimer(
        10,
        cl.customDisclaimer ||
          'This preliminary assessment is prepared solely on the basis of information provided by the client. True Buddy assumes the information to be complete and accurate at this stage. In the event that the information is found to be incomplete, inaccurate, or misleading during subsequent investigation or field deployment, additional costs towards team mobilisation and preliminary investigation shall be applicable as per the approved proposal. This document does not constitute a final investigative report or legal opinion.'
      ),
    ],
  };
};

// ==========================================================================
//  TRUE BUDDY LEAD PDF
// ==========================================================================

const generateTrueBuddyLeadPDF = (data: PreReportPDFData): any => {
  const tb = data.trueBuddyLeadData!;
  const productNames = data.products?.map((p) => p.name).join(', ') || 'N/A';

  return {
    pageSize: 'A4',
    pageMargins: [50, 48, 50, 48],
    defaultStyle: { font: 'Roboto', fontSize: 10, color: C_TEXT, lineHeight: 1.4 },
    styles: STYLES,

    content: [
      // ── Cover ──────────────────────────────────────────────────────────────
      ...buildCoverPage(data, productNames, '(Lead Generated Through True Buddy Intelligence Network)'),

      // ── Content title ──────────────────────────────────────────────────────
      ...contentTitle(
        'PRELIMINARY LEAD ASSESSMENT REPORT',
        '(Lead Generated Through True Buddy Intelligence Network)',
        '[Confidential -- Client-Sanitised Version]'
      ),

      // ── 1. Client & Case Reference ─────────────────────────────────────────
      sectionBlock(
        1, 'Client & Case Reference', null,
        buildDataTable(
          ['44%', '56%'],
          ['Field', 'Details'],
          [
            row('Client Name',                          data.clientName,                                                                                                                         0),
            row('Product Category',                     mapProductCategory(tb.productCategory),                                                                                                  1),
            row('Type of Infringement',                 mapInfringementType(tb.infringementType),                                                                                                2),
            row('Date of Internal Lead Generation',     tb.dateInternalLeadGeneration ? new Date(tb.dateInternalLeadGeneration).toLocaleDateString('en-IN') : 'N/A',                             3),
            row('Broad Geography',                      tb.broadGeography || 'N/A',                                                                                                             4),
            row('Client SPOC',                          `${tb.clientSpocName || 'N/A'}${tb.clientSpocDesignation ? '  |  ' + tb.clientSpocDesignation : ''}`,                                    5),
            row('Nature of Entity',                     mapNatureOfEntity(tb.natureOfEntity),                                                                                                    6),
          ]
        ),
        {
          text: "Note: This lead was generated through True Buddy's independent intelligence channels. Specific source identifiers and proprietary intelligence inputs are intentionally withheld.",
          ...STYLES.noteText,
        }
      ),

      // ── 2. Mandate / Scope Proposed ────────────────────────────────────────
      sectionBlock(
        2, 'Mandate / Scope Proposed',
        'Indicative -- subject to client approval. Only selected items are listed.',
        buildCheckedList([
          { label: 'IPR Investigation -- Supplier Level',          checked: tb.scopeIprSupplier },
          { label: 'IPR Investigation -- Manufacturer / Packager', checked: tb.scopeIprManufacturer },
          { label: 'IPR Investigation -- Stockist / Warehouse',    checked: tb.scopeIprStockist },
          { label: 'Covert Market Verification',                   checked: tb.scopeMarketVerification },
          { label: 'Evidential Test Purchase (ETP)',               checked: tb.scopeEtp },
          { label: 'Enforcement Facilitation (If Applicable)',     checked: tb.scopeEnforcement },
        ])
      ),

      // ── 3. High-Level Lead Description ─────────────────────────────────────
      sectionBlock(
        3, 'High-Level Lead Description (Sanitised)', null,
        buildDataTable(
          ['46%', '54%'],
          ['Parameter', 'Description'],
          [
            row('Nature of Intelligence',        mapIntelNature(tb.intelNature),             0),
            row('Type of Suspected Activity',    mapSuspectedActivity(tb.suspectedActivity), 1),
            row('Product Segment',               mapProductCategory(tb.productSegment),      2),
            row('Stage of Supply Chain',         mapSupplyChainStage(tb.supplyChainStage),   3),
            row('Repeat Intelligence Indicator', mapYesNo(tb.repeatIntelligence),            4),
            row('Multi-Brand Exposure Risk',     mapYesNo(tb.multiBrandRisk),                5),
          ]
        ),
        {
          text: 'Specific entity names, contact details, and exact locations are withheld at this stage to maintain confidentiality and prevent contamination across clients.',
          ...STYLES.noteText,
        }
      ),

      // ── 4. Preliminary Verification ────────────────────────────────────────
      sectionBlock(
        4, 'Preliminary Verification Conducted by True Buddy',
        'Non-intrusive, desk and intelligence-based assessment only. Only completed activities are listed.',
        buildVerificationTable([
          { activity: 'Internal Intelligence Corroboration',  value: tb.verificationIntelCorroboration,  notes: tb.verificationIntelCorroborationNotes || '' },
          { activity: 'OSINT / Market Footprint Review',      value: tb.verificationOsint,               notes: tb.verificationOsintNotes || '' },
          { activity: 'Pattern Mapping (Similar Past Cases)', value: tb.verificationPatternMapping,      notes: tb.verificationPatternMappingNotes || '' },
          { activity: 'Jurisdiction Feasibility Review',      value: tb.verificationJurisdiction,        notes: tb.verificationJurisdictionNotes || '' },
          { activity: 'Risk & Sensitivity Assessment',        value: tb.verificationRiskAssessment,      notes: tb.verificationRiskAssessmentNotes || '' },
        ])
      ),

      // ── 5. Key Observations ────────────────────────────────────────────────
      sectionBlock(
        5, 'Key Observations (Client-Safe)',
        'Only observations confirmed as applicable are listed below.',
        buildObservationTable([
          { label: 'Scale of Suspected Operations',               value: tb.obsOperationScale },
          { label: 'Likelihood of Counterfeit Activity',          value: tb.obsCounterfeitLikelihood },
          { label: 'Potential Brand Exposure',                    value: tb.obsBrandExposure },
          { label: 'Enforcement Sensitivity (Political / Local)', value: tb.obsEnforcementSensitivity },
          { label: 'Risk of Information Leakage',                 value: tb.obsLeakageRisk },
          ...(tb.observationsCustomData || []).map((o: any) => ({
            label: o.optionName || `Custom #${o.optionId}`,
            value: o.text,
          })),
        ])
      ),

      // ── 6. Information Integrity & Risk Assessment ──────────────────────────
      sectionBlock(
        6, 'Information Integrity & Risk Assessment', null,
        buildDataTable(
          ['56%', '44%'],
          ['Parameter', 'Assessment'],
          [
            row('Source Reliability (Internal Assessment)',  mapSourceReliability(tb.riskSourceReliability), 0),
            row('Risk of Cross-Client Conflict',             mapRiskLevel(tb.riskClientConflict),            1),
            row('Suitability for Immediate Action',          mapYesNo(tb.riskImmediateAction),               2),
            row('Requirement for Controlled Validation',     mapYesNo(tb.riskControlledValidation),          3),
            row('Risk of Premature Disclosure',              mapRiskLevel(tb.riskPrematureDisclosure),       4),
          ]
        )
      ),

      // ── 7. Preliminary Assessment ──────────────────────────────────────────
      {
        stack: [
          sec(7, "True Buddy's Preliminary Assessment"),
          assessmentBlock(
            'Overall Assessment of Lead',
            mapTrueBuddyAssessment(tb.assessmentOverall),
            tb.assessmentRationale,
            'Assessment Rationale'
          ),
        ],
        unbreakable: true,
        marginTop: 18,
      },

      // ── 8. Recommended Way Forward ─────────────────────────────────────────
      sectionBlock(
        8, 'Recommended Way Forward',
        'Client-specific execution will be ring-fenced. Only selected recommendations are listed.',
        buildCheckedList([
          { label: 'Covert Intelligence Validation',         checked: tb.recCovertValidation },
          { label: 'Evidential Test Purchase (ETP)',         checked: tb.recEtp },
          { label: 'Controlled Market Reconnaissance',       checked: tb.recMarketReconnaissance },
          { label: 'Enforcement Planning (Deferred)',        checked: tb.recEnforcementDeferred },
          { label: 'Continued Monitoring',                   checked: tb.recContinuedMonitoring },
          { label: 'Client-Specific Segregation Required',  checked: tb.recClientSegregation },
        ])
      ),

      // ── 9. Confidentiality & Ring-Fencing Note ─────────────────────────────
      {
        stack: [
          sec(9, 'Confidentiality & Ring-Fencing Note'),
          {
            text: tb.confidentialityNote ||
              "This lead has been generated through True Buddy's proprietary intelligence mechanisms and may be relevant to more than one brand or client. All investigations, validations, and actions -- if approved -- will be strictly ring-fenced for the concerned client. No cross-sharing of intelligence, sources, or findings will occur across clients.",
            fontSize: 9.5,
            alignment: 'justify',
            color: C_TEXT,
            marginBottom: 15,
          },
        ],
        unbreakable: true,
        marginTop: 18,
      },

      // ── 10. Remarks ────────────────────────────────────────────────────────
      {
        stack: [
          sec(10, 'Remarks'),
          {
            text: tb.remarks || '(No additional remarks provided.)',
            fontSize: 9.5,
            italics: !tb.remarks,
            color: C_TEXT,
            marginBottom: 15,
          },
        ],
        unbreakable: true,
        marginTop: 18,
      },

      // ── 11. Disclaimer ─────────────────────────────────────────────────────
      buildNumberedDisclaimer(
        11,
        tb.customDisclaimer ||
          'This preliminary assessment is based on internally generated intelligence and limited non-intrusive verification. Specific source details, identities, and methods have been deliberately withheld to preserve confidentiality and prevent information contamination. This document does not constitute a final investigative report or confirmation of infringement. Any further action will be undertaken only upon written client approval and under a client-specific scope of work.'
      ),
    ],
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
