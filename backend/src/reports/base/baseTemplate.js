const PDFDocument = require('pdfkit');
const PDFFooter = require('../components/footer');
const pdfStyles = require('../styles/pdfStyles');

/**
 * Clase base para todas las plantillas de reportes PDF
 *
 * Centraliza la infraestructura común:
 *   - Inicialización del documento
 *   - Control de saltos de página
 *   - Renderizado del footer en la última página
 *   - Finalización y obtención del buffer
 *
 * Las subclases solo deben implementar el contenido específico del reporte.
 *
 * @example
 *   class MiReporteTemplate extends BaseReportTemplate {
 *     render(data) {
 *       this.renderHeader(data);
 *       // ... contenido específico …
 *     }
 *   }
 */
class BaseReportTemplate {
  constructor() {
    this.doc = null;
    this.currentY = 0;
  }

  // ─────────────────────────── Inicialización ────────────────────────────────

  /**
   * Inicializa el documento PDF con la configuración global de estilos
   * @returns {PDFDocument}
   */
  initDocument() {
    this.doc = new PDFDocument({
      size: pdfStyles.page.size,
      margins: pdfStyles.page.margins,
      bufferPages: true,
      autoFirstPage: true
    });

    this.currentY = pdfStyles.page.margins.top;
    return this.doc;
  }

  // ────────────────────────── Control de páginas ─────────────────────────────

  /**
   * Verifica si hay espacio suficiente en la página actual y, de no haberlo,
   * crea una nueva página y reinicia `currentY`.
   *
   * @param {number} requiredHeight - Espacio mínimo requerido en puntos
   * @returns {boolean} `true` si se creó una nueva página
   */
  checkPageBreak(requiredHeight = 50) {
    const footerSpace = 30;
    const available = this.doc.page.height - this.currentY - pdfStyles.page.margins.bottom - footerSpace;

    if (available < requiredHeight) {
      this.doc.addPage();
      this.currentY = pdfStyles.page.margins.top;
      return true;
    }

    return false;
  }

  // ──────────────────────────── Footer ───────────────────────────────────────

  /**
   * Renderiza el footer únicamente en la página donde se llama (última página)
   */
  renderFooterOnCurrentPage() {
    const pageIndex = this.doc._pageBuffer ? this.doc._pageBuffer.length - 1 : 0;
    const pageNumber = pageIndex + 1;

    PDFFooter.render(this.doc, {
      pageNumber,
      totalPages: pageNumber
    });
  }

  // ─────────────────────────── Finalización ──────────────────────────────────

  /**
   * Renderiza el footer en la página actual, cierra el documento y
   * devuelve el buffer del PDF generado.
   *
   * @returns {Promise<Buffer>}
   */
  finalize() {
    return new Promise((resolve, reject) => {
      try {
        this.renderFooterOnCurrentPage();

        const buffers = [];
        this.doc.on('data', chunk => buffers.push(chunk));
        this.doc.on('end', () => resolve(Buffer.concat(buffers)));
        this.doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = BaseReportTemplate;
