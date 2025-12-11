import { Upload, Plus, Trash2 } from 'lucide-react';
import type { Section } from '../types/report.types';
import { ParameterTable } from '../form-components/ParameterTable';
import { NarrativeText } from '../form-components/NarrativeText';
import { SectionControls } from '../form-components/SectionControls';
import { CustomRowColumnTable } from '../form-components/CustomRowColumnTable'; // ADD THIS

interface SectionEditorProps {
    section: Section;
    index: number;
    totalSections: number;
    onChange: (section: Section) => void;
    onDelete: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}

export function SectionEditor({
    section,
    index,
    totalSections,
    onChange,
    onDelete,
    onMoveUp,
    onMoveDown,
}: SectionEditorProps) {
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, imageIndex: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImages = [...(section.images || [])];
                newImages[imageIndex] = reader.result as string;
                onChange({ ...section, images: newImages });
            };
            reader.readAsDataURL(file);
        }
    };

    const addImage = () => {
        const newImages = [...(section.images || []), ''];
        onChange({ ...section, images: newImages });
    };

    const removeImage = (imageIndex: number) => {
        const newImages = section.images?.filter((_: string, i: number) => i !== imageIndex) || [];
        onChange({ ...section, images: newImages });
    };

    // Custom Table Handlers
    const addColumn = () => {
        if (section.type === 'custom-table') {
            const content = section.content as any;
            onChange({
                ...section,
                content: {
                    ...content,
                    columnCount: content.columnCount + 1,
                    columnHeaders: [...content.columnHeaders, `Column ${content.columnCount + 1}`],
                    rows: content.rows.map((row: string[]) => [...row, '']),
                },
            });
        }
    };

    const addRow = () => {
        if (section.type === 'custom-table') {
            const content = section.content as any;
            onChange({
                ...section,
                content: {
                    ...content,
                    rows: [...content.rows, new Array(content.columnCount).fill('')],
                },
            });
        }
    };

    const deleteRow = (rowIndex: number) => {
        if (section.type === 'custom-table') {
            const content = section.content as any;
            onChange({
                ...section,
                content: {
                    ...content,
                    rows: content.rows.filter((_: string[], i: number) => i !== rowIndex),
                },
            });
        }
    };

    const deleteColumn = (colIndex: number) => {
        if (section.type === 'custom-table') {
            const content = section.content as any;
            onChange({
                ...section,
                content: {
                    ...content,
                    columnCount: content.columnCount - 1,
                    columnHeaders: content.columnHeaders.filter((_: string, i: number) => i !== colIndex),
                    rows: content.rows.map((row: string[]) => row.filter((_: string, i: number) => i !== colIndex)),
                },
            });
        }
    };

    const updateColumnHeader = (colIndex: number, value: string) => {
        if (section.type === 'custom-table') {
            const content = section.content as any;
            const newHeaders = [...content.columnHeaders];
            newHeaders[colIndex] = value;
            onChange({
                ...section,
                content: { ...content, columnHeaders: newHeaders },
            });
        }
    };

    const updateCell = (rowIndex: number, colIndex: number, value: string) => {
        if (section.type === 'custom-table') {
            const content = section.content as any;
            const newRows = [...content.rows];
            newRows[rowIndex][colIndex] = value;
            onChange({
                ...section,
                content: { ...content, rows: newRows },
            });
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Section {index + 1}
                </h3>
                <SectionControls
                    onDelete={onDelete}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    canMoveUp={index > 0}
                    canMoveDown={index < totalSections - 1}
                />
            </div>

            {/* Section Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title *
                </label>
                <input
                    type="text"
                    value={section.title}
                    onChange={(e) => onChange({ ...section, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Executive Summary"
                    required
                />
            </div>

            {/* Section Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Type *
                </label>
                <select
                    value={section.type}
                    onChange={(e) =>
                        onChange({
                            ...section,
                            type: e.target.value as 'table' | 'custom-table' | 'narrative',
                            content:
                                e.target.value === 'table'
                                    ? { columns: [], rows: [] }
                                    : e.target.value === 'custom-table'
                                        ? { columnCount: 2, columnHeaders: ['Column 1', 'Column 2'], rows: [['', '']] }
                                        : { text: '' },
                        })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="table">Parameter Table</option>
                    <option value="custom-table">Custom Table</option>
                    <option value="narrative">Narrative Text</option>
                </select>
            </div>

            {/* Content based on type */}
            {section.type === 'table' && (
                <ParameterTable
                    parameters={
                        (section.content as any).columns?.map((col: string) => ({
                            name: col,
                            value: (section.content as any).rows[0]?.[col] || '',
                        })) || []
                    }
                    onChange={(params: Array<{ name: string; value: string }>) => {
                        const columns = params.map((p) => p.name);
                        const rows = [
                            params.reduce((acc: Record<string, string>, p) => ({ ...acc, [p.name]: p.value }), {}),
                        ];
                        onChange({ ...section, content: { columns, rows } });
                    }}
                />
            )}

            {section.type === 'custom-table' && (
                <CustomRowColumnTable
                    columnHeaders={(section.content as any).columnHeaders}
                    rows={(section.content as any).rows}
                    onColumnHeaderChange={updateColumnHeader}
                    onCellChange={updateCell}
                    onAddColumn={addColumn}
                    onAddRow={addRow}
                    onDeleteRow={deleteRow}
                    onDeleteColumn={deleteColumn}
                />
            )}


            {section.type === 'narrative' && (
                <NarrativeText
                    text={(section.content as any).text || ''}
                    onChange={(text: string) => onChange({ ...section, content: { text } })}
                />
            )}

            {/* Images */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Section Images (Optional)
                    </label>
                    <button
                        type="button"
                        onClick={addImage}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Image
                    </button>
                </div>

                {section.images && section.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        {section.images.map((img: string, imgIdx: number) => (
                            <div key={imgIdx} className="relative">
                                {img ? (
                                    <div className="relative group">
                                        <img
                                            src={img}
                                            alt={`Section image ${imgIdx + 1}`}
                                            className="w-full h-32 object-cover border border-gray-200 rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(imgIdx)}
                                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                        <Upload className="w-8 h-8 text-gray-400" />
                                        <span className="text-sm text-gray-500 mt-2">Upload Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, imgIdx)}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
