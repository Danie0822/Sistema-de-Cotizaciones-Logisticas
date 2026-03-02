const BaseReportTemplate = require('../base/baseTemplate');
const PDFHeader = require('../components/header');
const PDFSignatureSection = require('../components/signatures');
const PDFInfoGrid = require('../components/infoGrid');
const PDFTable = require('../components/table');
const pdfStyles = require('../styles/pdfStyles');
const pdfUtils = require('../../utils/pdfUtils');

/**
 * Plantilla para el reporte de cotizaciones
 *
 * Extiende BaseReportTemplate y se apoya en los componentes reutilizables
 * PDFHeader, PDFInfoGrid, PDFTable y PDFSignatureSection para renderizar
 * el documento. Solo contiene lógica específica de cotizaciones.
 */
class CotizacionReportTemplate extends BaseReportTemplate {
  // ─────────────────────────── Header ────────────────────────────────────────

  /**
   * Renderiza el encabezado del documento
   * @param {Array} cotizacionData
   */
  renderHeader(cotizacionData) {
    if (!this.doc || !cotizacionData.length) return;

    this.currentY = PDFHeader.render(this.doc, {
      title: 'Reporte de Cotización Detallado',
      date: new Date()
    });
  }

  // ────────────────────────── Info de cotización ─────────────────────────────

  /**
   * Renderiza la sección de metadatos usando PDFInfoGrid
   * @param {Object} info - Objeto devuelto por GenerateCotizacionPDF.extractCotizacionInfo
   */
  renderCotizacionInfo(info) {
    if (!this.doc) return;

    const { colors, fonts, spacing } = pdfStyles;

    this.doc
      .fontSize(fonts.subtitle.size)
      .font(fonts.subtitle.font)
      .fillColor(colors.primary)
      .text('Información de la Cotización', pdfStyles.page.margins.left, this.currentY);

    this.currentY += spacing.lg;

    const pesoLabel = info.peso_cotizacion !== undefined
      ? `${info.peso_cotizacion} ${info.unidad}`
      : '';

    this.currentY = PDFInfoGrid.render(this.doc, this.currentY, [
      { leftLabel: 'Cliente',        leftValue: info.cliente,
        rightLabel: 'Fecha',         rightValue: pdfUtils.formatDate(info.fecha_cotizacion) },
      { leftLabel: 'Unidad',         leftValue: info.unidad,
        rightLabel: 'Tipo de Carga', rightValue: info.tipo_carga },
      { leftLabel: 'Peso',           leftValue: pesoLabel,
        rightLabel: 'Cotización #',  rightValue: info.cotizacion_id.toString().slice(-8).toUpperCase() },
      { leftLabel: 'Origen',         leftValue: info.origen  || 'No especificado',
        rightLabel: 'Destino',       rightValue: info.destino || 'No especificado' }
    ]);

    this.currentY += spacing.xl;
  }

  // ─────────────────────────── Tabla de detalles ─────────────────────────────

  /**
   * Renderiza la tabla de detalles usando PDFTable
   * @param {Array} cotizacionData - Datos procesados
   */
  renderDetailsTable(cotizacionData) {
    if (!this.doc || !cotizacionData.length) return;

    const { colors, fonts, spacing, table, page } = pdfStyles;

    this.doc
      .fontSize(fonts.subtitle.size)
      .font(fonts.subtitle.font)
      .fillColor(colors.primary)
      .text('Detalle de Cotización', page.margins.left, this.currentY);

    this.currentY += spacing.lg;

    const tableLeft  = page.margins.left;
    const tableWidth = this.doc.page.width - page.margins.left - page.margins.right;

    const columns = [
      { header: 'Concepto', width: tableWidth * 0.5,  align: 'left' },
      { header: 'Tipo',     width: tableWidth * 0.25, align: 'center' },
      { header: 'Importe',  width: tableWidth * 0.25, align: 'right' }
    ];

    // Helper: salto de página + re-renderizado de cabecera si es necesario
    const withPageBreak = (needed = table.rowHeight) => {
      const broke = this.checkPageBreak(Math.min(needed, 100));
      if (broke) {
        PDFTable.renderHeader(this.doc, columns, tableLeft, this.currentY);
        this.currentY += table.headerHeight;
      }
    };

    // Encabezado inicial
    PDFTable.renderHeader(this.doc, columns, tableLeft, this.currentY);
    this.currentY += table.headerHeight;

    let rowIndex = 0;

    // — Tarifa base ———————————————————————————————————————————————————————————
    const tarifaBase = cotizacionData.find(i => i.tipo_detalle === 'tarifa_base');
    if (tarifaBase) {
      withPageBreak();
      PDFTable.renderRow(this.doc, columns, tableLeft, this.currentY,
        [tarifaBase.concepto, 'Tarifa', pdfUtils.formatCurrency(tarifaBase.importe)],
        rowIndex % 2 === 0, ['left', 'center', 'right']);
      this.currentY += table.rowHeight;
      rowIndex++;
    }

    // — Cargos ————————————————————————————————————————————————————————————————
    const cargos = cotizacionData.filter(i => i.tipo_detalle === 'cargo');
    if (cargos.length > 0) {
      withPageBreak(table.rowHeight * 2);
      PDFTable.renderSectionHeader(this.doc, 'cargo', tableLeft, this.currentY, columns);
      this.currentY += table.rowHeight;

      cargos.forEach((item, idx) => {
        if (idx > 0 && idx % 8 === 0) withPageBreak();
        PDFTable.renderRow(this.doc, columns, tableLeft, this.currentY,
          [item.concepto, 'Cargo', pdfUtils.formatCurrency(item.importe)],
          rowIndex % 2 === 0, ['left', 'center', 'right']);
        this.currentY += table.rowHeight;
        rowIndex++;
      });
    }

    // — Total bruto ———————————————————————————————————————————————————————————
    const totalBruto = cotizacionData.find(i => i.tipo_detalle === 'total_bruto');
    if (totalBruto) {
      withPageBreak();
      PDFTable.renderSubtotalRow(this.doc, columns, tableLeft, this.currentY,
        'Total bruto', totalBruto.importe);
      this.currentY += table.rowHeight;
    }

    // — Descuentos ————————————————————————————————————————————————————————————
    const descuentos = cotizacionData.filter(i => i.tipo_detalle === 'descuento');
    descuentos.forEach((item, idx) => {
      if (idx === 0) withPageBreak();
      PDFTable.renderRow(this.doc, columns, tableLeft, this.currentY,
        [item.concepto, 'Descuento', pdfUtils.formatCurrency(item.importe)],
        rowIndex % 2 === 0, ['left', 'center', 'right']);
      this.currentY += table.rowHeight;
      rowIndex++;
    });

    // — Subtotal sin impuestos ————————————————————————————————————————————————
    const subtotal = cotizacionData.find(i => i.tipo_detalle === 'subtotal');
    if (subtotal) {
      withPageBreak();
      PDFTable.renderSubtotalRow(this.doc, columns, tableLeft, this.currentY,
        'Subtotal sin impuestos', subtotal.importe);
      this.currentY += table.rowHeight;
    }

    // — Impuestos —————————————————————————————————————————————————————————————
    const impuestos = cotizacionData.filter(i => i.tipo_detalle === 'impuesto');
    if (impuestos.length > 0) {
      withPageBreak(table.rowHeight * 2);
      PDFTable.renderSectionHeader(this.doc, 'impuesto', tableLeft, this.currentY, columns);
      this.currentY += table.rowHeight;

      impuestos.forEach((item, idx) => {
        if (idx > 0 && idx % 8 === 0) withPageBreak();
        PDFTable.renderRow(this.doc, columns, tableLeft, this.currentY,
          [item.concepto, 'Impuesto', pdfUtils.formatCurrency(item.importe)],
          rowIndex % 2 === 0, ['left', 'center', 'right']);
        this.currentY += table.rowHeight;
        rowIndex++;
      });
    }

    // — Total final ———————————————————————————————————————————————————————————
    const totalRow = cotizacionData.find(i => i.tipo_detalle === 'total');
    if (totalRow) {
      withPageBreak();
      this.currentY += spacing.sm;
      PDFTable.renderTotalRow(this.doc, columns, tableLeft, this.currentY, totalRow.importe);
    }

    this.currentY += spacing.md;
  }

  // ──────────────────────────── Firmas ───────────────────────────────────────

  /**
   * Renderiza la sección de firmas, creando nueva página si no hay espacio
   * @param {Object} options - Opciones para PDFSignatureSection
   */
  renderSignatureSection(options = {}) {
    if (!this.doc) return;

    const available = this.doc.page.height - this.currentY - pdfStyles.page.margins.bottom;
    const needed    = 80 + 20; // signatureHeight + safetyMargin

    if (available < needed) {
      this.doc.addPage();
      this.currentY = pdfStyles.page.margins.top;
    }

    this.currentY = PDFSignatureSection.render(this.doc, this.currentY, {
      includeClientSignature:    true,
      includeAuthorizedSignature: true,
      title: 'Firmas de Autorización',
      ...options
    });
  }
}

module.exports = CotizacionReportTemplate;
