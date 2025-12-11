// Update the interface and component
import { useState } from 'react';
import type { ReportData, Section } from './types/report.types';
import { FileDown, Edit, ArrowLeft, FileText, Building2, Award, Shield, Users, Calendar, Briefcase, CheckCircle2, BookOpen, List, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { format } from 'date-fns';
import EditModal from './preview-components/EditModal';
import { generatePDF } from './utils/pdfGenerator';

interface ReportPreviewProps {
    data: ReportData;
    onEdit: () => void;
    onUpdate: (updatedData: ReportData) => void; // Add this
}

const ReportPreview = ({ data, onEdit, onUpdate }: ReportPreviewProps) => {
    const [editingSection, setEditingSection] = useState<Section | null>(null);

    const handleGeneratePDF = async () => {
        try {
            // Show loading message
            const generateButton = document.querySelector('button[data-generate-pdf]') as HTMLButtonElement;

            if (generateButton) {
                generateButton.disabled = true;
                const originalContent = generateButton.innerHTML;
                generateButton.innerHTML = `
        <svg class="animate-spin w-5 h-5 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating PDF...
      `;

                await generatePDF();

                generateButton.disabled = false;
                generateButton.innerHTML = originalContent;
            } else {
                await generatePDF();
            }

        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Error generating PDF. Please try again.');
        }
    };


    const handleSectionEdit = (section: Section) => {
        setEditingSection(section);
    };

    const handleCloseEdit = () => {
        setEditingSection(null);
    };

    const handleSectionUpdate = (updatedSection: Section) => {
        // Update the section in the data
        const updatedSections = data.sections.map(s =>
            s.id === updatedSection.id ? updatedSection : s
        );

        // Create updated data with new sections and regenerated TOC
        const updatedData: ReportData = {
            ...data,
            sections: updatedSections,
            tableOfContents: updatedSections.map(s => s.title).filter(title => title.trim() !== '')
        };

        // Update parent state
        onUpdate(updatedData);

        // Close modal
        handleCloseEdit();
    };

    // Rest of your component stays the same...



    // A4 page dimensions
    const pageStyle = {
        width: '210mm',
        height: '297mm',
        margin: '0 auto',
        padding: '40px',
        backgroundColor: 'white',
        marginBottom: '50px',
    };

    return (
        <div className="min-h-screen bg-white py-8 relative">
            {/* Decorative Background Elements - Only on sides */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* LEFT SIDE decorations */}
                <div className="absolute top-20 left-10 w-40 h-40 bg-sky-200 rounded-3xl opacity-40 transform rotate-12"></div>
                <div className="absolute top-1/2 left-5 w-2 h-64 bg-gradient-to-b from-sky-400 via-blue-400 to-transparent opacity-40 rounded-full"></div>
                <div className="absolute bottom-32 left-16 w-24 h-24 bg-blue-200 rounded-2xl opacity-35 transform -rotate-6"></div>

                {/* RIGHT SIDE decorations */}
                <div className="absolute top-40 right-10 w-36 h-36 bg-sky-200 rounded-3xl opacity-40 transform -rotate-12"></div>
                <div className="absolute top-2/3 right-8 w-2 h-72 bg-gradient-to-b from-blue-400 via-sky-400 to-transparent opacity-40 rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-200 rounded-2xl opacity-35 transform rotate-12"></div>

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300 opacity-50"></div>
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300 opacity-50"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 relative z-10">
                {/* Action Bar */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-6 flex items-center justify-between sticky top-4 z-50">
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Edit
                    </button>
                    <button
                        data-generate-pdf
                        onClick={handleGeneratePDF}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <FileDown className="w-5 h-5" />
                        Generate PDF
                    </button>

                </div>

                {/* PAGE 1: COVER PAGE - Modern Design with Icons */}
                <div data-pdf-page style={pageStyle} className="shadow-lg border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-blue-50">
                    <div className="h-full flex flex-col justify-between">

                        {/* TOP - Report Title with Icon Banner */}
                        <div className="pt-12">
                            {/* Title Card */}
                            <div className="bg-white rounded-xl shadow-lg border-l-4 border-blue-600 p-6 mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-600 p-3 rounded-lg">
                                        <FileText className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                                            {data.header.title}
                                        </h1>
                                        <p className="text-lg text-gray-600">
                                            {data.header.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MIDDLE - Client Logo with Diamond Frame */}
                        <div className="flex items-center justify-center my-6">
                            <div className="relative">
                                {/* Diamond Background */}
                                <div className="absolute inset-0 transform rotate-45 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl -m-4"></div>

                                {/* Logo Container */}
                                <div className="relative bg-white rounded-xl shadow-xl p-8 border border-gray-200">
                                    {data.header.clientLogo ? (
                                        <img
                                            src={data.header.clientLogo}
                                            alt="Client Logo"
                                            className="h-28 w-auto relative z-10"
                                        />
                                    ) : (
                                        <div className="h-28 w-28 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                                            <Building2 className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Corner Icons */}
                                <div className="absolute -top-3 -right-3 bg-blue-600 rounded-full p-2">
                                    <Award className="w-4 h-4 text-white" />
                                </div>
                                <div className="absolute -bottom-3 -left-3 bg-blue-600 rounded-full p-2">
                                    <Shield className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM - Report Details with Icon Cards */}
                        <div className="pb-8">
                            {/* Info Cards Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {/* Prepared For Card */}
                                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <Users className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-500 uppercase">
                                            Prepared for
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-900 font-semibold ml-11">
                                        {data.header.preparedFor}
                                    </p>
                                </div>

                                {/* Date Card */}
                                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <Calendar className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-500 uppercase">
                                            Date
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-900 font-semibold ml-11">
                                        {format(new Date(data.header.date), 'dd MMM yyyy')}
                                    </p>
                                </div>
                            </div>

                            {/* Prepared By Card - Full Width */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-lg p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-white p-2 rounded-lg">
                                        <Briefcase className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <p className="text-xs font-bold text-blue-100 uppercase">
                                        Prepared by
                                    </p>
                                </div>
                                <p className="text-base text-white font-bold ml-11">
                                    {data.header.preparedBy}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PAGE 2: TABLE OF CONTENTS - Modern Design with Icons */}
                <div data-pdf-page style={pageStyle} className="shadow-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50">
                    <div className="h-full flex flex-col">

                        {/* Header with Icon */}
                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-3 rounded-xl shadow-lg">
                                    <BookOpen className="w-7 h-7 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    TABLE OF CONTENTS
                                </h2>
                            </div>
                            <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent rounded-full"></div>
                        </div>

                        {/* TOC Items */}
                        <div className="flex-1 space-y-3">
                            {data.tableOfContents.length === 0 ? (
                                <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl">
                                    <div className="text-center">
                                        <List className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500 italic">No sections added</p>
                                    </div>
                                </div>
                            ) : (
                                data.tableOfContents.map((item, index) => (
                                    <div
                                        key={index}
                                        className="group bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                {/* Number Badge */}
                                                <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold rounded-lg w-10 h-10 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                    {index + 1}
                                                </div>

                                                {/* Section Name */}
                                                <span className="text-gray-800 font-medium group-hover:text-blue-700 transition-colors flex-1">
                                                    {item}
                                                </span>
                                            </div>

                                            {/* Page Number with Icon */}
                                            <div className="flex items-center gap-2 text-gray-500 group-hover:text-blue-600 transition-colors">
                                                <FileText className="w-4 h-4" />
                                                <span className="text-sm font-semibold">
                                                    Page {index + 3}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Decoration */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-center gap-2">
                                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-full shadow-md">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-xs font-semibold">
                                        {data.tableOfContents.length} Sections
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* PAGES 3+: CONTENT PAGES */}
                {data.sections.length > 0 && (
                    <div data-pdf-page style={pageStyle} className="shadow-lg border border-gray-200">
                        <div className="space-y-8">
                            {data.sections.map((section, index) => (
                                <div key={section.id}>
                                    {/* Section Header */}
                                    <div className="flex items-start justify-between mb-4 pb-3 border-b-2 border-gray-400">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {index + 1}) {section.title}
                                        </h3>
                                        <button
                                            onClick={() => handleSectionEdit(section)}
                                            className="flex items-center gap-2 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs whitespace-nowrap"
                                        >
                                            <Edit className="w-3 h-3" />
                                            Edit
                                        </button>
                                    </div>

                                    {/* Section Content */}
                                    {/* Section Content */}
                                    <div className="mb-6">
                                        {/* Custom Table Content */}
                                        {section.type === 'custom-table' && (
                                            <div className="overflow-hidden border border-gray-300 rounded">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            {(section.content as any).columnHeaders.map(
                                                                (header: string, i: number) => (
                                                                    <th
                                                                        key={i}
                                                                        className="px-4 py-3 text-left font-bold text-gray-700 border-b border-gray-300"
                                                                    >
                                                                        {header}
                                                                    </th>
                                                                )
                                                            )}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {(section.content as any).rows.map(
                                                            (row: string[], rowIndex: number) => (
                                                                <tr key={rowIndex}>
                                                                    {row.map((cell: string, colIndex: number) => (
                                                                        <td
                                                                            key={colIndex}
                                                                            className="px-4 py-3 text-gray-700"
                                                                        >
                                                                            {cell}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {/* Table Content */}
                                        {section.type === 'table' && (
                                            <div className="overflow-hidden border border-gray-300 rounded">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            {(section.content as any).columns.map(
                                                                (col: string, i: number) => (
                                                                    <th
                                                                        key={i}
                                                                        className="px-4 py-3 text-left font-bold text-gray-700 border-b border-gray-300"
                                                                    >
                                                                        {col}
                                                                    </th>
                                                                )
                                                            )}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {(section.content as any).rows.map(
                                                            (row: any, rowIndex: number) => (
                                                                <tr key={rowIndex}>
                                                                    {(section.content as any).columns.map(
                                                                        (col: string, colIndex: number) => (
                                                                            <td
                                                                                key={colIndex}
                                                                                className="px-4 py-3 text-gray-700"
                                                                            >
                                                                                {row[col]}
                                                                            </td>
                                                                        )
                                                                    )}
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {/* Narrative Content */}
                                        {section.type === 'narrative' && (
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                {(section.content as any).text}
                                            </p>
                                        )}

                                        {/* Section Images */}
                                        {section.images && section.images.length > 0 && (
                                            <div className="mt-6">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                                    Attached Images:
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {section.images.map((img, idx) => (
                                                        <div key={idx} className="border border-gray-300 rounded-lg overflow-hidden">
                                                            <img
                                                                src={img}
                                                                alt={`Section image ${idx + 1}`}
                                                                className="w-full h-auto object-contain"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* LAST PAGE: END OF REPORT - Modern Design with Icons */}
                <div data-pdf-page style={pageStyle} className="shadow-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50">
                    <div className="h-full flex flex-col justify-between">

                        {/* Content */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                {/* Success Icon with Animation Effect */}
                                <div className="inline-flex items-center justify-center mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-75"></div>
                                        <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full p-6 shadow-xl">
                                            <CheckCircle className="w-12 h-12 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                    End of Report
                                </h3>

                                {/* Divider */}
                                <div className="flex items-center justify-center gap-2 mb-6">
                                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-600"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-blue-600"></div>
                                </div>

                                {/* Document Info Card */}
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 inline-block">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-100 p-3 rounded-lg">
                                            <Calendar className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                                Document Created
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {format(new Date(), 'dd MMM yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Report Stats (Optional) */}
                                <div className="mt-8 flex items-center justify-center gap-4">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-semibold text-blue-700">
                                            {data.sections.length} Sections
                                        </span>
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-green-600" />
                                        <span className="text-xs font-semibold text-green-700">
                                            Verified
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Disclaimer Section */}
                        <div className="border-t-2 border-gray-300 pt-6">
                            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="bg-amber-500 p-2 rounded-lg flex-shrink-0 mt-0.5">
                                        <AlertCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-amber-900 mb-2 uppercase">
                                            Disclaimer
                                        </p>
                                        <p className="text-xs text-gray-700 leading-relaxed">
                                            Our reports and comments are confidential in nature and not intended for general circulation or publication. Client shall have no authority to modify our findings. We disclaim all responsibility for any costs, damages, losses incurred by circulation or use of our reports contrary to the provisions hereof.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Branding */}
                            <div className="mt-6 flex items-center justify-center gap-3 text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <span className="text-xs font-semibold">{data.header.preparedBy}</span>
                                </div>
                                <span className="text-xs">•</span>
                                <div className="flex items-center gap-2">
                                    <Lock className="w-3 h-3" />
                                    <span className="text-xs font-semibold">Confidential</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Edit Modal */}
            {editingSection && (
                <EditModal
                    section={editingSection}
                    onClose={handleCloseEdit}
                    onSave={handleSectionUpdate}
                />
            )}
        </div>
    );
};

export default ReportPreview;
