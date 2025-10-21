/**
 * Configura  // Colores corporativos modernos y elegantes
  colors: {
    primary: '#1e293b',      // Gris azulado oscuro - elegante y profesional
    secondary: '#475569',    // Gris medio para jerarquía
    accent: '#64748b',       // Gris azulado claro para acentos
    text: '#0f172a',         // Casi negro para texto principal - máximo contraste
    textLight: '#64748b',    // Gris para texto secundario
    textMuted: '#94a3b8',    // Gris claro para texto menos importante
    border: '#e2e8f0',       // Gris muy claro para bordes sutiles
    background: '#f8fafc',   // Fondo casi blanco con toque azulado
    white: '#ffffff',
    success: '#059669',      // Verde profesional
    warning: '#d97706',      // Naranja sobrio
    danger: '#dc2626',       // Rojo profesional
    tableHeader: '#334155',  // Gris oscuro para encabezados - contraste elegante
    tableBorder: '#cbd5e1',  // Gris suave para bordes de tabla
    headerBg: '#f1f5f9',     // Fondo muy suave para secciones
    divider: '#e2e8f0'       // Líneas divisorias sutiles
  },ra reportes PDF
 * Define tipografías, colores, márgenes y dimensiones estándar
 */

const pdfStyles = {
  // Configuración de página optimizada para evitar páginas vacías
  page: {
    size: 'A4',
    margins: {
      top: 50,      // Más reducido para maximizar espacio de contenido
      bottom: 30,   // Mínimo para footer
      left: 50,
      right: 50
    }
  },

  // Colores corporativos
  colors: {
    primary: '#374151',      // Gris oscuro elegante y sobrio
    secondary: '#6b7280',    // Gris medio
    accent: '#9ca3af',       // Gris claro para acentos
    text: '#1f2937',         // Gris muy oscuro para texto principal
    textLight: '#6b7280',    // Gris medio para texto secundario
    border: '#e5e7eb',       // Gris muy claro para bordes
    background: '#f9fafb',   // Fondo claro
    white: '#ffffff',
    success: '#059669',      // Verde sobrio
    warning: '#d97706',      // Naranja sobrio
    danger: '#dc2626',       // Rojo sobrio
    tableHeader: '#4b5563',  // Gris oscuro para encabezados de tabla
    tableBorder: '#d1d5db',  // Gris para bordes de tabla
    headerBg: '#f8fafc',     // Fondo claro para secciones
    lightLine: '#e5e7eb'     // Gris muy claro para líneas sutiles
  },

  // Tipografías
  fonts: {
    title: {
      size: 18,
      font: 'Helvetica-Bold'
    },
    subtitle: {
      size: 14,
      font: 'Helvetica-Bold'
    },
    heading: {
      size: 12,
      font: 'Helvetica-Bold'
    },
    body: {
      size: 10,
      font: 'Helvetica'
    },
    small: {
      size: 8,
      font: 'Helvetica'
    },
    bold: {
      size: 10,
      font: 'Helvetica-Bold'
    }
  },

  // Espaciado y dimensiones - diseño moderno con más respiración
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,      // Incrementado para mejor respiración
    lg: 24,      // Incrementado para secciones importantes
    xl: 32,      // Incrementado para separación entre bloques principales
    xxl: 40      // Incrementado para máxima separación
  },

  // Configuración de tabla
  table: {
    headerHeight: 25,
    rowHeight: 20,
    borderWidth: 0.5,
    padding: 6
  },

  // Logo y branding
  logo: {
    width: 100,      // Aumentado de 80 a 100
    height: 50,      // Aumentado de 40 a 50
    x: 50,
    y: 30
  },

  // Líneas y separadores
  line: {
    width: 1,
    color: '#e5e7eb'
  }
};

module.exports = pdfStyles;
