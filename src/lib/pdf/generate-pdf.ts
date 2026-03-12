import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

/**
 * Generates a PDF by capturing each `[data-pdf-section]` child inside the
 * container independently. Sections are placed on pages respecting natural
 * boundaries — a section is never sliced across two pages.
 */
export async function generatePdf(container: HTMLElement): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const headerHeight = 22; // space reserved for the header on the first page

  // ── Header ──
  pdf.setFontSize(18);
  pdf.setTextColor(22, 163, 74);
  pdf.text('Calculadora ROI — Drones Agrícolas', margin, 15);
  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  pdf.text(
    `Reporte generado el ${new Date().toLocaleDateString('es-ES')}`,
    margin,
    21,
  );

  // ── Capture each section ──
  const sections = container.querySelectorAll<HTMLElement>('[data-pdf-section]');
  // Fallback: if no sections are annotated, capture the whole container as one
  const elements = sections.length > 0 ? Array.from(sections) : [container];

  let yOffset = headerHeight + 4; // initial Y after the header

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const maxAvailable = pageHeight - yOffset - margin;

    // If this section doesn't fit on the current page, start a new one
    if (imgHeight > maxAvailable && yOffset > headerHeight + 6) {
      pdf.addPage();
      yOffset = margin;
    }

    // If the section is still taller than a full page, scale it down to fit
    const finalMaxHeight = pageHeight - yOffset - margin;
    if (imgHeight > finalMaxHeight) {
      const scale = finalMaxHeight / imgHeight;
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;
      const xOffset = margin + (contentWidth - scaledWidth) / 2;
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);
      yOffset += scaledHeight + 4;
    } else {
      pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight);
      yOffset += imgHeight + 4;
    }
  }

  // ── Disclaimer on last page ──
  const disclaimerY = Math.min(yOffset + 2, pageHeight - 12);
  pdf.setFontSize(7);
  pdf.setTextColor(156, 163, 175);
  pdf.text(
    'Valores estimados de referencia. Los resultados reales pueden variar. Ajuste según su realidad.',
    margin,
    disclaimerY,
  );

  pdf.save('roi-drones-agricolas.pdf');
}
