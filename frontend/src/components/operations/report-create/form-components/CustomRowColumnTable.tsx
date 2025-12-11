import { Plus, Trash2 } from 'lucide-react';

interface CustomRowColumnTableProps {
  columnHeaders: string[];
  rows: string[][];
  onColumnHeaderChange: (index: number, value: string) => void;
  onCellChange: (rowIndex: number, colIndex: number, value: string) => void;
  onAddColumn: () => void;
  onAddRow: () => void;
  onDeleteRow?: (rowIndex: number) => void;
  onDeleteColumn?: (colIndex: number) => void;
}

export function CustomRowColumnTable({
  columnHeaders,
  rows,
  onColumnHeaderChange,
  onCellChange,
  onAddColumn,
  onAddRow,
  onDeleteRow,
  onDeleteColumn,
}: CustomRowColumnTableProps) {
  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onAddColumn}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Column
        </button>
        <button
          type="button"
          onClick={onAddRow}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Row
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {columnHeaders.map((header, colIndex) => (
                <th key={colIndex} className="border-r border-gray-300 p-2 relative group">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => onColumnHeaderChange(colIndex, e.target.value)}
                      className="flex-1 px-2 py-1 text-sm font-semibold border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded"
                      placeholder={`Column ${colIndex + 1}`}
                    />
                    {onDeleteColumn && columnHeaders.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteColumn(colIndex)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:bg-red-50 rounded transition-opacity"
                        title="Delete Column"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              {onDeleteRow && (
                <th className="bg-gray-100 w-12"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border-r border-t border-gray-300 p-2">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => onCellChange(rowIndex, colIndex, e.target.value)}
                      className="w-full px-2 py-1 text-sm border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded"
                      placeholder="Enter value"
                    />
                  </td>
                ))}
                {onDeleteRow && (
                  <td className="border-t border-gray-300 p-2 text-center">
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteRow(rowIndex)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Delete Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No rows added yet. Click "Add Row" to start.
        </div>
      )}
    </div>
  );
}
