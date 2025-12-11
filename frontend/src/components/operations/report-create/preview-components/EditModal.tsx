// components/operations/report-create/preview-components/EditModal.tsx
import { useState } from 'react';
import type { Section, TableContent, CustomTableContent, NarrativeContent } from '../types/report.types';
import { X, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface EditModalProps {
  section: Section;
  onClose: () => void;
  onSave: (section: Section) => void;
}

const EditModal = ({ section, onClose, onSave }: EditModalProps) => {
  const [editedSection, setEditedSection] = useState<Section>({ ...section });

  const handleTitleChange = (title: string) => {
    setEditedSection({ ...editedSection, title });
  };

  // Parameter Table handlers
  const handleAddRow = () => {
    if (editedSection.type === 'table') {
      const content = editedSection.content as TableContent;
      const newRow: Record<string, string> = {};
      content.columns.forEach(col => {
        newRow[col] = '';
      });
      setEditedSection({
        ...editedSection,
        content: { ...content, rows: [...content.rows, newRow] }
      });
    }
  };

  const handleUpdateRow = (rowIndex: number, column: string, value: string) => {
    if (editedSection.type === 'table') {
      const content = editedSection.content as TableContent;
      const updatedRows = [...content.rows];
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], [column]: value };
      setEditedSection({
        ...editedSection,
        content: { ...content, rows: updatedRows }
      });
    }
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (editedSection.type === 'table') {
      const content = editedSection.content as TableContent;
      const updatedRows = content.rows.filter((_, i) => i !== rowIndex);
      setEditedSection({
        ...editedSection,
        content: { ...content, rows: updatedRows }
      });
    }
  };

  // Custom Table handlers
  const handleCustomHeaderChange = (index: number, value: string) => {
    if (editedSection.type === 'custom-table') {
      const content = editedSection.content as CustomTableContent;
      const newHeaders = [...content.columnHeaders];
      newHeaders[index] = value;
      setEditedSection({
        ...editedSection,
        content: { ...content, columnHeaders: newHeaders }
      });
    }
  };

  const handleAddCustomRow = () => {
    if (editedSection.type === 'custom-table') {
      const content = editedSection.content as CustomTableContent;
      const newRow = Array(content.columnCount).fill('');
      setEditedSection({
        ...editedSection,
        content: { ...content, rows: [...content.rows, newRow] }
      });
    }
  };

  const handleUpdateCustomCell = (rowIndex: number, colIndex: number, value: string) => {
    if (editedSection.type === 'custom-table') {
      const content = editedSection.content as CustomTableContent;
      const updatedRows = [...content.rows];
      updatedRows[rowIndex][colIndex] = value;
      setEditedSection({
        ...editedSection,
        content: { ...content, rows: updatedRows }
      });
    }
  };

  const handleDeleteCustomRow = (rowIndex: number) => {
    if (editedSection.type === 'custom-table') {
      const content = editedSection.content as CustomTableContent;
      const updatedRows = content.rows.filter((_, i) => i !== rowIndex);
      setEditedSection({
        ...editedSection,
        content: { ...content, rows: updatedRows }
      });
    }
  };

  // Narrative handler
  const handleNarrativeChange = (text: string) => {
    if (editedSection.type === 'narrative') {
      setEditedSection({
        ...editedSection,
        content: { text } as NarrativeContent
      });
    }
  };

  // Image handlers
  const handleImageUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedImages = [...(editedSection.images || [])];
        updatedImages[idx] = reader.result as string;
        setEditedSection({
          ...editedSection,
          images: updatedImages
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (idx: number) => {
    const updatedImages = [...(editedSection.images || [])];
    updatedImages[idx] = '';
    setEditedSection({
      ...editedSection,
      images: updatedImages
    });
  };

  const handleSave = () => {
    onSave(editedSection);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-bold text-gray-900">Edit Section</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
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

          {/* Custom Table Content */}
          {editedSection.type === 'custom-table' && (
            <>
              {/* Column Headers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Column Headers
                </label>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${(editedSection.content as CustomTableContent).columnCount}, 1fr)` }}>
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

              {/* Custom Table Rows */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Table Rows
                  </label>
                  <button
                    onClick={handleAddCustomRow}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Row
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
                        <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `repeat(${(editedSection.content as CustomTableContent).columnCount}, 1fr)` }}>
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

          {/* Parameter Table Content */}
          {editedSection.type === 'table' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Table Data
                </label>
                <button
                  onClick={handleAddRow}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Row
                </button>
              </div>

              {(editedSection.content as TableContent).rows.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 text-sm">No rows added yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(editedSection.content as TableContent).rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-[1fr,2fr,auto] gap-3 items-start bg-gray-50 p-3 rounded-lg">
                      <div>
                        <input
                          type="text"
                          value={row['Parameter'] || ''}
                          onChange={(e) => handleUpdateRow(rowIndex, 'Parameter', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Parameter"
                        />
                      </div>
                      <div>
                        <textarea
                          value={row['Details'] || ''}
                          onChange={(e) => handleUpdateRow(rowIndex, 'Details', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Details"
                          rows={2}
                        />
                      </div>
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

          {/* Narrative Content */}
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

          {/* Images Section */}
          {editedSection.images && editedSection.images.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Section Images ({editedSection.images.filter(img => img !== '').length} / {editedSection.images.length})
              </label>
              <div className="grid grid-cols-2 gap-3">
                {editedSection.images.map((img, idx) => (
                  <div key={idx} className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-blue-400 transition-colors">
                    {!img || img === '' ? (
                      <div className="space-y-2">
                        <div className="text-center">
                          <p className="text-xs font-semibold text-gray-600 mb-2">
                            Image {idx + 1}
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(idx, e)}
                            className="hidden"
                            id={`edit-image-upload-${idx}`}
                          />
                          <label
                            htmlFor={`edit-image-upload-${idx}`}
                            className="cursor-pointer flex flex-col items-center justify-center h-24"
                          >
                            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500">
                              Click to upload
                            </span>
                          </label>
                        </div>
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

        {/* Footer */}
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
