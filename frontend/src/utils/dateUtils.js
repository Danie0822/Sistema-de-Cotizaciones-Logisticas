/**
 * Utilidades para el manejo y formateo de fechas
 */

/**
 * Formatea una fecha ISO a formato DD/MM/YYYY
 * @param {string|Date} date - Fecha en formato ISO o objeto Date
 * @returns {string} Fecha formateada como DD/MM/YYYY
 */
export const formatDateOnly = (date) => {
    if (!date) return '';
    
    try {
        const dateObj = new Date(date);
        
        // Verificar si la fecha es válida
        if (isNaN(dateObj.getTime())) {
            return '';
        }
        
        // Formatear la fecha como DD/MM/YYYY
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('Error formateando fecha:', error);
        return '';
    }
};

/**
 * Formatea una fecha ISO a formato DD/MM/YYYY HH:mm
 * @param {string|Date} date - Fecha en formato ISO o objeto Date
 * @returns {string} Fecha formateada como DD/MM/YYYY HH:mm
 */
export const formatDateTime = (date) => {
    if (!date) return '';
    
    try {
        const dateObj = new Date(date);
        
        // Verificar si la fecha es válida
        if (isNaN(dateObj.getTime())) {
            return '';
        }
        
        // Formatear la fecha como DD/MM/YYYY HH:mm
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formateando fecha:', error);
        return '';
    }
};

/**
 * Formatea una fecha usando las opciones locales del navegador
 * @param {string|Date} date - Fecha en formato ISO o objeto Date
 * @param {string} locale - Locale para formatear (por defecto 'es-ES')
 * @returns {string} Fecha formateada según el locale
 */
export const formatDateLocale = (date, locale = 'es-ES') => {
    if (!date) return '';
    
    try {
        const dateObj = new Date(date);
        
        // Verificar si la fecha es válida
        if (isNaN(dateObj.getTime())) {
            return '';
        }
        
        return dateObj.toLocaleDateString(locale);
    } catch (error) {
        console.error('Error formateando fecha:', error);
        return '';
    }
};
