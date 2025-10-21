const path = require('path');
const pdfStyles = require('../styles/pdfStyles');

/**
 * Componente Header para reportes PDF
 * Incluye logo, título del reporte y información de contacto
 */
class PDFHeader {
  /**
   * Renderiza el header del PDF con diseño profesional
   * @param {PDFDocument} doc - Instancia del documento PDF
   * @param {Object} options - Opciones del header
   * @param {string} options.title - Título del reporte
   * @param {string} options.subtitle - Subtítulo opcional
   * @param {Date} options.date - Fecha del reporte
   */
  static render(doc, options = {}) {
    const {
      title = 'Reporte de Cotización',
      subtitle = '',
      date = new Date()
    } = options;

    const { colors, fonts, spacing, logo } = pdfStyles;
    
    // Guardar estado del documento
    doc.save();

    try {
      // Intentar cargar y mostrar el logo con tamaño aumentado
      const logoPath = path.join(__dirname, '../../public/images/logo.png');
      doc.image(logoPath, logo.x, logo.y, {
        width: logo.width * 1.5, // Aumentar tamaño del logo
        height: logo.height * 1.5
      });
    } catch (error) {
      // Si no se puede cargar el logo, mostrar texto alternativo
      console.warn('Logo no encontrado, usando texto alternativo');
      doc
        .fontSize(fonts.heading.size * 1.2)
        .font(fonts.heading.font)
        .fillColor(colors.primary)
        .text('Logistics Solutions', logo.x, logo.y + 15);
    }

    // Solo el título centrado, sin información de contacto en el header
    // (la información de contacto va en el footer según la plantilla)

    // Título principal con jerarquía visual mejorada y espaciado moderno
    doc
      .fontSize(fonts.title.size)
      .font(fonts.title.font)
      .fillColor(colors.primary)
      .text(title, 0, logo.y + logo.height + spacing.xl, { 
        width: doc.page.width, 
        align: 'center' 
      });

    // Subtítulo si existe (con mejor contraste)
    if (subtitle) {
      doc
        .fontSize(fonts.body.size)
        .font(fonts.body.font)
        .fillColor(colors.textLight)
        .text(subtitle, 0, logo.y + logo.height + spacing.xl + spacing.lg, { 
          width: doc.page.width, 
          align: 'center' 
        });
    }

    // Restaurar estado del documento
    doc.restore();

    // Retornar posición Y con espaciado generoso para respiración visual
    return logo.y + logo.height + spacing.xl + spacing.xxl;
  }

  /**
   * Formatea una fecha para mostrar en el reporte
   * @param {Date} date - Fecha a formatear
   * @returns {string} Fecha formateada
   */
  static formatDate(date) {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Obtiene la altura total del header
   * @returns {number} Altura en puntos
   */
  static getHeight() {
    const { logo, spacing } = pdfStyles;
    return logo.y + logo.height + spacing.xl + spacing.xxl;
  }
}

module.exports = PDFHeader;
