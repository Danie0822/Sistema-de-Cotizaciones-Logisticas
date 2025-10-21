const CotizacionReportTemplate = require('../templates/cotizacionReportTemplate');
const pdfUtils = require('../../utils/pdfUtils');

/**
 * Servicio generador de PDFs para reportes de cotización
 * Orquesta la creación del documento usando los componentes modulares
 */
class GenerateCotizacionPDF {
  
  /**
   * Genera un PDF del reporte de cotización
   * @param {Array} cotizacionData - Datos de la cotización desde vw_cotizaciones_reporte_detallado
   * @param {Object} options - Opciones adicionales para el reporte
   * @returns {Promise<Buffer>} Buffer del PDF generado
   */
  static async generate(cotizacionData, options = {}) {
    try {
      // Validar datos de entrada
      if (!cotizacionData || !Array.isArray(cotizacionData) || cotizacionData.length === 0) {
        throw new Error('No se proporcionaron datos válidos para generar el reporte');
      }

      // Procesar y validar datos
      const processedData = this.processData(cotizacionData);
      const cotizacionInfo = this.extractCotizacionInfo(processedData);

      // Inicializar plantilla
      const template = new CotizacionReportTemplate();
      const doc = template.initDocument();

      // Renderizar componentes del reporte
      template.renderHeader(processedData);
      template.renderCotizacionInfo(cotizacionInfo);
      template.renderDetailsTable(processedData);

      // Agregar información adicional si es necesaria
      if (options.includeNotes) {
        this.addNotesSection(template, options.notes);
      }

      if (options.includeTerms) {
        this.addTermsSection(template);
      }

      // Renderizar sección de firmas
      if (options.includeSignatures !== false) { // Por defecto incluir firmas
        template.renderSignatureSection({
          includeClientSignature: options.includeClientSignature !== false,
          includeAuthorizedSignature: options.includeAuthorizedSignature !== false
        });
      }

      // Finalizar documento y retornar buffer
      const pdfBuffer = await template.finalize();
      
      console.log(`PDF generado exitosamente para cotización ID: ${cotizacionInfo.cotizacion_id}`);
      return pdfBuffer;

    } catch (error) {
      console.error('Error al generar PDF de cotización:', error);
      throw new Error(`Error en la generación del PDF: ${error.message}`);
    }
  }

  /**
   * Procesa y limpia los datos de la cotización
   * @param {Array} rawData - Datos crudos de la vista
   * @returns {Array} Datos procesados
   */
  static processData(rawData) {
    if (!rawData || !rawData.length) return [];

    // Tomar los datos base del primer registro
    const base = rawData[0];
    // Determinar el valor de peso_cotizacion base
    const pesoBase = base.peso_cotizacion !== undefined ? base.peso_cotizacion : (base.peso !== undefined ? base.peso : undefined);

    // Procesar cada fila y propagar peso_cotizacion correctamente
    const processed = rawData.map(item => ({
      cotizacion_id: item.cotizacion_id,
      fecha_cotizacion: item.fecha_cotizacion,
      cliente: item.cliente || 'Cliente no especificado',
      tipo_carga: item.tipo_carga || 'No especificado',
      unidad: item.unidad || 'N/A',
      concepto: item.concepto || 'Concepto no especificado',
      importe: parseFloat(item.importe) || 0,
      tipo_detalle: item.tipo_detalle || 'general',
      peso_cotizacion: item.peso_cotizacion !== undefined ? item.peso_cotizacion : (item.peso !== undefined ? item.peso : pesoBase),
      origen: item.origen || 'No especificado',
      destino: item.destino || 'No especificado'
    }));

    // Insertar fila virtual de tarifa_base
    processed.unshift({
      cotizacion_id: base.cotizacion_id,
      fecha_cotizacion: base.fecha_cotizacion,
      cliente: base.cliente,
      tipo_carga: base.tipo_carga,
      unidad: base.unidad,
      concepto: 'Tarifa base',
      importe: parseFloat(base.tarifa_base) || 0,
      tipo_detalle: 'tarifa_base',
      peso_cotizacion: pesoBase,
      origen: base.origen || 'No especificado',
      destino: base.destino || 'No especificado'
    });

    // Insertar fila virtual de total_bruto (después de cargos, antes de descuentos)
    // Buscar el índice donde empiezan los descuentos
    const firstDescuentoIdx = processed.findIndex(item => item.tipo_detalle === 'descuento');
    const totalBrutoRow = {
      cotizacion_id: base.cotizacion_id,
      fecha_cotizacion: base.fecha_cotizacion,
      cliente: base.cliente,
      tipo_carga: base.tipo_carga,
      unidad: base.unidad,
      concepto: 'Total bruto',
      importe: parseFloat(base.total_bruto) || 0,
      tipo_detalle: 'total_bruto',
      peso_cotizacion: pesoBase,
      origen: base.origen || 'No especificado',
      destino: base.destino || 'No especificado'
    };
    if (firstDescuentoIdx > 0) {
      processed.splice(firstDescuentoIdx, 0, totalBrutoRow);
    } else {
      processed.push(totalBrutoRow);
    }

    return processed;
  }

  /**
   * Extrae la información principal de la cotización
   * @param {Array} data - Datos procesados
   * @returns {Object} Información de la cotización
   */
  static extractCotizacionInfo(data) {
    if (!data.length) {
      throw new Error('No hay datos para extraer información de la cotización');
    }

    const firstRecord = data[0];
    const totalRecord = data.find(item => item.tipo_detalle === 'total');

    // Determinar el valor de peso_cotizacion
    const peso_cotizacion = firstRecord.peso_cotizacion !== undefined ? firstRecord.peso_cotizacion : (firstRecord.peso !== undefined ? firstRecord.peso : undefined);

    return {
      cotizacion_id: firstRecord.cotizacion_id,
      fecha_cotizacion: firstRecord.fecha_cotizacion,
      cliente: firstRecord.cliente,
      tipo_carga: firstRecord.tipo_carga,
      unidad: firstRecord.unidad,
      monto_total: totalRecord ? totalRecord.importe : 0,
      cantidad_items: data.filter(item => item.tipo_detalle !== 'total').length,
      peso_cotizacion,
      origen: firstRecord.origen || 'No especificado',
      destino: firstRecord.destino || 'No especificado'
    };
  }

  /**
   * Agrega sección de notas al reporte con control de paginación
   * @param {CotizacionReportTemplate} template - Instancia de la plantilla
   * @param {string} notes - Notas a incluir
   */
  static addNotesSection(template, notes) {
    if (!notes || !template.doc) return;

    const { colors, fonts, spacing } = require('../styles/pdfStyles');

    // Verificar espacio antes de agregar notas
    const requiredHeight = 80;
    template.checkPageBreak(requiredHeight);

    template.currentY += spacing.lg;

    template.doc
      .fontSize(fonts.subtitle.size)
      .font(fonts.subtitle.font)
      .fillColor(colors.primary)
      .text('Notas Adicionales', template.doc.page.margins.left, template.currentY);

    template.currentY += spacing.md;

    template.doc
      .fontSize(fonts.body.size)
      .font(fonts.body.font)
      .fillColor(colors.text)
      .text(notes, template.doc.page.margins.left, template.currentY, {
        width: template.doc.page.width - template.doc.page.margins.left - template.doc.page.margins.right,
        align: 'justify'
      });

    // Actualizar currentY basado en el texto renderizado
    const textHeight = template.doc.heightOfString(notes, {
      width: template.doc.page.width - template.doc.page.margins.left - template.doc.page.margins.right
    });
    
    template.currentY += textHeight + spacing.md;
  }

  /**
   * Agrega sección de términos y condiciones con control de paginación
   * @param {CotizacionReportTemplate} template - Instancia de la plantilla
   */
  static addTermsSection(template) {
    if (!template.doc) return;

    const pdfStyles = require('../styles/pdfStyles');
    const { colors, fonts, spacing } = pdfStyles;
    
    // Verificar espacio disponible antes de agregar términos
    const requiredHeight = 150; // Altura estimada para términos
    template.checkPageBreak(requiredHeight);

    template.currentY += spacing.lg;

    template.doc
      .fontSize(fonts.subtitle.size)
      .font(fonts.subtitle.font)
      .fillColor(colors.primary)
      .text('Términos y Condiciones', pdfStyles.page.margins.left, template.currentY);

    template.currentY += spacing.lg;

    const terms = [
      '• Los precios están sujetos a cambios sin previo aviso.',
      '• Esta cotización tiene validez de 30 días calendario.',
      '• Los precios no incluyen seguros adicionales salvo especificación contraria.',
      '• El cliente deberá confirmar la disponibilidad antes del envío.',
      '• Los términos de pago son según acuerdo comercial establecido.'
    ];

    terms.forEach((term, index) => {
      // Verificar espacio antes de cada término
      if (index === 0 || index % 2 === 0) {
        template.checkPageBreak(spacing.md * 2);
      }
      
      template.doc
        .fontSize(fonts.body.size)
        .font(fonts.body.font)
        .fillColor(colors.text)
        .text(term, pdfStyles.page.margins.left, template.currentY);
      
      template.currentY += spacing.md;
    });

    template.currentY += spacing.md; // Reducir el espaciado final
  }

  /**
   * Genera un reporte resumido (solo totales)
   * @param {Array} cotizacionData - Datos de la cotización
   * @returns {Promise<Buffer>} Buffer del PDF generado
   */
  static async generateSummary(cotizacionData) {
    // Filtrar solo los totales y información principal
    const summaryData = cotizacionData.filter(item => 
      item.tipo_detalle === 'total' || item.tipo_detalle === 'cargo'
    );

    return this.generate(summaryData, {
      includeTerms: true,
      notes: 'Este es un reporte resumido. Para más detalles, solicite el reporte completo.'
    });
  }

  /**
   * Valida que los datos tengan la estructura esperada
   * @param {Array} data - Datos a validar
   * @returns {boolean} True si los datos son válidos
   */
  static validateData(data) {
    return pdfUtils.validateReportData(data);
  }
}

module.exports = GenerateCotizacionPDF;
