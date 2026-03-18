import { useState, useEffect } from 'react';
import type { Section, TableContent, CustomTableContent, NarrativeContent } from '../types/report.types';
import { Trash2, Plus, GripVertical, X, ImageOff } from 'lucide-react';
import ImageUploadWithCrop from '../ImageUploadWithCrop';

// Resolves relative URLs to absolute — S3 URLs pass through unchanged
const resolveImageUrl = (url: string): string => {
    if (!url) return '';
    // ✅ base64 data URLs — return as-is, never send to backend
    if (url.startsWith('data:')) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};


interface DynamicSectionProps {
  section:  Section;
  index:    number;
  caseId:   number | null;
  onUpdate: (id: string, section: Section) => void;
  onDelete: (id: string) => void;
}

const DynamicSection = ({
  section,
  index,
  caseId,
  onUpdate,
  onDelete,
}: DynamicSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasImages,  setHasImages]  = useState(
    section.images !== undefined && section.images.length > 0
  );

  // Sync hasImages when section.images loaded from backend
  useEffect(() => {
    if (section.images && section.images.length > 0) {
      setHasImages(true);
    }
  }, [section.images]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleTitleChange = (title: string) => {
    onUpdate(section.id, { ...section, title });
  };

  const handleTypeChange = (type: 'table' | 'narrative' | 'custom-table') => {
    let newContent: TableContent | NarrativeContent | CustomTableContent;
    if (type === 'table') {
      newContent = { columns: ['Parameter', 'Details'], rows: [] };
    } else if (type === 'narrative') {
      newContent = { text: '' };
    } else {
      newContent = { columnCount: 2, columnHeaders: ['', ''], rows: [] };
    }
    onUpdate(section.id, { ...section, type, content: newContent });
  };

  const handleAddRow = () => {
    if (section.type === 'table') {
      const content = section.content as TableContent;
      const newRow: Record<string, string> = {};
      content.columns.forEach((col) => { newRow[col] = ''; });
      onUpdate(section.id, {
        ...section,
        content: { ...content, rows: [...content.rows, newRow] },
      });
    }
  };

  const handleUpdateRow = (rowIndex: number, column: string, value: string) => {
    if (section.type === 'table') {
      const content   = section.content as TableContent;
      const updatedRows = [...content.rows];
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], [column]: value };
      onUpdate(section.id, { ...section, content: { ...content, rows: updatedRows } });
    }
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (section.type === 'table') {
      const content = section.content as TableContent;
      onUpdate(section.id, {
        ...section,
        content: { ...content, rows: content.rows.filter((_, i) => i !== rowIndex) },
      });
    }
  };

  const handleColumnCountChange = (count: number) => {
    const headers = Array(count).fill('');
    onUpdate(section.id, {
      ...section,
      content: { columnCount: count, columnHeaders: headers, rows: [] },
    });
  };

  const handleCustomHeaderChange = (idx: number, value: string) => {
    if (section.type === 'custom-table') {
      const content     = section.content as CustomTableContent;
      const newHeaders  = [...content.columnHeaders];
      newHeaders[idx]   = value;
      onUpdate(section.id, { ...section, content: { ...content, columnHeaders: newHeaders } });
    }
  };

  const handleAddCustomRow = () => {
    if (section.type === 'custom-table') {
      const content = section.content as CustomTableContent;
      onUpdate(section.id, {
        ...section,
        content: { ...content, rows: [...content.rows, Array(content.columnCount).fill('')] },
      });
    }
  };

  const handleUpdateCustomCell = (rowIndex: number, colIndex: number, value: string) => {
    if (section.type === 'custom-table') {
      const content     = section.content as CustomTableContent;
      const updatedRows = content.rows.map((row, ri) =>
        ri === rowIndex ? row.map((cell, ci) => (ci === colIndex ? value : cell)) : row
      );
      onUpdate(section.id, { ...section, content: { ...content, rows: updatedRows } });
    }
  };

  const handleDeleteCustomRow = (rowIndex: number) => {
    if (section.type === 'custom-table') {
      const content = section.content as CustomTableContent;
      onUpdate(section.id, {
        ...section,
        content: { ...content, rows: content.rows.filter((_, i) => i !== rowIndex) },
      });
    }
  };

  const handleNarrativeChange = (text: string) => {
    if (section.type === 'narrative') {
      onUpdate(section.id, { ...section, content: { text } });
    }
  };

  const handleDeleteImage = (idx: number) => {
    const updated = (section.images ?? []).filter((_, i) => i !== idx);
    onUpdate(section.id, { ...section, images: updated });
    if (updated.length === 0) setHasImages(false);
  };

  const sectionTypes = [
    { value: 'table'        as const, label: 'Parameter Table' },
    { value: 'custom-table' as const, label: 'Custom Row/Column Table' },
    { value: 'narrative'    as const, label: 'Narrative Text' },
  ];

  return (
    <div className="border border-gray-200 rounded-lg bg-white">

      {/* ── Section Header ─────────────────────────────────────────────────── */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
          <span className="font-medium text-gray-700">Section {index + 1}</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
        <button
          onClick={() => onDelete(section.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* ── Section Content ────────────────────────────────────────────────── */}
      {isExpanded && (
        <div className="p-4 space-y-4">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title *
            </label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Background, The Task, Meeting Details"
            />
          </div>

          {/* Type selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Type
            </label>
            <div className="flex flex-wrap gap-4">
              {sectionTypes.map((t) => (
                <label key={t.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={section.type === t.value}
                    onChange={() => handleTypeChange(t.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ── Custom Table ──────────────────────────────────────────────── */}
          {section.type === 'custom-table' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Columns
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={(section.content as CustomTableContent).columnCount}
                  onChange={(e) => handleColumnCountChange(parseInt(e.target.value) || 2)}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Column Headers
                </label>
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${(section.content as CustomTableContent).columnCount}, 1fr)` }}
                >
                  {(section.content as CustomTableContent).columnHeaders.map((header, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={header}
                      onChange={(e) => handleCustomHeaderChange(idx, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder={`Column ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Table Rows</label>
                  <button
                    onClick={handleAddCustomRow}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Row
                  </button>
                </div>

                {(section.content as CustomTableContent).rows.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 text-sm">No rows added yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(section.content as CustomTableContent).rows.map((row, rowIndex) => (
                      <div key={rowIndex} className="bg-gray-50 p-3 rounded-lg">
                        <div
                          className="grid gap-2 mb-2"
                          style={{ gridTemplateColumns: `repeat(${(section.content as CustomTableContent).columnCount}, 1fr)` }}
                        >
                          {row.map((cell, colIndex) => (
                            <input
                              key={colIndex}
                              type="text"
                              value={cell}
                              onChange={(e) => handleUpdateCustomCell(rowIndex, colIndex, e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder={`Data ${colIndex + 1}`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => handleDeleteCustomRow(rowIndex)}
                          className="text-red-600 hover:bg-red-100 px-2 py-1 rounded text-xs"
                        >
                          Delete Row
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Parameter Table ───────────────────────────────────────────── */}
          {section.type === 'table' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Table Data</label>
                <button
                  onClick={handleAddRow}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Row
                </button>
              </div>

              {(section.content as TableContent).rows.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 text-sm">No rows added yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(section.content as TableContent).rows.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="grid grid-cols-[1fr,2fr,auto] gap-3 items-start bg-gray-50 p-3 rounded-lg"
                    >
                      <input
                        type="text"
                        value={row['Parameter'] || ''}
                        onChange={(e) => handleUpdateRow(rowIndex, 'Parameter', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Parameter"
                      />
                      <textarea
                        value={row['Details'] || ''}
                        onChange={(e) => handleUpdateRow(rowIndex, 'Details', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Details"
                        rows={2}
                      />
                      <button
                        onClick={() => handleDeleteRow(rowIndex)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Narrative ─────────────────────────────────────────────────── */}
          {section.type === 'narrative' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Content
              </label>
              <textarea
                value={(section.content as NarrativeContent).text || ''}
                onChange={(e) => handleNarrativeChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your narrative text here..."
                rows={6}
              />
            </div>
          )}

          {/* ── Images ────────────────────────────────────────────────────── */}
          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasImages}
                onChange={(e) => {
                  setHasImages(e.target.checked);
                  if (!e.target.checked) {
                    onUpdate(section.id, { ...section, images: [] });
                  }
                }}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">
                Attach Images to this section
              </span>
            </label>

            {hasImages && (
              <div className="space-y-3">

                {/* ✅ Single clean upload button — crop then upload to S3 */}
                <ImageUploadWithCrop
                  caseId={caseId}
                  label="Attach Image"
                  onImageCropped={(s3Url) => {
                    // ✅ s3Url is always an HTTPS S3 URL — never base64
                    const updatedSection: Section = {
                      ...section,
                      images: [...(section.images ?? []), s3Url],
                    };
                    onUpdate(section.id, updatedSection);
                  }}
                />

                {/* Image grid */}
                {section.images && section.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {section.images.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative border border-gray-200 rounded-lg overflow-hidden group"
                      >
                        <img
                          src={resolveImageUrl(url)}
                          alt={`Section image ${idx + 1}`}
                          className="w-full h-32 object-cover bg-gray-100"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                            (e.currentTarget.nextSibling as HTMLElement)
                              ?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden w-full h-32 bg-gray-100 flex items-center justify-center">
                          <ImageOff className="w-6 h-6 text-gray-400" />
                          <span className="text-xs text-gray-400 ml-1">Failed to load</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
                          Image {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default DynamicSection;
