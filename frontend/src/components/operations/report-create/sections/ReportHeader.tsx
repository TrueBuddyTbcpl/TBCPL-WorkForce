import { Upload } from 'lucide-react';
import type { ReportData } from '../types/report.types';

interface ReportHeaderProps {
  data: ReportData['header'];
  onChange: (header: ReportData['header']) => void;
}

export function ReportHeader({ data, onChange }: ReportHeaderProps) {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, clientLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Client Logo (Optional)
        </label>
        <div className="flex items-center gap-4">
          {data.clientLogo && (
            <img
              src={data.clientLogo}
              alt="Client Logo"
              className="h-16 object-contain border border-gray-200 rounded p-2"
            />
          )}
          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Upload Logo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Title *
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Annual Security Audit Report"
          required
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtitle
        </label>
        <input
          type="text"
          value={data.subtitle}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Comprehensive Analysis and Recommendations"
        />
      </div>

      {/* Prepared For */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prepared For *
        </label>
        <input
          type="text"
          value={data.preparedFor}
          onChange={(e) => onChange({ ...data, preparedFor: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Acme Corporation"
          required
        />
      </div>

      {/* Prepared By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prepared By *
        </label>
        <input
          type="text"
          value={data.preparedBy}
          onChange={(e) => onChange({ ...data, preparedBy: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., John Doe, Security Analyst"
          required
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Date *
        </label>
        <input
          type="date"
          value={data.date}
          onChange={(e) => onChange({ ...data, date: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
    </div>
  );
}
