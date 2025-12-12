// components/operation/report-create/sections/DynamicSection.tsx
import { useState } from 'react';
import type { Section, TableContent, CustomTableContent, NarrativeContent } from '../types/report.types';
import { Trash2, Plus, GripVertical, Link as LinkIcon, X } from 'lucide-react';

interface DynamicSectionProps {
    section: Section;
    index: number;
    onUpdate: (id: string, section: Section) => void;
    onDelete: (id: string) => void;
}

const DynamicSection = ({ section, index, onUpdate, onDelete }: DynamicSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [hasImages, setHasImages] = useState(section.images && section.images.length > 0);

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

    // Parameter Table handlers
    const handleAddRow = () => {
        if (section.type === 'table') {
            const content = section.content as TableContent;
            const newRow: Record<string, string> = {};
            content.columns.forEach(col => {
                newRow[col] = '';
            });
            onUpdate(section.id, {
                ...section,
                content: { ...content, rows: [...content.rows, newRow] }
            });
        }
    };

    const handleUpdateRow = (rowIndex: number, column: string, value: string) => {
        if (section.type === 'table') {
            const content = section.content as TableContent;
            const updatedRows = [...content.rows];
            updatedRows[rowIndex] = { ...updatedRows[rowIndex], [column]: value };
            onUpdate(section.id, {
                ...section,
                content: { ...content, rows: updatedRows }
            });
        }
    };

    const handleDeleteRow = (rowIndex: number) => {
        if (section.type === 'table') {
            const content = section.content as TableContent;
            const updatedRows = content.rows.filter((_, i) => i !== rowIndex);
            onUpdate(section.id, {
                ...section,
                content: { ...content, rows: updatedRows }
            });
        }
    };

    // Custom Table handlers
    const handleColumnCountChange = (count: number) => {
        const headers = Array(count).fill('');
        onUpdate(section.id, {
            ...section,
            content: { columnCount: count, columnHeaders: headers, rows: [] }
        });
    };

    const handleCustomHeaderChange = (index: number, value: string) => {
        if (section.type === 'custom-table') {
            const content = section.content as CustomTableContent;
            const newHeaders = [...content.columnHeaders];
            newHeaders[index] = value;
            onUpdate(section.id, {
                ...section,
                content: { ...content, columnHeaders: newHeaders }
            });
        }
    };

    const handleAddCustomRow = () => {
        if (section.type === 'custom-table') {
            const content = section.content as CustomTableContent;
            const newRow = Array(content.columnCount).fill('');
            onUpdate(section.id, {
                ...section,
                content: { ...content, rows: [...content.rows, newRow] }
            });
        }
    };

    const handleUpdateCustomCell = (rowIndex: number, colIndex: number, value: string) => {
        if (section.type === 'custom-table') {
            const content = section.content as CustomTableContent;
            const updatedRows = [...content.rows];
            updatedRows[rowIndex][colIndex] = value;
            onUpdate(section.id, {
                ...section,
                content: { ...content, rows: updatedRows }
            });
        }
    };

    const handleDeleteCustomRow = (rowIndex: number) => {
        if (section.type === 'custom-table') {
            const content = section.content as CustomTableContent;
            const updatedRows = content.rows.filter((_, i) => i !== rowIndex);
            onUpdate(section.id, {
                ...section,
                content: { ...content, rows: updatedRows }
            });
        }
    };

    // Narrative handler
    const handleNarrativeChange = (text: string) => {
        if (section.type === 'narrative') {
            onUpdate(section.id, { ...section, content: { text } });
        }
    };

    // Image Link handlers
    const handleImageLinkChange = (idx: number, link: string) => {
        const updatedImages = [...(section.images || [])];
        updatedImages[idx] = link;
        onUpdate(section.id, { ...section, images: updatedImages });
    };

    const handleDeleteImage = (idx: number) => {
        const updatedImages = section.images?.filter((_, i) => i !== idx) || [];
        onUpdate(section.id, { ...section, images: updatedImages });
    };

    return (
        <div className="border border-gray-200 rounded-lg bg-white">
            {/* Section Header */}
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

            {/* Section Content */}
            {isExpanded && (
                <div className="p-4 space-y-4">
                    {/* Section Title */}
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

                    {/* Section Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Section Type
                        </label>
                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    checked={section.type === 'table'}
                                    onChange={() => handleTypeChange('table')}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Parameter Table</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    checked={section.type === 'custom-table'}
                                    onChange={() => handleTypeChange('custom-table')}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Custom Row/Column Table</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    checked={section.type === 'narrative'}
                                    onChange={() => handleTypeChange('narrative')}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Narrative Text</span>
                            </label>
                        </div>
                    </div>

                    {/* Custom Table - Column Count Input */}
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
                                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Column Headers */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Column Headers
                                </label>
                                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${(section.content as CustomTableContent).columnCount}, 1fr)` }}>
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

                                {(section.content as CustomTableContent).rows.length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                        <p className="text-gray-500 text-sm">No rows added yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {(section.content as CustomTableContent).rows.map((row, rowIndex) => (
                                            <div key={rowIndex} className="bg-gray-50 p-3 rounded-lg">
                                                <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `repeat(${(section.content as CustomTableContent).columnCount}, 1fr)` }}>
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
                    {section.type === 'table' && (
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

                            {(section.content as TableContent).rows.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-gray-500 text-sm">No rows added yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {(section.content as TableContent).rows.map((row, rowIndex) => (
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
                    {section.type === 'narrative' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Text Content
                            </label>
                            <textarea
                                value={(section.content as any).text || ''}
                                onChange={(e) => handleNarrativeChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your narrative text here..."
                                rows={6}
                            />
                        </div>
                    )}

                    {/* Image Links Section - SIMPLIFIED */}
                    <div className="border-t border-gray-200 pt-4">
                        <label className="flex items-center gap-2 mb-3">
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
                                Attach Image Links to this section
                            </span>
                        </label>

                        {hasImages && (
                            <div className="space-y-4">
                                {/* Number of Images Input */}
                                {(!section.images || section.images.length === 0) && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            How many images do you want to add?
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            placeholder="Enter number of images"
                                            className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    const count = parseInt((e.target as HTMLInputElement).value);
                                                    if (count > 0) {
                                                        const emptyImages = Array(count).fill('');
                                                        onUpdate(section.id, {
                                                            ...section,
                                                            images: emptyImages
                                                        });
                                                    }
                                                }
                                            }}
                                            onBlur={(e) => {
                                                const count = parseInt(e.target.value);
                                                if (count > 0) {
                                                    const emptyImages = Array(count).fill('');
                                                    onUpdate(section.id, {
                                                        ...section,
                                                        images: emptyImages
                                                    });
                                                }
                                            }}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Press Enter or click outside to confirm
                                        </p>
                                    </div>
                                )}

                                {/* Image Link Input Fields */}
                                {section.images && section.images.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-gray-700">
                                                Image Links ({section.images.filter(img => img !== '').length} / {section.images.length})
                                            </label>
                                            <button
                                                onClick={() => {
                                                    onUpdate(section.id, { ...section, images: [] });
                                                }}
                                                className="text-xs text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Reset All
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {section.images.map((img, idx) => (
                                                <div key={idx} className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-shrink-0 mt-2">
                                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <LinkIcon className="w-4 h-4 text-blue-600" />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex-1 space-y-2">
                                                            <label className="block text-xs font-semibold text-gray-700">
                                                                Image {idx + 1} - Paste Link
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={img || ''}
                                                                onChange={(e) => handleImageLinkChange(idx, e.target.value)}
                                                                placeholder="Paste Google Drive link or direct image URL here"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                            {img && (
                                                                <div className="relative mt-2">
                                                                    <img
                                                                        src={img}
                                                                        alt={`Preview ${idx + 1}`}
                                                                        className="w-full h-32 object-cover rounded border border-gray-200"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100"%3E%3Crect fill="%23fee" width="200" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23c00" font-size="12"%3EInvalid Image URL%3C/text%3E%3C/svg%3E';
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                            <p className="text-xs text-blue-600">
                                                                💡 For Google Drive: Right-click image → Get link → Change to "Anyone with the link"
                                                            </p>
                                                        </div>

                                                        <button
                                                            onClick={() => handleDeleteImage(idx)}
                                                            className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete this image"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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
