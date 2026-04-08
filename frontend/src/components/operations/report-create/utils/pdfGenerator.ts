export const generatePDF = async (): Promise<boolean> => {
  try {
    const styleId = 'pdf-print-style';
    let style = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.innerHTML = `
      @page {
        size: A4 portrait;
        margin: 8mm;
      }

      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        body * {
          visibility: hidden !important;
        }

        .report-preview-root,
        .report-preview-root * {
          visibility: visible !important;
        }

        .report-preview-root {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
        }

        .sticky,
        [data-no-print="true"],
        .fixed.inset-0 {
          display: none !important;
        }

        [data-pdf-page],
        [data-pdf-flow] {
          width: 100% !important;
          margin: 0 !important;
          padding: 16px 24px !important;
          background: #fff !important;
          box-shadow: none !important;
          border: none !important;
        }

        /* Height = 297mm - 8mm top - 8mm bottom = 281mm */
        [data-pdf-page] {
          height: calc(297mm - 16mm) !important;
          min-height: calc(297mm - 16mm) !important;
          page-break-after: always !important;
          break-after: page !important;
          overflow: hidden !important;
        }

        [data-pdf-page]:last-of-type {
          page-break-after: auto !important;
          break-after: auto !important;
        }

        [data-pdf-flow] {
          height: auto !important;
          min-height: auto !important;
          page-break-before: always !important;
          break-before: page !important;
        }

        .report-section {
          margin-bottom: 20px !important;
          page-break-inside: auto !important;
          break-inside: auto !important;
        }

        .report-section-header,
        .report-table-wrap,
        table,
        tr,
        td,
        th {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /*
         * Each individual image card (box + image + label) must stay together.
         * If it doesn't fit on the current page, the WHOLE card moves to next page.
         * This prevents the box from stretching while image jumps to next page.
         */
        .section-image-card {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          overflow: hidden !important;
        }

        /*
         * The image grid itself can break between rows,
         * but each card within a row stays intact.
         */
        .section-image-grid {
          page-break-inside: auto !important;
          break-inside: auto !important;
        }

        p, li {
          orphans: 3;
          widows: 3;
        }

        img {
          max-width: 100% !important;
          height: auto !important;
        }
      }
    `;

    const rootDiv = document.querySelector('.report-preview-root') as HTMLElement | null;

    if (!rootDiv) {
      throw new Error('Report preview root not found');
    }

    window.print();
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Failed to generate PDF. Please try again.');
    return false;
  }
};