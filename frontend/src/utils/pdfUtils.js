/**
 * Utilidades para el manejo de archivos PDF
 */

import { showSuccessAlert } from '../components/alerts/SuccessAlert';
import { showErrorAlert } from '../components/alerts/ErrorAlert';

/**
 * Genera y abre un PDF en el visualizador por defecto del navegador
 * @param {Function} serviceFunction - Función del servicio que genera el PDF
 * @param {number|string|Object} params - ID del elemento o parámetros para generar el PDF
 * @param {string} filename - Nombre base del archivo (sin extensión)
 * @param {string} reportName - Nombre del reporte para mostrar en el título
 */
export const generateAndViewPDF = async (serviceFunction, params, filename = 'document', reportName = 'Reporte') => {
    try {
        const res = await serviceFunction(params);
        
        // Crear blob con el contenido del PDF
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        // Abrir en nueva pestaña para visualizar
        const newWindow = window.open(url, '_blank');
        
        // Si no se pudo abrir la nueva ventana, mostrar error
        if (!newWindow) {
            showErrorAlert('No se pudo abrir el PDF. Verifique que el bloqueador de ventanas emergentes esté deshabilitado.');
            // Limpiar la URL creada
            window.URL.revokeObjectURL(url);
            return;
        }
        
        // Configurar el título de la nueva ventana con el nombre del reporte
        newWindow.document.title = `${reportName} - ${filename}.pdf`;
        
        showSuccessAlert(`${reportName} generado correctamente`);
        
        // Limpiar la URL después de un tiempo para liberar memoria
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 10000);
        
    } catch (err) {
        console.error('Error generando PDF:', err);
        showErrorAlert(`No se pudo generar el ${reportName.toLowerCase()}`);
        throw err; // Re-lanzar el error para que el componente pueda manejarlo
    }
};

/**
 * Genera y descarga un PDF (funcionalidad original para casos donde se necesite)
 * @param {Function} serviceFunction - Función del servicio que genera el PDF
 * @param {number|string} id - ID del elemento para generar el PDF
 * @param {string} filename - Nombre base del archivo (sin extensión)
 */
export const generateAndDownloadPDF = async (serviceFunction, id, filename = 'document') => {
    try {
        const res = await serviceFunction(id);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        showSuccessAlert('PDF descargado correctamente');
    } catch (err) {
        console.error('Error descargando PDF:', err);
        showErrorAlert('No se pudo descargar el PDF');
    }
};
