const pdfStyles = require('../styles/pdfStyles');

/**
 * Componente reutilizable para grillas de información en 2 columnas
 *
 * Ideal para mostrar los metadatos de cualquier reporte (cliente, fecha,
 * folio, origen, destino …) con un layout label/valor en dos columnas.
 *
 * Uso:
 *   const newY = PDFInfoGrid.render(doc, currentY, [
 *     { leftLabel: 'Cliente', leftValue: 'ACME S.A.',  rightLabel: 'Fecha',  rightValue: '01 enero 2026' },
 *     { leftLabel: 'Unidad',  leftValue: 'KG',         rightLabel: 'Folio',  rightValue: 'COT-00123' },
 *   ]);
 *
 * @returns {number} Posición Y final después de renderizar todas las filas
 */
class PDFInfoGrid {
  /**
   * Renderiza una grilla de información en dos columnas
   *
   * @param {PDFDocument} doc        - Instancia del documento PDF
   * @param {number}      startY     - Posición Y donde iniciar el renderizado
   * @param {Array<{
   *   leftLabel?: string,
   *   leftValue?: string,
   *   rightLabel?: string,
   *   rightValue?: string
   * }>} rows                        - Filas de información
   * @returns {number} Nueva posición Y tras renderizar la grilla
   */
  static render(doc, startY, rows = []) {
    if (!rows.length) return startY;

    const { colors, fonts, spacing, page } = pdfStyles;

    const leftColumn      = page.margins.left;
    const rightColumn     = page.margins.left + 250;
    const labelWidth      = 80;
    const valueOffsetLeft = leftColumn  + labelWidth;
    const valueOffsetRight = rightColumn + labelWidth;

    let currentY = startY;

    rows.forEach(({ leftLabel = '', leftValue = '', rightLabel = '', rightValue = '' }) => {
      // Celda izquierda: label
      if (leftLabel) {
        doc
          .fontSize(fonts.bold.size)
          .font(fonts.bold.font)
          .fillColor(colors.text)
          .text(leftLabel + ':', leftColumn, currentY);
      }

      // Celda izquierda: value
      if (leftValue) {
        doc
          .fontSize(fonts.body.size)
          .font(fonts.body.font)
          .fillColor(colors.text)
          .text(leftValue, valueOffsetLeft, currentY);
      }

      // Celda derecha: label
      if (rightLabel) {
        doc
          .fontSize(fonts.bold.size)
          .font(fonts.bold.font)
          .fillColor(colors.text)
          .text(rightLabel + ':', rightColumn, currentY);
      }

      // Celda derecha: value
      if (rightValue) {
        doc
          .fontSize(fonts.body.size)
          .font(fonts.body.font)
          .fillColor(colors.text)
          .text(rightValue, valueOffsetRight, currentY);
      }

      currentY += spacing.md;
    });

    return currentY;
  }
}

module.exports = PDFInfoGrid;
