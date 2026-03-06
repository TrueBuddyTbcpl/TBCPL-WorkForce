// utils/pdfGenerator.ts

export const generatePDF = async (): Promise<boolean> => {
  try {
    // ✅ Inject print-only CSS styles into the page
    const styleId = 'pdf-print-style';
    let style = document.getElementById(styleId) as HTMLStyleElement;

    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.innerHTML = `
      @media print {
        /* ✅ Hide everything except report pages */
        body > * {
          display: none !important;
        }

        /* ✅ Show only the report wrapper */
        body > div.print-root {
          display: block !important;
        }

        /* ✅ Hide sticky action bar */
        .sticky {
          display: none !important;
        }

        /* ✅ Hide decorative background */
        .fixed.inset-0 {
          display: none !important;
        }

        /* ✅ Hide edit buttons */
        [data-pdf-page] button {
          display: none !important;
        }

        /* ✅ Each data-pdf-page starts on a new print page */
        [data-pdf-page] {
          page-break-after: always !important;
          break-after: page !important;
          margin: 0 !important;
          box-shadow: none !important;
          border: none !important;
          width: 210mm !important;
          min-height: 297mm !important;
        }

        /* ✅ Last page - no extra break */
        [data-pdf-page]:last-of-type {
          page-break-after: avoid !important;
          break-after: avoid !important;
        }

        /* ✅ Page setup */
        @page {
          size: A4 portrait;
          margin: 0;
        }

        /* ✅ Images never break across pages */
        img {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          max-width: 100% !important;
        }

        /* ✅ Tables never break across pages */
        table {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* ✅ Section image containers never break */
        .section-image-block {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
      }
    `;

    // ✅ Mark root div for print targeting
    const rootDiv = document.querySelector('.min-h-screen') as HTMLElement;
    if (rootDiv) rootDiv.classList.add('print-root');

    // ✅ Trigger browser print dialog (user saves as PDF)
    window.print();

    return true;

  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Failed to generate PDF. Please try again.');
    return false;
  }
};
