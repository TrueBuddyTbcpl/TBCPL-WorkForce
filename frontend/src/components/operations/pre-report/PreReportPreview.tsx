import React, { useState, useEffect } from 'react';
import { X, Download, Loader2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { PreReportPDFData } from '../../../utils/preReportPdfExport';

// @ts-ignore
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;

interface PreReportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: PreReportPDFData;
  docDefinition: any; // The pdfmake document definition
}

const PreReportPreview: React.FC<PreReportPreviewProps> = ({
  isOpen,
  onClose,
  data,
  docDefinition,
}) => {
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && docDefinition) {
      generatePreview();
    }
    
    return () => {
      if (pdfDataUrl) {
        URL.revokeObjectURL(pdfDataUrl);
      }
    };
  }, [isOpen, docDefinition]);

  const generatePreview = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const pdfDocGenerator = pdfMake.createPdf(docDefinition);

      pdfDocGenerator.getDataUrl((dataUrl: string) => {
        setPdfDataUrl(dataUrl);
        setIsLoading(false);
      });
    } catch (err) {
      console.error('Preview generation error:', err);
      setError('Failed to generate preview. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const fileName = `PreReport_${data.reportId}_${new Date().getTime()}.pdf`;
    pdfMake.createPdf(docDefinition).download(fileName);
  };

  const handlePrint = () => {
    pdfMake.createPdf(docDefinition).print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="flex items-center justify-center min-h-full p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">PDF Preview</h2>
                  <p className="text-sm text-gray-600">
                    {data.reportId} - {data.leadType === 'CLIENT_LEAD' ? 'Client Lead' : 'TrueBuddy Lead'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  disabled={isLoading || !!error}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Print
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isLoading || !!error}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden bg-gray-100 p-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                  <p className="text-gray-600 font-medium">Generating preview...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-red-600 font-semibold mb-2">Error</p>
                  <p className="text-gray-600 text-center max-w-md">{error}</p>
                  <button
                    onClick={generatePreview}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : pdfDataUrl ? (
                <div className="h-full flex flex-col">
                  {/* PDF Viewer */}
                  <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
                    <iframe
                      src={`${pdfDataUrl}#view=FitH`}
                      className="w-full h-full border-0"
                      title="PDF Preview"
                    />
                  </div>

                  {/* Page Navigation (Optional - if you want manual controls) */}
                  <div className="mt-3 flex items-center justify-center gap-4 text-sm text-gray-600">
                    <span>Scroll to navigate through pages</span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer Info */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-4">
                  <span>
                    <strong>Client:</strong> {data.clientName}
                  </span>
                  <span>
                    <strong>Created:</strong> {new Date(data.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Preview Mode - Use Download button to save PDF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreReportPreview;
