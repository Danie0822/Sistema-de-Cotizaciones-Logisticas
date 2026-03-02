const pdfStyles = require('../styles/pdfStyles');
const pdfUtils = require('../../utils/pdfUtils');

/**
 * Componente reutilizable para tablas en reportes PDF
 * Todos los métodos son estáticos para facilitar el uso en cualquier plantilla.
 * Cada método recibe `doc` y la posición Y explícita, lo que lo hace
 * independiente del estado de la plantilla que lo consume.
 */
class PDFTable {
  /**
   * Devuelve el título legible de un tipo de detalle
   * @param {string} tipoDetalle
   * @returns {string}
   */
  static getSectionTitle(tipoDetalle) {
    const titles = {
      tarifa_base: 'TARIFA BASE',
      cargo: 'CARGOS',
      total_bruto: 'SUBTOTAL (ANTES DE DESCUENTOS)',
      descuento: 'DESCUENTOS APLICADOS',
      subtotal: 'SUBTOTAL (SIN IMPUESTOS)',
      impuesto: 'IMPUESTOS APLICADOS',
      total: 'TOTAL FINAL'
    };
    return titles[tipoDetalle] || tipoDetalle.toUpperCase();
  }

  /**
   * Renderiza el encabezado de la tabla
   * @param {PDFDocument} doc
   * @param {Array<{header: string, width: number, align?: string}>} columns
   * @param {number} tableLeft - Posición X de inicio
   * @param {number} tableTop  - Posición Y de inicio
   */
  static renderHeader(doc, columns, tableLeft, tableTop) {
    const { colors, fonts, table } = pdfStyles;
    const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

    doc
      .rect(tableLeft, tableTop, totalWidth, table.headerHeight)
      .fill(colors.tableHeader);

    doc
      .rect(tableLeft, tableTop, totalWidth, table.headerHeight)
      .stroke(colors.tableBorder);

    let currentX = tableLeft;
    columns.forEach((column, index) => {
      if (index > 0) {
        doc
          .strokeColor(colors.tableBorder)
          .lineWidth(0.5)
          .moveTo(currentX, tableTop)
          .lineTo(currentX, tableTop + table.headerHeight)
          .stroke();
      }

      const headerAlign = column.align || (index === 0 ? 'left' : 'center');

      doc
        .fontSize(fonts.bold.size)
        .font(fonts.bold.font)
        .fillColor(colors.white)
        .text(
          column.header,
          currentX + table.padding,
          tableTop + table.padding + 2,
          { width: column.width - table.padding * 2, align: headerAlign }
        );

      currentX += column.width;
    });
  }

  /**
   * Renderiza una fila de datos en la tabla
   * @param {PDFDocument} doc
   * @param {Array} columns
   * @param {number} tableLeft
   * @param {number} rowY        - Posición Y de la fila
   * @param {Array<string>} data - Datos de cada celda
   * @param {boolean} isEven     - Para el color alterno de fila
   * @param {Array<string>} alignOverrides - Alineaciones por columna (opcional)
   */
  static renderRow(doc, columns, tableLeft, rowY, data, isEven = false, alignOverrides = []) {
    const { colors, fonts, table } = pdfStyles;
    const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

    if (isEven) {
      doc.rect(tableLeft, rowY, totalWidth, table.rowHeight).fill(colors.background);
    }

    doc.rect(tableLeft, rowY, totalWidth, table.rowHeight).stroke(colors.tableBorder);

    let currentX = tableLeft;
    columns.forEach((column, index) => {
      if (index > 0) {
        doc
          .strokeColor(colors.tableBorder)
          .lineWidth(0.5)
          .moveTo(currentX, rowY)
          .lineTo(currentX, rowY + table.rowHeight)
          .stroke();
      }

      const alignment =
        alignOverrides[index] ||
        column.align ||
        (index === 0 ? 'left' : index === 1 ? 'center' : 'right');

      doc
        .fontSize(fonts.body.size)
        .font(fonts.body.font)
        .fillColor(colors.text)
        .text(data[index] || '', currentX + table.padding, rowY + table.padding + 1, {
          width: column.width - table.padding * 2,
          align: alignment
        });

      currentX += column.width;
    });
  }

  /**
   * Renderiza una fila de encabezado de sección (fila coloreada con label de grupo)
   * @param {PDFDocument} doc
   * @param {string} tipoDetalle - Clave del tipo (cargo, descuento, etc.)
   * @param {number} tableLeft
   * @param {number} rowY
   * @param {Array} columns
   */
  static renderSectionHeader(doc, tipoDetalle, tableLeft, rowY, columns) {
    const { colors, fonts, table } = pdfStyles;
    const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
    const sectionTitle = PDFTable.getSectionTitle(tipoDetalle);

    doc.rect(tableLeft, rowY, totalWidth, table.rowHeight).fill(colors.secondary);

    doc
      .fontSize(fonts.bold.size)
      .font(fonts.bold.font)
      .fillColor(colors.white)
      .text(sectionTitle, tableLeft + table.padding, rowY + table.padding);
  }

  /**
   * Renderiza una fila de subtotal (fondo gris oscuro, texto blanco)
   * @param {PDFDocument} doc
   * @param {Array} columns
   * @param {number} tableLeft
   * @param {number} rowY
   * @param {string} label  - Etiqueta del subtotal
   * @param {number} amount - Importe del subtotal
   */
  static renderSubtotalRow(doc, columns, tableLeft, rowY, label, amount) {
    const { colors, fonts, table } = pdfStyles;
    const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

    doc.rect(tableLeft, rowY, totalWidth, table.rowHeight).fill(colors.secondary);
    doc.rect(tableLeft, rowY, totalWidth, table.rowHeight).stroke(colors.tableBorder);

    const rowData = [label, '', pdfUtils.formatCurrency(amount)];
    let currentX = tableLeft;

    rowData.forEach((cell, idx) => {
      if (idx > 0) {
        doc
          .strokeColor(colors.tableBorder)
          .lineWidth(0.5)
          .moveTo(currentX, rowY)
          .lineTo(currentX, rowY + table.rowHeight)
          .stroke();
      }

      const align = idx === 0 ? 'left' : idx === 1 ? 'center' : 'right';

      doc
        .fontSize(fonts.bold.size)
        .font(fonts.bold.font)
        .fillColor(colors.white)
        .text(cell, currentX + table.padding, rowY + table.padding, {
          width: columns[idx].width - table.padding * 2,
          align
        });

      currentX += columns[idx].width;
    });
  }

  /**
   * Renderiza la fila de total final (fondo accent, texto blanco)
   * @param {PDFDocument} doc
   * @param {Array} columns
   * @param {number} tableLeft
   * @param {number} rowY
   * @param {number} totalAmount
   */
  static renderTotalRow(doc, columns, tableLeft, rowY, totalAmount) {
    const { colors, fonts, table } = pdfStyles;
    const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

    doc.rect(tableLeft, rowY, totalWidth, table.rowHeight).fill(colors.accent);

    doc
      .fontSize(fonts.bold.size)
      .font(fonts.bold.font)
      .fillColor(colors.white)
      .text('TOTAL FINAL', tableLeft + table.padding, rowY + table.padding);

    const totalText = pdfUtils.formatCurrency(totalAmount);
    const totalTextWidth = doc.widthOfString(totalText);

    doc.text(
      totalText,
      tableLeft + totalWidth - totalTextWidth - table.padding,
      rowY + table.padding
    );
  }
}

module.exports = PDFTable;
