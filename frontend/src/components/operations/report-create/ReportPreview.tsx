import { useState, type CSSProperties } from 'react';
import type {
  ReportData,
  Section,
  TableContent,
  NarrativeContent,
  CustomTableContent,
} from './types/report.types';
import {
  FileDown, Edit, ArrowLeft, FileText, Building2, Award, Shield,
  Users, Calendar, Briefcase, CheckCircle2, BookOpen, List,
  CheckCircle, AlertCircle, Lock,
} from 'lucide-react';
import { format } from 'date-fns';
import EditModal from './preview-components/EditModal';
import { generatePDF } from './utils/pdfGenerator';
import SmartImageGrid from './SmartImageGrid';


interface ReportPreviewProps {
  data: ReportData;
  onEdit: () => void;
  onUpdate: (updatedData: ReportData) => void;
}


const pageStyle: CSSProperties = {
  width: '210mm',
  height: '297mm',
  margin: '0 auto 50px',
  padding: '40px',
  backgroundColor: 'white',
};


const flowPageStyle: CSSProperties = {
  width: '210mm',
  height: 'auto',
  margin: '0 auto 50px',
  padding: '40px',
  backgroundColor: 'white',
};


// ── Main Component ───────────────────────────────────────────────────────────

const ReportPreview = ({ data, onEdit, onUpdate }: ReportPreviewProps) => {
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  // ── Photographic evidence from dedicated field only ──────────────────────
  const photoEvidence = data.photographicEvidence;
  const hasPhotos = (photoEvidence?.images?.length ?? 0) > 0;
  const photoHeading =
    photoEvidence?.showHeading && photoEvidence.heading?.trim()
      ? photoEvidence.heading
      : 'Photographic Evidence';


  const handleGeneratePDF = async () => {
    const btn = document.querySelector('button[data-generate-pdf]') as HTMLButtonElement | null;
    if (btn) {
      btn.disabled = true;
      const original = btn.innerHTML;
      btn.innerHTML = `
        <svg class="animate-spin w-5 h-5 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating PDF...
      `;
      await generatePDF();
      btn.disabled = false;
      btn.innerHTML = original;
    } else {
      await generatePDF();
    }
  };


  const handleSectionEdit = (section: Section) => setEditingSection(section);
  const handleCloseEdit = () => setEditingSection(null);


  const handleSectionUpdate = (updatedSection: Section) => {
    const updatedSections = data.sections.map((s) =>
      s.id === updatedSection.id ? updatedSection : s
    );
    onUpdate({
      ...data,
      sections: updatedSections,
      tableOfContents: updatedSections
        .map((s) => s.title)
        .filter((title) => title.trim() !== ''),
    });
    handleCloseEdit();
  };


  const renderTable = (content: TableContent) => {
    const col1 =
      content.useCustomHeadings && content.col1Label?.trim() ? content.col1Label : 'Parameter';
    const col2 =
      content.useCustomHeadings && content.col2Label?.trim() ? content.col2Label : 'Details';

    return (
      <div className="report-table-wrap overflow-hidden border border-gray-300 rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-gray-700 border-b border-gray-300">
                {col1}
              </th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 border-b border-gray-300">
                {col2}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {content.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-4 py-3 text-gray-700 align-top whitespace-pre-wrap">
                  {row['Parameter'] || '-'}
                </td>
                <td className="px-4 py-3 text-gray-700 align-top whitespace-pre-wrap">
                  {row['Details'] || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  const renderCustomTable = (content: CustomTableContent) => {
    const showHeader = content.columnCount > 1 || content.showSingleColumnHeader === true;

    return (
      <div className="report-table-wrap overflow-hidden border border-gray-300 rounded">
        <table className="w-full text-sm">
          {showHeader && (
            <thead className="bg-gray-100">
              <tr>
                {content.columnHeaders.map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left font-bold text-gray-700 border-b border-gray-300"
                  >
                    {header || `Column ${i + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-gray-200">
            {content.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-3 text-gray-700 align-top whitespace-pre-wrap"
                  >
                    {cell || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  const renderSectionContent = (section: Section) => {
    if (section.type === 'narrative') {
      return (
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {(section.content as NarrativeContent).text}
        </p>
      );
    }
    if (section.type === 'table') return renderTable(section.content as TableContent);
    if (section.type === 'custom-table')
      return renderCustomTable(section.content as CustomTableContent);
    return null;
  };

  // ── Estimate height of each section in pixels ────────────────────────────
  const estimateSectionHeight = (section: Section): number => {
    const HEADER = 72;   // title + border + margin
    const FOOTER = 48;   // page footer
    const NOTES = section.notes?.trim() ? 90 : 0;
    const GAP = 32;      // space between sections on same page

    let content = 0;

    if (section.type === 'narrative') {
      const text = (section.content as NarrativeContent).text || '';
      content = Math.max(50, Math.ceil(text.length / 75) * 22);
    } else if (section.type === 'table') {
      const rows = (section.content as TableContent).rows?.length ?? 0;
      content = 46 + rows * 42;
    } else if (section.type === 'custom-table') {
      const rows = (section.content as CustomTableContent).rows?.length ?? 0;
      content = 46 + rows * 42;
    }

    return HEADER + content + NOTES + FOOTER + GAP;
  };

  // ── Group sections into A4 pages by estimated height ────────────────────
  const groupSectionsIntoPages = (sections: Section[]): Section[][] => {
    const A4_USABLE_HEIGHT = 900; // px (297mm - 40px top/bottom padding)
    const pages: Section[][] = [];
    let currentPage: Section[] = [];
    let currentHeight = 0;

    sections.forEach((section) => {
      const height = estimateSectionHeight(section);
      if (currentPage.length > 0 && currentHeight + height > A4_USABLE_HEIGHT) {
        pages.push(currentPage);
        currentPage = [section];
        currentHeight = height;
      } else {
        currentPage.push(section);
        currentHeight += height;
      }
    });

    if (currentPage.length > 0) pages.push(currentPage);
    return pages;
  };

  // ── Compute grouped pages ─────────────────────────────────────────────────
  const sectionPages = groupSectionsIntoPages(data.sections);


  return (
    <div className="report-preview-root min-h-screen bg-white py-8 relative">

      {/* ── Background decoration ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-sky-200 rounded-3xl opacity-40 transform rotate-12"></div>
        <div className="absolute top-1/2 left-5 w-2 h-64 bg-gradient-to-b from-sky-400 via-blue-400 to-transparent opacity-40 rounded-full"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-blue-200 rounded-2xl opacity-35 transform -rotate-6"></div>
        <div className="absolute top-40 right-10 w-36 h-36 bg-sky-200 rounded-3xl opacity-40 transform -rotate-12"></div>
        <div className="absolute top-2/3 right-8 w-2 h-72 bg-gradient-to-b from-blue-400 via-sky-400 to-transparent opacity-40 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-200 rounded-2xl opacity-35 transform rotate-12"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300 opacity-50"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300 opacity-50"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">

        {/* ── Sticky toolbar ── */}
        <div
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-6 flex items-center justify-between sticky top-4 z-50"
          data-no-print="true"
        >
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Edit
          </button>
          <button
            type="button"
            data-generate-pdf
            onClick={handleGeneratePDF}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FileDown className="w-5 h-5" />
            Generate PDF
          </button>
        </div>


        {/* ── PAGE 1: COVER ─────────────────────────────────────────────────── */}
        <div
          data-pdf-page
          style={pageStyle}
          className="shadow-lg border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-blue-50"
        >
          <div className="h-full flex flex-col justify-between">
            <div className="pt-12">
              <div className="bg-white rounded-xl shadow-lg border-l-4 border-blue-600 p-6 mb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                      {data.header.title}
                    </h1>
                    <p className="text-lg text-gray-600">{data.header.subtitle}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center my-6">
              <div className="relative">
                <div className="absolute inset-0 transform rotate-45 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl -m-4"></div>
                <div className="relative bg-white rounded-xl shadow-xl p-8 border border-gray-200">
                  {data.header.clientLogo ? (
                    <img
                      src={data.header.clientLogo}
                      alt="Client Logo"
                      className="h-28 w-auto relative z-10"
                    />
                  ) : (
                    <div className="h-28 w-28 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                      <Building2 className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute -top-3 -right-3 bg-blue-600 rounded-full p-2">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-3 -left-3 bg-blue-600 rounded-full p-2">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <div className="pb-8">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Prepared for</p>
                  </div>
                  <p className="text-sm text-gray-900 font-semibold ml-11">
                    {data.header.preparedFor}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Date</p>
                  </div>
                  <p className="text-sm text-gray-900 font-semibold ml-11">
                    {format(new Date(data.header.date), 'dd MMM yyyy')}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white p-2 rounded-lg">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs font-bold text-blue-100 uppercase">Prepared by</p>
                </div>
                <p className="text-base text-white font-bold ml-11">{data.header.preparedBy}</p>
              </div>
            </div>
          </div>
        </div>


        {/* ── PAGE 2: TABLE OF CONTENTS ──────────────────────────────────────── */}
        <div
          data-pdf-page
          style={pageStyle}
          className="shadow-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50"
        >
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-3 rounded-xl shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">TABLE OF CONTENTS</h2>
              </div>
              <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent rounded-full"></div>
            </div>

            <div className="flex-1 space-y-3">
              {data.tableOfContents.length === 0 ? (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl">
                  <div className="text-center">
                    <List className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 italic">No sections added</p>
                  </div>
                </div>
              ) : (
                data.tableOfContents.map((item, index) => (
                  <div
                    key={index}
                    className="group bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold rounded-lg w-10 h-10 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          {index + 1}
                        </div>
                        <span className="text-gray-800 font-medium group-hover:text-blue-700 transition-colors flex-1">
                          {item}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 group-hover:text-blue-600 transition-colors">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-semibold">Page {index + 3}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* ── TOC entry for Photographic Evidence (only if photos exist) ── */}
              {hasPhotos && (
                <div className="group bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-blue-600 text-white font-bold rounded-lg w-10 h-10 flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-blue-800 font-medium flex-1">{photoHeading}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-500">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        Page {data.tableOfContents.length + 3}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-full shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    {data.tableOfContents.length} Section
                    {data.tableOfContents.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* ── PAGES 3+: SECTIONS PACKED INTO A4 PAGES ─────────────────────────── */}
        {sectionPages.map((pageSections, pageIdx) => (
          <div
            key={pageIdx}
            data-pdf-flow
            style={flowPageStyle}
            className="shadow-lg border border-gray-200"
          >
            <div className="space-y-0">
              {pageSections.map((section, sectionIdx) => {
                // Get original index for correct numbering (e.g. "3) Section Title")
                const globalIndex = data.sections.findIndex((s) => s.id === section.id);

                return (
                  <div key={section.id} className="report-section">

                    {/* Section header */}
                    <div className="report-section-header flex items-start justify-between gap-4 mb-4 pb-3 border-b-2 border-gray-400">
                      <h3 className="text-xl font-bold text-gray-900">
                        {globalIndex + 1}) {section.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleSectionEdit(section)}
                        className="flex items-center gap-2 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs whitespace-nowrap"
                        data-no-print="true"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                    </div>

                    {/* Section content */}
                    <div className="mb-4">{renderSectionContent(section)}</div>

                    {/* Notes */}
                    {section.notes && section.notes.trim().length > 0 && (
                      <div className="mt-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
                          {section.notesHeading?.trim() || 'Note:'}
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {section.notes}
                        </p>
                      </div>
                    )}

                    {/* Divider between sections on same page (not after last section) */}
                    {sectionIdx < pageSections.length - 1 && (
                      <div className="my-8 h-px bg-gray-200" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Page footer */}
            <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">
                {data.header.preparedBy} — Confidential
              </span>
              <span className="text-xs text-gray-400 font-medium">
                Page {pageIdx + 3}
              </span>
            </div>
          </div>
        ))}


        {/* ── PHOTOGRAPHIC EVIDENCE PAGE ────────────────────────────────────── */}
        {hasPhotos && (
          <div data-pdf-flow style={flowPageStyle} className="shadow-lg border border-gray-200">

            {/* Section header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-400">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{photoHeading}</h3>
                <p className="text-xs text-gray-500">
                  {photoEvidence!.images.length} image
                  {photoEvidence!.images.length !== 1 ? 's' : ''} attached
                </p>
              </div>
            </div>

            {/* Image grid — 1 column if single image, 2 columns otherwise */}
            {/* ✅ Smart orientation-aware image grid */}
            <SmartImageGrid
              images={photoEvidence!.images as any}
              showCaptions
              mode="preview"
            />
          </div>
        )}


        {/* ── LAST PAGE: END OF REPORT ───────────────────────────────────────── */}
        <div
          data-pdf-page
          style={pageStyle}
          className="shadow-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50"
        >
          <div className="h-full flex flex-col justify-between">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full p-6 shadow-xl">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">End of Report</h3>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-600"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-blue-600"></div>
                </div>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 inline-block">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        Document Created
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {format(new Date(), 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-300 pt-6">
              <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-500 p-2 rounded-lg flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-900 mb-2 uppercase">Disclaimer</p>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Our reports and comments are confidential in nature and not intended for general
                      circulation or publication. Client shall have no authority to modify our findings.
                      We disclaim all responsibility for any costs, damages, losses incurred by
                      circulation or use of our reports contrary to the provisions hereof.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-3 text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-xs font-semibold">{data.header.preparedBy}</span>
                </div>
                <span className="text-xs">•</span>
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  <span className="text-xs font-semibold">Confidential</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {editingSection && (
        <EditModal
          section={editingSection}
          onClose={handleCloseEdit}
          onSave={handleSectionUpdate}
        />
      )}
    </div>
  );
};

export default ReportPreview;