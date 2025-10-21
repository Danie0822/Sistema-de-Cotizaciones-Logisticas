const pdfStyles = require('../styles/pdfStyles');

/**
 * Componente Footer optimizado para reportes PDF
 * Pie de página como en Word - información de contacto y numeración
 */
class PDFFooter {
  /**
   * Renderiza footer como pie de página (estilo Word) - SIN numeración
   * @param {PDFDocument} doc - Instancia del documento PDF  
   * @param {Object} options - Opciones del footer
   */
  static render(doc, options = {}) {
    const { colors, fonts } = pdfStyles;
    
    // Posición del footer (área del margen inferior)
    const footerY = doc.page.height - 50;
    const leftMargin = 50;
    
    doc.save();
    
    // Solo información de contacto (sin numeración de páginas)
    const contactInfo = 'Dirección: Calle Falsa 123, Ciudad, País | Tel: +1 234 567 890 | Email: contacto@ejemplo.com';
    
    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#666666')
      .text(contactInfo, leftMargin, footerY, {
        width: doc.page.width - 100,
        align: 'left'
      });
    
    doc.restore();
  }

  /**
   * Altura del footer
   */
  static getHeight() {
    return 50;
  }
}

module.exports = PDFFooter;
