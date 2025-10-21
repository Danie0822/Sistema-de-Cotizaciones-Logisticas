
import { useEffect, useState } from 'react';
import { cotizacionesService } from '../../services/cotizacionesService';
import { clientesService } from '../../services/clientesService';
import { tiposCargaService } from '../../services/tiposCargaService';
import { unidadesMedidaService } from '../../services/unidadesMedidaService';
import { descuentosService } from '../../services/descuentosService';
import TableComponent from '../../components/tables/TableComponent';
import CotizacionCreateModal from '../../modals/Cotizaciones/CotizacionCreateModal';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
import { generateAndViewPDF } from '../../utils/pdfUtils';
import { formatDateOnly } from '../../utils/dateUtils';
import AddButton from '../../components/buttons/AddButton';

export default function Cotizaciones() {
    const [cotizaciones, setCotizaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [clienteOptions, setClienteOptions] = useState([]);
    const [tipoCargaOptions, setTipoCargaOptions] = useState([]);
    const [unidadOptions, setUnidadOptions] = useState([]);
    const [descuentoOptions, setDescuentoOptions] = useState([]);

    const fetchCotizaciones = async () => {
        setLoading(true);
        try {
            const data = await cotizacionesService.getAll();
            setCotizaciones(data);
        } catch (err) {
            showErrorAlert('No se pudieron cargar las cotizaciones');
        } finally {
            setLoading(false);
        }
    };

    const fetchClienteOptions = async () => {
        try {
            const clientes = await clientesService.getAll();
            setClienteOptions((clientes || []).map(c => ({ label: c.nombre, value: c.id })));
        } catch {
            setClienteOptions([]);
        }
    };

    const fetchTipoCargaOptions = async () => {
        try {
            const tipos = await tiposCargaService.getAll();
            setTipoCargaOptions((tipos || []).map(tc => ({ label: tc.nombre, value: tc.id })));
        } catch {
            setTipoCargaOptions([]);
        }
    };

    const fetchUnidadOptions = async () => {
        try {
            const unidades = await unidadesMedidaService.getAll();
            setUnidadOptions((unidades || []).map(u => ({ label: u.codigo, value: u.id })));
        } catch {
            setUnidadOptions([]);
        }
    };

    const fetchDescuentoOptions = async () => {
        try {
            const descuentos = await descuentosService.getAll();
            setDescuentoOptions((descuentos || []).map(d => ({ label: d.nombre_descuento, value: d.id })));
        } catch {
            setDescuentoOptions([]);
        }
    };

    useEffect(() => {
        fetchCotizaciones();
        fetchClienteOptions();
        fetchTipoCargaOptions();
        fetchUnidadOptions();
        fetchDescuentoOptions();
    }, []);

    const handleGenerarReportePDF = async (row) => {
        await generateAndViewPDF(
            cotizacionesService.generarReportePDF,
            row.id,
            `cotizacion_${row.id}`,
            'Reporte de Cotización'
        );
    };

    const headers = [
        { key: 'cliente.nombre', label: 'Cliente' },
        { key: 'tipoCarga.nombre', label: 'Tipo de carga' },
        { key: 'unidadMedida.codigo', label: 'Unidad' },
        { key: 'fecha_cotizacion', label: 'Fecha', align: 'center' },
        { key: 'monto_total', label: 'Monto', align: 'center' },
    ];

    const actions = [
        {
            label: 'Generar PDF',
            iconType: 'pdf',
            variant: 'success',
            onClick: handleGenerarReportePDF,
        },
    ];

    return (
        <div className="container py-4">
            <h2>Cotizaciones</h2>
            <div className="mb-3 d-flex justify-content-end">
                <AddButton onClick={() => setShowCreate(true)} label="Crear Cotización" />
            </div>
            {loading ? (
                <div>Cargando...</div>
            ) : (
                <TableComponent
                    headers={headers}
                    data={cotizaciones}
                    actions={actions}
                    renderCell={(row, header) => {
                        const key = typeof header === 'string' ? header : header.key;
                        let value = key.includes('.')
                            ? key.split('.').reduce((acc, k) => acc && acc[k], row)
                            : row[key];
                        
                        // Formatear fecha_cotizacion para mostrar solo la fecha
                        if (key === 'fecha_cotizacion' && value) {
                            return formatDateOnly(value);
                        }
                        
                        if (typeof value === 'object' && value !== null) {
                            // Si accidentalmente es objeto, mostrar string vacía
                            return '';
                        }
                        return value ?? '';
                    }}
                />
            )}
            <CotizacionCreateModal
                show={showCreate}
                onClose={() => setShowCreate(false)}
                onSuccess={fetchCotizaciones}
                clienteOptions={clienteOptions}
                tipoCargaOptions={tipoCargaOptions}
                unidadOptions={unidadOptions}
                descuentoOptions={descuentoOptions}
            />
        </div>
    );
}
