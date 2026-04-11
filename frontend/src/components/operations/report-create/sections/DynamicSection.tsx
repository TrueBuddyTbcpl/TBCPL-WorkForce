import { useState } from 'react';
import type {
  Section,
  TableContent,
  CustomTableContent,
  NarrativeContent,
} from '../types/report.types';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface DynamicSectionProps {
  section: Section;
  index: number;
  caseId: number | null;
  onUpdate: (id: string, section: Section) => void;
  onDelete: (id: string) => void;
}

const DynamicSection = ({ section, index, onUpdate, onDelete }: DynamicSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleTitleChange = (title: string) => onUpdate(section.id, { ...section, title });

  const handleTypeChange = (type: 'table' | 'narrative' | 'custom-table') => {
    let newContent: TableContent | NarrativeContent | CustomTableContent;

    if (type === 'table') newContent = { columns: ['Parameter', 'Details'], rows: [] };
    else if (type === 'narrative') newContent = { text: '' };
    else newContent = { columnCount: 2, columnHeaders: ['', ''], rows: [] };

    onUpdate(section.id, { ...section, type, content: newContent });
  };

  const handleAddRow = () => {
    if (section.type !== 'table') return;
    const content = section.content as TableContent;
    const newRow: Record<string, string> = {};
    content.columns.forEach((col) => {
      newRow[col] = '';
    });
    onUpdate(section.id, { ...section, content: { ...content, rows: [...content.rows, newRow] } });
  };

  const handleUpdateRow = (rowIndex: number, column: string, value: string) => {
    if (section.type !== 'table') return;
    const content = section.content as TableContent;
    const updatedRows = [...content.rows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [column]: value };
    onUpdate(section.id, { ...section, content: { ...content, rows: updatedRows } });
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (section.type !== 'table') return;
    const content = section.content as TableContent;
    onUpdate(section.id, {
      ...section,
      content: { ...content, rows: content.rows.filter((_, i) => i !== rowIndex) },
    });
  };

  const handleColumnCountChange = (count: number) =>
    onUpdate(section.id, {
      ...section,
      content: { columnCount: count, columnHeaders: Array(count).fill(''), rows: [] },
    });

  const handleCustomHeaderChange = (idx: number, value: string) => {
    if (section.type !== 'custom-table') return;
    const content = section.content as CustomTableContent;
    const newHeaders = [...content.columnHeaders];
    newHeaders[idx] = value;
    onUpdate(section.id, { ...section, content: { ...content, columnHeaders: newHeaders } });
  };

  const handleAddCustomRow = () => {
    if (section.type !== 'custom-table') return;
    const content = section.content as CustomTableContent;
    onUpdate(section.id, {
      ...section,
      content: { ...content, rows: [...content.rows, Array(content.columnCount).fill('')] },
    });
  };

  const handleUpdateCustomCell = (rowIndex: number, colIndex: number, value: string) => {
    if (section.type !== 'custom-table') return;
    const content = section.content as CustomTableContent;
    const updatedRows = content.rows.map((row, ri) =>
      ri === rowIndex ? row.map((cell, ci) => (ci === colIndex ? value : cell)) : row
    );
    onUpdate(section.id, { ...section, content: { ...content, rows: updatedRows } });
  };

  const handleDeleteCustomRow = (rowIndex: number) => {
    if (section.type !== 'custom-table') return;
    const content = section.content as CustomTableContent;
    onUpdate(section.id, {
      ...section,
      content: { ...content, rows: content.rows.filter((_, i) => i !== rowIndex) },
    });
  };

  const handleNarrativeChange = (text: string) => {
    if (section.type !== 'narrative') return;
    onUpdate(section.id, { ...section, content: { text } });
  };

  const sectionTypes = [
    { value: 'table' as const, label: 'Parameter Table' },
    { value: 'custom-table' as const, label: 'Custom Row/Column Table' },
    { value: 'narrative' as const, label: 'Narrative Text' },
  ];

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
          <span className="font-medium text-gray-700">Section {index + 1}</span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
        <button
          type="button"
          onClick={() => onDelete(section.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
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

          {section.type === 'custom-table' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Columns
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={(section.content as CustomTableContent).columnCount}
                  onChange={(e) => handleColumnCountChange(parseInt(e.target.value) || 2)}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {(section.content as CustomTableContent).columnCount === 1 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Show Column Heading</span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Toggle heading visibility in preview
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      onClick={() =>
                        onUpdate(section.id, {
                          ...section,
                          content: {
                            ...(section.content as CustomTableContent),
                            showSingleColumnHeader: !(
                              section.content as CustomTableContent
                            ).showSingleColumnHeader,
                          },
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        (section.content as CustomTableContent).showSingleColumnHeader
                          ? 'bg-blue-500'
                          : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                          (section.content as CustomTableContent).showSingleColumnHeader
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`}
                      />
                      <span
                        className={`absolute text-[9px] font-bold ${
                          (section.content as CustomTableContent).showSingleColumnHeader
                            ? 'left-1.5 text-white'
                            : 'right-1.5 text-gray-400'
                        }`}
                      >
                        {(section.content as CustomTableContent).showSingleColumnHeader ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>

                  {(section.content as CustomTableContent).showSingleColumnHeader && (
                    <input
                      type="text"
                      value={(section.content as CustomTableContent).columnHeaders[0] ?? ''}
                      onChange={(e) => handleCustomHeaderChange(0, e.target.value)}
                      placeholder="Enter column heading"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Column Headers
                  </label>
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${(section.content as CustomTableContent).columnCount}, 1fr)`,
                    }}
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
              )}

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Table Rows</label>
                <button
                  type="button"
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
                        style={{
                          gridTemplateColumns: `repeat(${(section.content as CustomTableContent).columnCount}, 1fr)`,
                        }}
                      >
                        {row.map((cell, colIndex) => (
                          <input
                            key={colIndex}
                            type="text"
                            value={cell}
                            onChange={(e) =>
                              handleUpdateCustomCell(rowIndex, colIndex, e.target.value)
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder={`Data ${colIndex + 1}`}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
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
          )}

          {section.type === 'table' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Custom Column Headings</span>
                  <p className="text-xs text-gray-400 mt-0.5">Default: "Parameter" & "Details"</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  onClick={() =>
                    onUpdate(section.id, {
                      ...section,
                      content: {
                        ...(section.content as TableContent),
                        useCustomHeadings: !(section.content as TableContent).useCustomHeadings,
                      },
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    (section.content as TableContent).useCustomHeadings
                      ? 'bg-blue-500'
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                      (section.content as TableContent).useCustomHeadings
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                  <span
                    className={`absolute text-[9px] font-bold ${
                      (section.content as TableContent).useCustomHeadings
                        ? 'left-1.5 text-white'
                        : 'right-1.5 text-gray-400'
                    }`}
                  >
                    {(section.content as TableContent).useCustomHeadings ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>

              {(section.content as TableContent).useCustomHeadings && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Column 1 Heading
                    </label>
                    <input
                      type="text"
                      value={(section.content as TableContent).col1Label ?? ''}
                      onChange={(e) =>
                        onUpdate(section.id, {
                          ...section,
                          content: { ...(section.content as TableContent), col1Label: e.target.value },
                        })
                      }
                      placeholder="Parameter"
                      className="w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg text-sm placeholder-blue-300 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Column 2 Heading
                    </label>
                    <input
                      type="text"
                      value={(section.content as TableContent).col2Label ?? ''}
                      onChange={(e) =>
                        onUpdate(section.id, {
                          ...section,
                          content: { ...(section.content as TableContent), col2Label: e.target.value },
                        })
                      }
                      placeholder="Details"
                      className="w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg text-sm placeholder-blue-300 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Table Data</label>
                <button
                  type="button"
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
                        type="button"
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

          {section.type === 'narrative' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
              <textarea
                value={(section.content as NarrativeContent).text || ''}
                onChange={(e) => handleNarrativeChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your narrative text here..."
                rows={6}
              />
            </div>
          )}

          {section.type !== 'image' && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Notes</span>
                  <p className="text-xs text-gray-400 mt-0.5">Add additional context for this section</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!section.notes}
                  onClick={() => onUpdate(section.id, { ...section, notes: section.notes ? '' : ' ', notesHeading: '' })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    section.notes ? 'bg-amber-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                      section.notes ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                  <span
                    className={`absolute text-[9px] font-bold ${
                      section.notes ? 'left-1.5 text-white' : 'right-1.5 text-gray-400'
                    }`}
                  >
                    {section.notes ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>

              {section.notes && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">
                      Notes Heading
                      <span className="text-gray-400 font-normal ml-1">
                        (defaults to "Note:" if left empty)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={section.notesHeading ?? ''}
                      onChange={(e) => onUpdate(section.id, { ...section, notesHeading: e.target.value })}
                      placeholder="Note:"
                      className="w-full px-4 py-2 border border-amber-200 bg-amber-50 rounded-lg text-sm focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-700 mb-1">
                      Notes Content
                    </label>
                    <textarea
                      value={section.notes ?? ''}
                      onChange={(e) => onUpdate(section.id, { ...section, notes: e.target.value })}
                      placeholder="Add notes, observations or additional context..."
                      rows={3}
                      className="w-full px-4 py-3 border border-amber-200 bg-amber-50 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicSection;