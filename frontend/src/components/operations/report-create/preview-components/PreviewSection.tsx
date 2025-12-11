import type { Section } from '../types/report.types';
import { PreviewTable } from './PreviewTable';

interface PreviewSectionProps {
  section: Section;
  index: number;
}

export function PreviewSection({ section, index }: PreviewSectionProps) {
  return (
    <div className="space-y-4">
      {/* Section Title */}
      <div className="border-b-2 border-blue-600 pb-2">
        <h2 className="text-xl font-bold text-gray-900">
          {index + 1}) {section.title}
        </h2>
      </div>

      {/* Section Content */}
      <div className="space-y-4">
        {section.type === 'table' && (
          <PreviewTable data={section.content as any} />
        )}

        {section.type === 'custom-table' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {(section.content as any).columnHeaders.map((header: string, idx: number) => (
                    <th
                      key={idx}
                      className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(section.content as any).rows.map((row: string[], rowIdx: number) => (
                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell: string, cellIdx: number) => (
                      <td
                        key={cellIdx}
                        className="border border-gray-300 px-4 py-2 text-sm text-gray-700"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {section.type === 'narrative' && (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {(section.content as any).text}
            </p>
          </div>
        )}

        {/* Section Images */}
        {section.images && section.images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {section.images
              .filter((img: string) => img && img !== '')
              .map((img: string, imgIdx: number) => (
                <div key={imgIdx} className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt={`Section image ${imgIdx + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
