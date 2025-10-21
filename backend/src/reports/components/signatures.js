const pdfStyles = require('../styles/pdfStyles');

/**
 * Componente para la sección de firmas en reportes PDF
 * Incluye espacios para firmas autorizadas y del cliente
 */
class PDFSignatureSection {
  /**
   * Renderiza la sección de firmas
   * @param {PDFDocument} doc - Instancia del documento PDF
   * @param {number} currentY - Posición Y actual en el documento
   * @param {Object} options - Opciones de configuración
   * @returns {number} Nueva posición Y después de renderizar las firmas
   */
  static render(doc, currentY, options = {}) {
    const {
      includeClientSignature = true,
      includeAuthorizedSignature = true,
      title = 'Firmas de Autorización'
    } = options;

    const { colors, fonts, spacing } = pdfStyles;
    let startY = currentY + spacing.lg; // Reducir espacio antes del título

    // Guardar estado del documento
    doc.save();

    // Verificar si necesitamos una nueva página con altura más realista
    const requiredHeight = 80; // Reducir altura requerida
    if (doc.page.height - startY < requiredHeight) {
      doc.addPage();
      startY = pdfStyles.page.margins.top;
    }

    // Título de la sección
    doc
      .fontSize(fonts.subtitle.size)
      .font(fonts.subtitle.font)
      .fillColor(colors.primary)
      .text(title, pdfStyles.page.margins.left, startY);

    startY += spacing.md; // Reducir espacio después del título

    // Configuración de las columnas de firma
    const pageWidth = doc.page.width - pdfStyles.page.margins.left - pdfStyles.page.margins.right;
    const columnWidth = pageWidth / 2;
    const leftColumnX = pdfStyles.page.margins.left;
    const rightColumnX = pdfStyles.page.margins.left + columnWidth;

    // Líneas de firma con espacio optimizado
    const signatureLineY = startY + spacing.lg; // Reducir espacio
    const signatureLineWidth = columnWidth * 0.8;

    if (includeAuthorizedSignature) {
      // Firma autorizada (izquierda) - Solo texto simple
      doc
        .strokeColor(colors.text)
        .lineWidth(1)
        .moveTo(leftColumnX, signatureLineY)
        .lineTo(leftColumnX + signatureLineWidth, signatureLineY)
        .stroke();

      // Solo "Firma Autorizada" sin información extra
      doc
        .fontSize(fonts.body.size)
        .font(fonts.bold.font)
        .fillColor(colors.text)
        .text('Firma Autorizada', leftColumnX, signatureLineY + spacing.lg, {
          width: signatureLineWidth,
          align: 'center'
        });
    }

    if (includeClientSignature) {
      // Firma del cliente (derecha) con más padding
      doc
        .strokeColor(colors.text)
        .lineWidth(1)
        .moveTo(rightColumnX, signatureLineY)
        .lineTo(rightColumnX + signatureLineWidth, signatureLineY)
        .stroke();

      // Título de la firma del cliente
      doc
        .fontSize(fonts.body.size)
        .font(fonts.bold.font)
        .fillColor(colors.text)
        .text('Firma del Cliente', rightColumnX, signatureLineY + spacing.lg, {
          width: signatureLineWidth,
          align: 'center'
        });
    }

    // Restaurar estado del documento
    doc.restore();

    // Retornar nueva posición Y optimizada (sin texto innecesario)
    return signatureLineY + spacing.lg;
  }

  /**
   * Renderiza solo la firma del cliente (versión simple)
   * @param {PDFDocument} doc - Instancia del documento PDF
   * @param {number} currentY - Posición Y actual
   * @returns {number} Nueva posición Y
   */
  static renderClientOnly(doc, currentY) {
    return this.render(doc, currentY, {
      includeClientSignature: true,
      includeAuthorizedSignature: false,
      title: 'Firma de Aceptación'
    });
  }

  /**
   * Obtiene la altura estimada de la sección de firmas
   * @returns {number} Altura en puntos
   */
  static getHeight() {
    return 50; // Altura mínima para máxima responsividad
  }
}

module.exports = PDFSignatureSection;
