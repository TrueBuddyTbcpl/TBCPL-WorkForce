interface PreviewTableProps {
  data: {
    columns: string[];
    rows: Record<string, any>[];
  };
}

export function PreviewTable({ data }: PreviewTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {data.columns.map((column, idx) => (
              <th
                key={idx}
                className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIdx) => (
            <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {data.columns.map((column, cellIdx) => (
                <td
                  key={cellIdx}
                  className="border border-gray-300 px-4 py-2 text-sm text-gray-700"
                >
                  {row[column] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
