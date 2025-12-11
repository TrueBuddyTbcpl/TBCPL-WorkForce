import type { ReportData } from '../types/report.types';

interface PreviewHeaderProps {
  header: ReportData['header'];
}

export function PreviewHeader({ header }: PreviewHeaderProps) {
  return (
    <div className="text-center space-y-8">
      {/* Client Logo */}
      {header.clientLogo && (
        <div className="flex justify-center">
          <img
            src={header.clientLogo}
            alt="Client Logo"
            className="h-24 object-contain"
          />
        </div>
      )}

      {/* Title */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          {header.title}
        </h1>
        <p className="text-xl text-gray-600">
          {header.subtitle}
        </p>
      </div>

      {/* Bottom Info */}
      <div className="border-t border-gray-300 pt-6 mt-12">
        <div className="grid grid-cols-3 gap-8 text-left">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Prepared For
            </p>
            <p className="text-sm text-gray-900 font-medium">
              {header.preparedFor}
            </p>
          </div>
          
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Date
            </p>
            <p className="text-sm text-gray-900 font-medium">
              {new Date(header.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Prepared By
            </p>
            <p className="text-sm text-gray-900 font-medium">
              {header.preparedBy}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
