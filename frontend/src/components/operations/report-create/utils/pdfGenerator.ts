// utils/pdfGenerator.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async () => {
  try {
    // Find all A4 pages in the preview
    const pages = document.querySelectorAll('[data-pdf-page]');
    
    if (pages.length === 0) {
      alert('No pages found to generate PDF');
      return;
    }

    // Create PDF instance - A4 size
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();

    // Convert each page to canvas and add to PDF
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;

      // Capture the page as canvas
      const canvas = await html2canvas(page, {
        scale: 2, // Higher quality
        useCORS: true, // For images from other domains
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit A4
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add new page if not first page
      if (i > 0) {
        pdf.addPage();
      }

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    }

    // Generate filename
    const fileName = `Report_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Save PDF
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
