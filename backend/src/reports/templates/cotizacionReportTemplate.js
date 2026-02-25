
const PDFDocument = require('pdfkit');
const PDFHeader = require('../components/header');
const PDFFooter = require('../components/footer');
const PDFSignatureSection = require('../components/signatures');
const pdfStyles = require('../styles/pdfStyles');
const pdfUtils = require('../../utils/pdfUtils');

/**
 * Plantilla principal para el reporte de cotizaciones
 * Maneja la estructura y formato del documento PDF
 */
class CotizacionReportTemplate {
  constructor() {
    this.doc = null;
    this.currentY = 0;
    // ELIMINAMOS contadores manuales - usaremos solo el de PDFKit
  }

  /**
   * Inicializa el documento PDF con configuración mejorada
   * @returns {PDFDocument} Documento PDF inicializado
   */
  initDocument() {
    console.log(`DEBUG: Inicializando documento PDF...`);
    
    this.doc = new PDFDocument({
      size: pdfStyles.page.size,
      margins: pdfStyles.page.margins,
      bufferPages: true, // ACTIVAR buffering para poder modificar páginas
      autoFirstPage: true // Crear primera página automáticamente
    });

    this.currentY = pdfStyles.page.margins.top;
    console.log(`DEBUG: Documento inicializado, currentY: ${this.currentY}`);
    
    return this.doc;
  }

  /**
   * Renderiza el encabezado del documento
   * @param {Object} cotizacionData - Datos principales de la cotización
   */
  renderHeader(cotizacionData) {
    if (!this.doc || !cotizacionData.length) return;

    const firstRecord = cotizacionData[0];

    this.currentY = PDFHeader.render(this.doc, {
      title: 'Reporte de Cotización Detallado',
      subtitle: '', // Sin subtitle extra
      date: new Date()
    });
  }

  /**
   * Renderiza la información principal de la cotización
   * @param {Object} cotizacionInfo - Información de la cotización
   */
  renderCotizacionInfo(cotizacionInfo) {
    if (!this.doc) return;

    const { colors, fonts, spacing } = pdfStyles;

    // Título de sección con mejor jerarquía visual
    this.doc
      .fontSize(fonts.subtitle.size)
      .font(fonts.subtitle.font)
      .fillColor(colors.primary)
      .text('Información de la Cotización', pdfStyles.page.margins.left, this.currentY);

    this.currentY += spacing.lg; // Espaciado optimizado

    // Layout alineado: 3 filas, 2 columnas (izquierda/derecha)
    const leftColumn = pdfStyles.page.margins.left;
    const rightColumn = pdfStyles.page.margins.left + 250;
    const labelWidth = 80;
    const valueOffset = leftColumn + labelWidth;
    const rightLabelWidth = 80;
    const rightValueOffset = rightColumn + rightLabelWidth;

    // Fila 1: Cliente / Fecha
    this.doc
      .fontSize(fonts.bold.size)
      .font(fonts.bold.font)
      .fillColor(colors.text)
      .text('Cliente:', leftColumn, this.currentY);
    this.doc
      .fontSize(fonts.body.size)
      .font(fonts.body.font)
      .text(cotizacionInfo.cliente, valueOffset, this.currentY);

    this.doc
      .fontSize(fonts.bold.size)
      .font(fonts.bold.font)
      .text('Fecha:', rightColumn, this.currentY);
    this.doc
      .fontSize(fonts.body.size)
      .font(fonts.body.font)
      .text(pdfUtils.formatDate(cotizacionInfo.fecha_cotizacion), rightValueOffset, this.currentY);

    this.currentY += spacing.md;

    // Fila 2: Unidad / Tipo de Carga
    this.doc
      .fontSize(fonts.bold.size)
      .font(fonts.bold.font)
      .text('Unidad:', leftColumn, this.currentY);
    this.doc
      .fontSize(fonts.body.size)
      .font(fonts.body.font)
      .text(cotizacionInfo.unidad, valueOffset, this.currentY);

    this.doc
      .fontSize(fonts.bold.size)
      .font(fonts.bold.font)
      .text('Tipo de Carga:', rightColumn, this.currentY);
    this.doc
      .fontSize(fonts.body.size)
      .font(fonts.body.font)
      .text(cotizacionInfo.tipo_carga, rightValueOffset, this.currentY);

    this.currentY += spacing.md;

    // Fila 3: Peso / ID de Cotización
    this.doc
      .fontSize(fonts.bold.size)
      .font(fonts.bold.font)
      .text('Peso:', leftColumn, this.currentY);
    this.doc
      .fontSize(fonts.body.size)
      .font(fonts.body.font)
      .text(cotizacionInfo.peso_cotizacion !== undefined ? `${cotizacionInfo.peso_cotizacion} ${cotizacionInfo.unidad}` : '', valueOffset, this.currentY);

    this.doc
      .fontSize(fonts.bold.size)
      .font(fonts.bold.font)
      .text('Cotización #:', rightColumn, this.currentY);
    this.doc
      .fontSize(fonts.body.size)
      .font(fonts.body.font)
      .text(cotizacionInfo.cotizacion_id.toString().slice(-8).toUpperCase(), rightValueOffset, this.currentY);

    this.currentY += spacing.md;

    // Fila 4: Origen / Destino
    this.doc
      .fontSize(fonts.bold.size)
      .font(fonts.bold.font)
      .text('Origen:', leftColumn, this.currentY);
    this.doc
      .fontSize(fonts.body.size)
      .font(fonts.body.font)
      .text(cotizacionInfo.origen || 'No especificado', valueOffset, this.currentY);

    this.doc
      .fontSize(fonts.bold.size)
      .font(fonts.bold.font)
      .text('Destino:', rightColumn, this.currentY);
    this.doc
      .fontSize(fonts.body.size)
      .font(fonts.body.font)
      .text(cotizacionInfo.destino || 'No especificado', rightValueOffset, this.currentY);

    this.currentY += spacing.xl;
  }

  /**
   * Renderiza la tabla de detalles de la cotización con control de paginación mejorado
   * @param {Array} cotizacionData - Datos completos de la cotización
   */
  renderDetailsTable(cotizacionData) {
    if (!this.doc || !cotizacionData.length) return;

    const { colors, fonts, spacing, table } = pdfStyles;

    // Título de sección
    this.doc
      .fontSize(fonts.subtitle.size)
      .font(fonts.subtitle.font)
      .fillColor(colors.primary)
      .text('Detalle de Cotización', pdfStyles.page.margins.left, this.currentY);

    this.currentY += spacing.lg;

    // Configuración de la tabla
    const tableLeft = pdfStyles.page.margins.left;
    const tableWidth = this.doc.page.width - pdfStyles.page.margins.left - pdfStyles.page.margins.right;

    // Definir columnas con mejor alineación
    const columns = [
      { header: 'Concepto', width: tableWidth * 0.5, align: 'left' },
      { header: 'Tipo', width: tableWidth * 0.25, align: 'center' },
      { header: 'Importe', width: tableWidth * 0.25, align: 'right' }
    ];

    // Renderizar encabezado inicial de tabla
    this.renderTableHeader(columns, tableLeft, this.currentY);
    this.currentY += table.headerHeight;

    let rowIndex = 0;

    // Tarifa base (como fila normal)
    const tarifaBaseRow = cotizacionData.find(item => item.tipo_detalle === 'tarifa_base');
    if (tarifaBaseRow) {
      this.checkPageBreakAndRenderHeader(columns, tableLeft, table.rowHeight);
      this.renderTableRow(columns, tableLeft, [
        tarifaBaseRow.concepto,
        'Tarifa',
        pdfUtils.formatCurrency(tarifaBaseRow.importe)
      ], rowIndex % 2 === 0, ['left', 'center', 'right']);
      this.currentY += table.rowHeight;
      rowIndex++;
    }

    // Cargos (con encabezado de sección)
    const cargos = cotizacionData.filter(item => item.tipo_detalle === 'cargo');
    if (cargos.length > 0) {
      // Verificar espacio para encabezado de sección + al menos 1 fila
      this.checkPageBreakAndRenderHeader(columns, tableLeft, table.rowHeight * 2);
      
      this.renderSectionHeader('cargo', tableLeft, columns);
      this.currentY += table.rowHeight;

      cargos.forEach((item, index) => {
        // Solo verificar espacio ocasionalmente para evitar páginas innecesarias
        if (index > 0 && index % 8 === 0) { // Cada 8 filas en lugar de cada 5
          this.checkPageBreakAndRenderHeader(columns, tableLeft, table.rowHeight);
        }
        
        this.renderTableRow(columns, tableLeft, [
          item.concepto,
          'Cargo',
          pdfUtils.formatCurrency(item.importe)
        ], rowIndex % 2 === 0, ['left', 'center', 'right']);
        this.currentY += table.rowHeight;
        rowIndex++;
      });
    }

    // Total bruto (como fila de subtotal)
    const totalBrutoRow = cotizacionData.find(item => item.tipo_detalle === 'total_bruto');
    if (totalBrutoRow) {
      this.checkPageBreakAndRenderHeader(columns, tableLeft, table.rowHeight);
      this.renderSubtotalRow(columns, tableLeft, 'Total bruto', totalBrutoRow.importe);
      this.currentY += table.rowHeight;
      rowIndex++;
    }

    // Descuentos
    const descuentos = cotizacionData.filter(item => item.tipo_detalle === 'descuento');
    if (descuentos.length > 0) {
      descuentos.forEach((item, index) => {
        // Solo verificar al inicio de los descuentos
        if (index === 0) {
          this.checkPageBreakAndRenderHeader(columns, tableLeft, table.rowHeight);
        }
        
        this.renderTableRow(columns, tableLeft, [
          item.concepto,
          'Descuento',
          pdfUtils.formatCurrency(item.importe)
        ], rowIndex % 2 === 0, ['left', 'center', 'right']);
        this.currentY += table.rowHeight;
        rowIndex++;
      });
    }

    // Subtotal (antes de impuestos)
    const subtotalRow = cotizacionData.find(item => item.tipo_detalle === 'subtotal');
    if (subtotalRow) {
      this.checkPageBreakAndRenderHeader(columns, tableLeft, table.rowHeight);
      this.renderSubtotalRow(columns, tableLeft, 'Subtotal sin impuestos', subtotalRow.importe);
      this.currentY += table.rowHeight;
      rowIndex++;
    }

    // Impuestos (con encabezado de sección)
    const impuestos = cotizacionData.filter(item => item.tipo_detalle === 'impuesto');
    if (impuestos.length > 0) {
      // Verificar espacio para encabezado de sección + al menos 1 fila
      this.checkPageBreakAndRenderHeader(columns, tableLeft, table.rowHeight * 2);
      
      this.renderSectionHeader('impuesto', tableLeft, columns);
      this.currentY += table.rowHeight;

      impuestos.forEach((item, index) => {
        if (index > 0 && index % 8 === 0) {
          this.checkPageBreakAndRenderHeader(columns, tableLeft, table.rowHeight);
        }
        
        this.renderTableRow(columns, tableLeft, [
          item.concepto,
          'Impuesto',
          pdfUtils.formatCurrency(item.importe)
        ], rowIndex % 2 === 0, ['left', 'center', 'right']);
        this.currentY += table.rowHeight;
        rowIndex++;
      });
    }

    // Total final
    const totalRow = cotizacionData.find(item => item.tipo_detalle === 'total');
    if (totalRow) {
      this.checkPageBreakAndRenderHeader(columns, tableLeft, table.rowHeight);
      this.currentY += spacing.sm;
      this.renderTotalRow(columns, tableLeft, totalRow.importe);
    }
    
    this.currentY += spacing.md;
  }

  /**
   * Verifica si necesita nueva página y re-renderiza el header de tabla si es necesario
   * @param {Array} columns - Definición de columnas
   * @param {number} tableLeft - Posición X de la tabla
   * @param {number} requiredHeight - Altura requerida
   */
  checkPageBreakAndRenderHeader(columns, tableLeft, requiredHeight = 50) {
    // Usar un margen más conservador para evitar páginas innecesarias
    const adjustedHeight = Math.min(requiredHeight, 100); // Limitar la altura máxima requerida
    const pageBreakOccurred = this.checkPageBreak(adjustedHeight);
    
    // Si hubo salto de página, re-renderizar el header de la tabla
    if (pageBreakOccurred) {
      this.renderTableHeader(columns, tableLeft, this.currentY);
      this.currentY += pdfStyles.table.headerHeight;
    }
  }

  /**
   * Renderiza una fila de subtotal con estilo especial
   * @param {Array} columns - Definición de columnas
   * @param {number} tableLeft - Posición X de la tabla
   * @param {string} label - Etiqueta del subtotal
   * @param {number} amount - Cantidad del subtotal
   */
  renderSubtotalRow(columns, tableLeft, label, amount) {
    const { colors, fonts, table: tableStyle } = pdfStyles;
    const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
    
    // Fondo del subtotal
    this.doc
      .rect(tableLeft, this.currentY, totalWidth, tableStyle.rowHeight)
      .fill(colors.secondary);
    
    // Bordes
    this.doc
      .rect(tableLeft, this.currentY, totalWidth, tableStyle.rowHeight)
      .stroke(colors.tableBorder);
    
    // Texto del subtotal
    let currentX = tableLeft;
    const rowData = [label, '', pdfUtils.formatCurrency(amount)];
    
    rowData.forEach((cell, idx) => {
      // Separadores verticales
      if (idx > 0) {
        this.doc
          .strokeColor(colors.tableBorder)
          .lineWidth(0.5)
          .moveTo(currentX, this.currentY)
          .lineTo(currentX, this.currentY + tableStyle.rowHeight)
          .stroke();
      }
      
      const align = idx === 0 ? 'left' : (idx === 1 ? 'center' : 'right');
      
      this.doc
        .fontSize(fonts.bold.size)
        .font(fonts.bold.font)
        .fillColor(colors.white)
        .text(
          cell,
          currentX + tableStyle.padding,
          this.currentY + tableStyle.padding,
          { 
            width: columns[idx].width - tableStyle.padding * 2, 
            align: align 
          }
        );
      
      currentX += columns[idx].width;
    });
  }

  /**
   * Verifica si es necesario crear una nueva página - sin footer en páginas intermedias
   * @param {number} requiredHeight - Altura requerida en puntos
   * @returns {boolean} True si se creó una nueva página
   */
  checkPageBreak(requiredHeight = 50) {
    console.log(`DEBUG: checkPageBreak llamado - requiredHeight: ${requiredHeight}, currentY: ${this.currentY}`);
    
    const footerSpace = 30; // Espacio mínimo reservado (sin footer)
    const availableHeight = this.doc.page.height - this.currentY - pdfStyles.page.margins.bottom - footerSpace;
    
    console.log(`DEBUG: availableHeight: ${availableHeight}, pageHeight: ${this.doc.page.height}`);
    
    // Crear nueva página si no hay suficiente espacio
    if (availableHeight < requiredHeight) {
      console.log(`DEBUG: ¡Creando nueva página! Sin footer en página intermedia...`);
      
      // NO RENDERIZAR FOOTER - solo crear nueva página
      this.doc.addPage();
      this.currentY = pdfStyles.page.margins.top;
      
      console.log(`DEBUG: Nueva página creada, currentY reset a: ${this.currentY}`);
      return true;
    }
    
    console.log(`DEBUG: No es necesario crear nueva página`);
    return false;
  }

  /**
   * Renderiza footer solo en la página actual - SOLO para la última página
   */
  renderFooterOnCurrentPage() {
    // Obtener info de página actual de PDFKit
    const currentPageIndex = this.doc._pageBuffer ? this.doc._pageBuffer.length - 1 : 0;
    const pageNumber = currentPageIndex + 1;
    
    console.log(`DEBUG: Renderizando footer en la ÚLTIMA página ${pageNumber}`);
    
    // Renderizar footer solo en esta página (que será la última)
    PDFFooter.render(this.doc, {
      pageNumber: pageNumber,
      totalPages: pageNumber // En este contexto, es la última página
    });
  }

  /**
   * Renderiza el encabezado de la tabla con diseño mejorado y alineación correcta
   */
  renderTableHeader(columns, tableLeft, tableTop) {
    const { colors, fonts, table } = pdfStyles;

    // Fondo del encabezado con gradiente visual
    this.doc
      .rect(tableLeft, tableTop, 
            columns.reduce((sum, col) => sum + col.width, 0), 
            table.headerHeight)
      .fill(colors.tableHeader);

    // Bordes del encabezado
    this.doc
      .rect(tableLeft, tableTop, 
            columns.reduce((sum, col) => sum + col.width, 0), 
            table.headerHeight)
      .stroke(colors.tableBorder);

    let currentX = tableLeft;
    columns.forEach((column, index) => {
      // Separadores verticales entre columnas
      if (index > 0) {
        this.doc
          .strokeColor(colors.tableBorder)
          .lineWidth(0.5)
          .moveTo(currentX, tableTop)
          .lineTo(currentX, tableTop + table.headerHeight)
          .stroke();
      }

      // Determinar alineación del header según el contenido
      let headerAlign = column.align;
      if (!headerAlign) {
        if (index === 0) headerAlign = 'left';      // Concepto
        else if (index === 1) headerAlign = 'center'; // Tipo
        else headerAlign = 'center';                   // Importe (centrado para el header)
      }

      this.doc
        .fontSize(fonts.bold.size)
        .font(fonts.bold.font)
        .fillColor(colors.white)
        .text(
          column.header,
          currentX + table.padding,
          tableTop + table.padding + 2,
          { 
            width: column.width - table.padding * 2, 
            align: headerAlign 
          }
        );
      currentX += column.width;
    });
  }

  /**
   * Renderiza una fila de la tabla con bordes mejorados y mejor control de alineación
   */
  renderTableRow(columns, tableLeft, data, isEven = false, alignOverrides = []) {
    const { colors, fonts, table } = pdfStyles;
    const rowY = this.currentY;

    // Fondo alternado para filas
    if (isEven) {
      this.doc
        .rect(tableLeft, rowY, 
              columns.reduce((sum, col) => sum + col.width, 0), 
              table.rowHeight)
        .fill(colors.background);
    }

    // Borde completo de la fila
    this.doc
      .rect(tableLeft, rowY, 
            columns.reduce((sum, col) => sum + col.width, 0), 
            table.rowHeight)
      .stroke(colors.tableBorder);

    // Contenido de las celdas con separadores verticales
    let currentX = tableLeft;
    columns.forEach((column, index) => {
      // Separadores verticales entre columnas
      if (index > 0) {
        this.doc
          .strokeColor(colors.tableBorder)
          .lineWidth(0.5)
          .moveTo(currentX, rowY)
          .lineTo(currentX, rowY + table.rowHeight)
          .stroke();
      }

      // Determinar alineación: override, luego columna, luego defecto por tipo
      let alignment = alignOverrides[index];
      if (!alignment) {
        alignment = column.align;
      }
      if (!alignment) {
        // Alineación por defecto según el índice de columna
        if (index === 0) alignment = 'left';      // Concepto
        else if (index === 1) alignment = 'center'; // Tipo
        else alignment = 'right';                   // Importe
      }

      this.doc
        .fontSize(fonts.body.size)
        .font(fonts.body.font)
        .fillColor(colors.text)
        .text(
          data[index] || '',
          currentX + table.padding,
          rowY + table.padding + 1,
          { 
            width: column.width - table.padding * 2, 
            align: alignment
          }
        );
      currentX += column.width;
    });
  }

  /**
   * Renderiza el encabezado de sección
   */
  renderSectionHeader(tipoDetalle, tableLeft, columns) {
    const { colors, fonts, table } = pdfStyles;
    const sectionTitle = this.getSectionTitle(tipoDetalle);

    this.doc
      .rect(tableLeft, this.currentY, 
            columns.reduce((sum, col) => sum + col.width, 0), 
            table.rowHeight)
      .fill(colors.secondary);

    this.doc
      .fontSize(fonts.bold.size)
      .font(fonts.bold.font)
      .fillColor(colors.white)
      .text(
        sectionTitle,
        tableLeft + table.padding,
        this.currentY + table.padding
      );
  }

  /**
   * Renderiza la fila de total
   */
  renderTotalRow(columns, tableLeft, totalAmount) {
    const { colors, fonts, table } = pdfStyles;

    this.doc
      .rect(tableLeft, this.currentY, 
            columns.reduce((sum, col) => sum + col.width, 0), 
            table.rowHeight)
      .fill(colors.accent);

    this.doc
      .fontSize(fonts.bold.size)
      .font(fonts.bold.font)
      .fillColor(colors.white)
      .text(
        'TOTAL FINAL',
        tableLeft + table.padding,
        this.currentY + table.padding
      );

    const totalText = pdfUtils.formatCurrency(totalAmount);
    const totalWidth = this.doc.widthOfString(totalText);
    this.doc
      .text(
        totalText,
        tableLeft + columns.reduce((sum, col) => sum + col.width, 0) - totalWidth - table.padding,
        this.currentY + table.padding
      );
  }

  /**
   * Renderiza el footer completamente al final de cada página
   */
  renderFooters() {
    if (!this.doc) return;

    const range = this.doc.bufferedPageRange();
    
    // Renderizar footer en cada página
    for (let i = 0; i < range.count; i++) {
      this.doc.switchToPage(range.start + i);
      
      PDFFooter.render(this.doc, {
        pageNumber: i + 1,
        totalPages: range.count
      });
    }
  }

  // Métodos utilitarios

  groupDataByType(data) {
    return data.reduce((acc, item) => {
      if (!acc[item.tipo_detalle]) {
        acc[item.tipo_detalle] = [];
      }
      acc[item.tipo_detalle].push(item);
      return acc;
    }, {});
  }

  getSectionTitle(tipoDetalle) {
    const titles = {
      'tarifa_base': 'TARIFA BASE',
      'cargo': 'CARGOS',
      'total_bruto': 'SUBTOTAL (ANTES DE DESCUENTOS)',
      'descuento': 'DESCUENTOS APLICADOS',
      'subtotal': 'SUBTOTAL (SIN IMPUESTOS)',
      'impuesto': 'IMPUESTOS APLICADOS',
      'total': 'TOTAL FINAL'
    };
    return titles[tipoDetalle] || tipoDetalle.toUpperCase();
  }

  /**
   * Renderiza la sección de firmas sin footer automático
   * @param {Object} options - Opciones para las firmas
   */
  renderSignatureSection(options = {}) {
    if (!this.doc) return;

    console.log(`DEBUG: Iniciando renderSignatureSection en Y=${this.currentY}`);

    // Calcular espacio necesario de manera conservadora
    const signatureHeight = 80; // Altura de las firmas
    const safetyMargin = 20; // Margen de seguridad
    const totalNeeded = signatureHeight + safetyMargin;
    
    const availableHeight = this.doc.page.height - this.currentY - pdfStyles.page.margins.bottom;
    
    console.log(`DEBUG: Espacio disponible: ${availableHeight}, necesario: ${totalNeeded}`);
    
    // Si no hay espacio suficiente, crear nueva página SIN FOOTER
    if (availableHeight < totalNeeded) {
      console.log(`DEBUG: Creando nueva página para firmas sin footer`);
      
      // NO RENDERIZAR FOOTER - solo crear nueva página
      this.doc.addPage();
      this.currentY = pdfStyles.page.margins.top;
    }

    // Renderizar las firmas
    this.currentY = PDFSignatureSection.render(this.doc, this.currentY, {
      includeClientSignature: true,
      includeAuthorizedSignature: true,
      title: 'Firmas de Autorización',
      ...options
    });

    console.log(`DEBUG: Firmas renderizadas, nueva Y=${this.currentY}`);
  }

  /**
   * Renderiza footers en todas las páginas del documento - VERSIÓN SIMPLIFICADA
   */
  renderFootersOnAllPages() {
    if (!this.doc) return;

    console.log(`DEBUG: INICIANDO renderFootersOnAllPages`);

    // MÉTODO 1: Usar la API estándar de PDFKit
    try {
      // Obtener información de páginas de PDFKit
      const range = this.doc.bufferedPageRange();
      const totalPages = range ? range.count : 1;
      const startPage = range ? range.start : 0;
      
      console.log(`DEBUG: Páginas detectadas - Total: ${totalPages}, Inicio: ${startPage}`);
      
      // Si no hay rango válido, asumir al menos 1 página
      if (totalPages <= 0) {
        console.log(`DEBUG: Sin páginas válidas, renderizando footer en página actual`);
        PDFFooter.render(this.doc, { pageNumber: 1, totalPages: 1 });
        return;
      }

      // Renderizar footer en cada página
      for (let i = 0; i < totalPages; i++) {
        const pageIndex = startPage + i;
        const pageNumber = i + 1;
        
        console.log(`DEBUG: Renderizando footer en página ${pageNumber} (índice ${pageIndex})`);
        
        this.doc.switchToPage(pageIndex);
        PDFFooter.render(this.doc, {
          pageNumber: pageNumber,
          totalPages: totalPages
        });
      }

      console.log(`DEBUG: Footers renderizados exitosamente`);
      
    } catch (error) {
      console.error(`DEBUG: Error renderizando footers:`, error);
      // Fallback: renderizar en página actual
      PDFFooter.render(this.doc, { pageNumber: 1, totalPages: 1 });
    }
  }

  /**
   * Método renderFooters deshabilitado para evitar páginas extra
   */
  renderFooters() {
    // DESHABILITADO: Este método causaba páginas extra
    // El footer se renderiza directamente en renderSignatureSection
    return;
  }

  /**
   * Finaliza el documento con footer SOLO en la última página
   * @returns {Promise<Buffer>} Buffer del PDF generado
   */
  finalize() {
    return new Promise((resolve, reject) => {
      try {
        console.log(`DEBUG: Finalizando documento...`);
        
        // RENDERIZAR FOOTER SOLO EN LA ÚLTIMA PÁGINA
        this.renderFooterOnCurrentPage();
        
        // NO actualizar otros footers - solo queremos footer en la última página
        
        const buffers = [];
        
        this.doc.on('data', buffers.push.bind(buffers));
        this.doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          console.log(`DEBUG: PDF finalizado, ${pdfBuffer.length} bytes`);
          resolve(pdfBuffer);
        });
        
        this.doc.end();
      } catch (error) {
        console.error(`DEBUG: Error en finalize:`, error);
        reject(error);
      }
    });
  }

  /**
   * Actualiza todos los footers con el conteo correcto de páginas
   */
  updateAllFootersWithCorrectCount() {
    try {
      // Obtener el total real de páginas
      const range = this.doc.bufferedPageRange();
      const totalPages = range ? range.count : 1;
      
      console.log(`DEBUG: Actualizando footers - Total páginas: ${totalPages}`);
      
      // Re-renderizar footers con conteo correcto
      for (let i = 0; i < totalPages; i++) {
        this.doc.switchToPage(range.start + i);
        PDFFooter.render(this.doc, {
          pageNumber: i + 1,
          totalPages: totalPages
        });
      }
      
    } catch (error) {
      console.error(`DEBUG: Error actualizando footers:`, error);
    }
  }
}

module.exports = CotizacionReportTemplate;
