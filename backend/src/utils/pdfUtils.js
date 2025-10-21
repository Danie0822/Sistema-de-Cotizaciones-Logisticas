/**
 * Utilidades para el sistema de reportes PDF
 * Funciones auxiliares para formateo y validación
 */

const pdfUtils = {
  /**
   * Formatea una cantidad monetaria
   * @param {number} amount - Cantidad a formatear
   * @returns {string} Cantidad formateada como moneda
   */
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  },

  /**
   * Formatea una fecha para mostrar en reportes
   * @param {string|Date} dateString - Fecha a formatear
   * @returns {string} Fecha formateada
   */
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Formatea una fecha corta para headers/footers
   * @param {string|Date} dateString - Fecha a formatear
   * @returns {string} Fecha formateada corta
   */
  formatShortDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  /**
   * Valida que los datos del reporte tengan la estructura correcta
   * @param {Array} data - Datos a validar
   * @returns {boolean} True si los datos son válidos
   */
  validateReportData: (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }

    const requiredFields = [
      'cotizacion_id', 'fecha_cotizacion', 'cliente', 
      'concepto', 'importe', 'tipo_detalle'
    ];

    return data.every(item => 
      requiredFields.every(field => item.hasOwnProperty(field))
    );
  },

  /**
   * Capitaliza la primera letra de un string
   * @param {string} string - String a capitalizar
   * @returns {string} String capitalizado
   */
  capitalizeFirstLetter: (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  /**
   * Trunca un texto si es muy largo
   * @param {string} text - Texto a truncar
   * @param {number} maxLength - Longitud máxima
   * @returns {string} Texto truncado
   */
  truncateText: (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
};

module.exports = pdfUtils;
