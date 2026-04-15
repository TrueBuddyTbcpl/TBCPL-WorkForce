// components/operations/report-create/preview-components/EditModal.tsx
import { useState } from 'react';
import type {
  Section,
  TableContent,
  CustomTableContent,
  NarrativeContent,
  ImageSectionContent,
} from '../types/report.types';
import { X, Save, Plus, Trash2 } from 'lucide-react';


// ── Migration: handles old single-image format → new multi-image format ──────
const migrateImageContent = (content: any): ImageSectionContent => {
  if (content?.imageUrl !== undefined) {
    return {
      images: content.imageUrl
        ? [{ url: content.imageUrl, reason: content.reason ?? '' }]
        : [],
      reason: '',
      showHeading: content.showHeading ?? false,
      heading: content.heading ?? '',
    };
  }
  return {
    images: content?.images ?? [],
    reason: content?.reason ?? '',
    showHeading: content?.showHeading ?? false,
    heading: content?.heading ?? '',
  };
};


interface EditModalProps {
  section: Section;
  onClose: () => void;
  onSave: (section: Section) => void;
}


const EditModal = ({ section, onClose, onSave }: EditModalProps) => {
  const [editedSection, setEditedSection] = useState<Section>({
    ...section,
    // Migrate image content immediately on modal open
    content: section.type === 'image'
      ? migrateImageContent(section.content)
      : section.content,
  });


  // ── Title & Notes ─────────────────────────────────────────────────────────
  const handleTitleChange = (title: string) =>
    setEditedSection({ ...editedSection, title });


  const handleNotesChange = (notes: string) =>
    setEditedSection({ ...editedSection, notes });


  // ── Parameter Table ───────────────────────────────────────────────────────
  const handleAddRow = () => {
    if (editedSection.type !== 'table') return;
    const content = editedSection.content as TableContent;
    const newRow: Record<string, string> = {};
    content.columns.forEach((col) => { newRow[col] = ''; });
    setEditedSection({ ...editedSection, content: { ...content, rows: [...content.rows, newRow] } });
  };


  const handleUpdateRow = (rowIndex: number, column: string, value: string) => {
    if (editedSection.type !== 'table') return;
    const content = editedSection.content as TableContent;
    const updatedRows = [...content.rows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [column]: value };
    setEditedSection({ ...editedSection, content: { ...content, rows: updatedRows } });
  };


  const handleDeleteRow = (rowIndex: number) => {
    if (editedSection.type !== 'table') return;
    const content = editedSection.content as TableContent;
    setEditedSection({
      ...editedSection,
      content: { ...content, rows: content.rows.filter((_, i) => i !== rowIndex) },
    });
  };


  // ── Custom Table ──────────────────────────────────────────────────────────
  const handleCustomHeaderChange = (index: number, value: string) => {
    if (editedSection.type !== 'custom-table') return;
    const content = editedSection.content as CustomTableContent;
    const newHeaders = [...content.columnHeaders];
    newHeaders[index] = value;
    setEditedSection({ ...editedSection, content: { ...content, columnHeaders: newHeaders } });
  };


  const handleAddCustomRow = () => {
    if (editedSection.type !== 'custom-table') return;
    const content = editedSection.content as CustomTableContent;
    setEditedSection({
      ...editedSection,
      content: { ...content, rows: [...content.rows, Array(content.columnCount).fill('')] },
    });
  };


  const handleUpdateCustomCell = (rowIndex: number, colIndex: number, value: string) => {
    if (editedSection.type !== 'custom-table') return;
    const content = editedSection.content as CustomTableContent;
    const updatedRows = [...content.rows];
    updatedRows[rowIndex] = updatedRows[rowIndex].map((cell, ci) =>
      ci === colIndex ? value : cell
    );
    setEditedSection({ ...editedSection, content: { ...content, rows: updatedRows } });
  };


  const handleDeleteCustomRow = (rowIndex: number) => {
    if (editedSection.type !== 'custom-table') return;
    const content = editedSection.content as CustomTableContent;
    setEditedSection({
      ...editedSection,
      content: { ...content, rows: content.rows.filter((_, i) => i !== rowIndex) },
    });
  };


  // ── Narrative ─────────────────────────────────────────────────────────────
  const handleNarrativeChange = (text: string) => {
    if (editedSection.type !== 'narrative') return;
    setEditedSection({ ...editedSection, content: { text } as NarrativeContent });
  };


  // ── Image Section ─────────────────────────────────────────────────────────
  const updateImageContent = (patch: Partial<ImageSectionContent>) => {
    const current = editedSection.content as ImageSectionContent;
    setEditedSection({ ...editedSection, content: { ...current, ...patch } });
  };



  const handleImageReasonChange = (idx: number, value: string) => {
    const current = editedSection.content as ImageSectionContent;
    const updatedImages = current.images.map((img, i) =>
      i === idx ? { ...img, reason: value } : img
    );
    setEditedSection({ ...editedSection, content: { ...current, images: updatedImages } });
  };

  const handleRemoveImage = (idx: number) => {
    const current = editedSection.content as ImageSectionContent;
    const updatedImages = current.images.filter((_, i) => i !== idx);
    setEditedSection({ ...editedSection, content: { ...current, images: updatedImages } });
  };


  // ── Legacy image handlers (for non-image sections that have section.images[]) ──
  const handleDeleteImage = (idx: number) => {
    const updatedImages = [...(editedSection.images || [])];
    updatedImages[idx] = '';
    setEditedSection({ ...editedSection, images: updatedImages });
  };


  const handleSave = () => {
    onSave(editedSection);
    onClose();
  };


  // ── Word count helper ─────────────────────────────────────────────────────
  const wordCount = (str: string) =>
    str.trim() === '' ? 0 : str.trim().split(/\s+/).length;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">


        {/* ── Modal Header ──────────────────────────────────────────────────── */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-bold text-gray-900">Edit Section</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>


        {/* ── Modal Body ────────────────────────────────────────────────────── */}
        <div className="p-6 space-y-6">


          {/* Section Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title *
            </label>
            <input
              type="text"
              value={editedSection.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter section title"
            />
          </div>


          {/* ── IMAGE SECTION ─────────────────────────────────────────────── */}
          {editedSection.type === 'image' && (() => {
            const imgContent = editedSection.content as ImageSectionContent;
            return (
              <div className="space-y-4 border border-blue-100 bg-blue-50/40 rounded-xl p-4">

                {/* ── ONE Heading Toggle for entire section ── */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Custom Image Heading</span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Show a heading above all images in this section
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={imgContent.showHeading}
                      onClick={() => updateImageContent({ showHeading: !imgContent.showHeading })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
                        imgContent.showHeading ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                          imgContent.showHeading ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                      <span
                        className={`absolute text-[9px] font-bold ${
                          imgContent.showHeading ? 'left-1.5 text-white' : 'right-1.5 text-gray-400'
                        }`}
                      >
                        {imgContent.showHeading ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>

                  {/* Heading input — visible only when ON */}
                  {imgContent.showHeading && (
                    <input
                      type="text"
                      value={imgContent.heading}
                      onChange={(e) => updateImageContent({ heading: e.target.value })}
                      placeholder="Enter section heading (e.g. Crime Scene Photographs)"
                      className="w-full px-4 py-2 border border-blue-200 bg-blue-50 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  )}
                </div>

                {/* ── Multiple Images ── */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Images</label>
                    {(imgContent.images?.length ?? 0) > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                        {imgContent.images.length}
                      </span>
                    )}
                  </div>

                  {/* Render each uploaded image */}
                  {(imgContent.images ?? []).map((img, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                    >
                      {/* Image Preview */}
                      <div className="relative bg-gray-100">
                        <img
                          src={img.url}
                          alt={img.reason || `Image ${idx + 1}`}
                          className="w-full object-cover"
                          style={{ maxHeight: 200 }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {/* Index badge */}
                        <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                          #{idx + 1}
                        </span>
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Per-image caption */}
                      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                        <input
                          type="text"
                          value={img.reason}
                          onChange={(e) => handleImageReasonChange(idx, e.target.value)}
                          placeholder='Caption e.g. "Crime Scene View"'
                          maxLength={40}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                        {(() => {
                          const wc = wordCount(img.reason);
                          if (wc > 3)
                            return (
                              <p className="text-xs text-red-500 mt-1">
                                ⚠ Keep it to 2–3 words (currently {wc})
                              </p>
                            );
                          if (wc > 0)
                            return (
                              <p className="text-xs text-green-600 mt-1">
                                ✓ {wc} word{wc > 1 ? 's' : ''}
                              </p>
                            );
                          return null;
                        })()}
                      </div>
                    </div>
                  ))}

                  

                  {/* Empty state */}
                  {(!imgContent.images || imgContent.images.length === 0) && (
                    <p className="text-xs text-gray-400 text-center pb-1">
                      No images yet. Click above to upload.
                    </p>
                  )}
                </div>

              </div>
            );
          })()}


          {/* ── CUSTOM TABLE ──────────────────────────────────────────────── */}
          {editedSection.type === 'custom-table' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Column Headers
                </label>
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${(editedSection.content as CustomTableContent).columnCount}, 1fr)`,
                  }}
                >
                  {(editedSection.content as CustomTableContent).columnHeaders.map((header, idx) => (
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
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Row
                  </button>
                </div>


                {(editedSection.content as CustomTableContent).rows.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 text-sm">No rows added yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(editedSection.content as CustomTableContent).rows.map((row, rowIndex) => (
                      <div key={rowIndex} className="bg-gray-50 p-3 rounded-lg">
                        <div
                          className="grid gap-2 mb-2"
                          style={{
                            gridTemplateColumns: `repeat(${(editedSection.content as CustomTableContent).columnCount}, 1fr)`,
                          }}
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
                          className="text-red-600 hover:bg-red-100 px-2 py-1 rounded text-xs transition-colors"
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


          {/* ── PARAMETER TABLE ───────────────────────────────────────────── */}
          {editedSection.type === 'table' && (
            <div className="space-y-3">


              {/* Custom Headings Toggle */}
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Custom Column Headings</span>
                  <p className="text-xs text-gray-400 mt-0.5">Default: "Parameter" & "Details"</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  onClick={() =>
                    setEditedSection({
                      ...editedSection,
                      content: {
                        ...(editedSection.content as TableContent),
                        useCustomHeadings: !(editedSection.content as TableContent).useCustomHeadings,
                      },
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
                    (editedSection.content as TableContent).useCustomHeadings
                      ? 'bg-blue-500'
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                      (editedSection.content as TableContent).useCustomHeadings
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                  <span
                    className={`absolute text-[9px] font-bold ${
                      (editedSection.content as TableContent).useCustomHeadings
                        ? 'left-1.5 text-white'
                        : 'right-1.5 text-gray-400'
                    }`}
                  >
                    {(editedSection.content as TableContent).useCustomHeadings ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>


              {/* Custom Label Inputs */}
              {(editedSection.content as TableContent).useCustomHeadings && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Column 1 Heading
                    </label>
                    <input
                      type="text"
                      value={(editedSection.content as TableContent).col1Label ?? ''}
                      onChange={(e) =>
                        setEditedSection({
                          ...editedSection,
                          content: {
                            ...(editedSection.content as TableContent),
                            col1Label: e.target.value,
                          },
                        })
                      }
                      placeholder="Parameter"
                      className="w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg text-sm placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Column 2 Heading
                    </label>
                    <input
                      type="text"
                      value={(editedSection.content as TableContent).col2Label ?? ''}
                      onChange={(e) =>
                        setEditedSection({
                          ...editedSection,
                          content: {
                            ...(editedSection.content as TableContent),
                            col2Label: e.target.value,
                          },
                        })
                      }
                      placeholder="Details"
                      className="w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg text-sm placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                </div>
              )}


              {/* Rows */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Table Data</label>
                <button
                  onClick={handleAddRow}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Row
                </button>
              </div>


              {(editedSection.content as TableContent).rows.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 text-sm">No rows added yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(editedSection.content as TableContent).rows.map((row, rowIndex) => (
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
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {/* ── NARRATIVE ─────────────────────────────────────────────────── */}
          {editedSection.type === 'narrative' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Content
              </label>
              <textarea
                value={(editedSection.content as NarrativeContent).text || ''}
                onChange={(e) => handleNarrativeChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your narrative text here..."
                rows={8}
              />
            </div>
          )}


          {/* ── NOTES — hidden for image sections ─────────────────────────── */}
          {editedSection.type !== 'image' && (
            <div className="border-t border-gray-200 pt-4 space-y-3">


              {/* Notes Heading */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes Heading
                  <span className="text-gray-400 font-normal ml-1 text-xs">
                    (defaults to "Note:" if left empty)
                  </span>
                </label>
                <input
                  type="text"
                  value={editedSection.notesHeading ?? ''}
                  onChange={(e) =>
                    setEditedSection({ ...editedSection, notesHeading: e.target.value })
                  }
                  placeholder="Note:"
                  className="w-full px-4 py-2 border border-amber-200 bg-amber-50 rounded-lg text-sm text-gray-700 placeholder-amber-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>


              {/* Notes Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes Content
                  <span className="text-gray-400 font-normal ml-1 text-xs">(optional)</span>
                </label>
                <textarea
                  value={editedSection.notes || ''}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-200 bg-amber-50 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm placeholder-amber-300 resize-none leading-relaxed"
                  placeholder="Enter notes for this section..."
                  rows={4}
                />
              </div>
            </div>
          )}


          {/* ── LEGACY SECTION IMAGES — hidden for image sections ─────────── */}
          {editedSection.type !== 'image' &&
            editedSection.images &&
            editedSection.images.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Section Images (
                  {editedSection.images.filter((img) => img !== '').length} /{' '}
                  {editedSection.images.length})
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {editedSection.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-blue-400 transition-colors"
                    >
                      {!img || img === '' ? (
                        <div className="flex flex-col items-center justify-center h-24 text-gray-400">
                          <p className="text-xs font-semibold text-gray-500 mb-1">
                            Image {idx + 1}
                          </p>
                          <span className="text-xs">No image</span>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={img}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleDeleteImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
                            Image {idx + 1}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>


        {/* ── Modal Footer ──────────────────────────────────────────────────── */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>


      </div>
    </div>
  );
};


export default EditModal;