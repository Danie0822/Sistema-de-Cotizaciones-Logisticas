
import { useEffect, useState } from 'react';
import { impuestosService } from '../../services/impuestosService';
import { tiposCargaService } from '../../services/tiposCargaService';
import TableComponent from '../../components/tables/TableComponent';
import ImpuestoCreateModal from '../../modals/Impuestos/ImpuestoCreateModal';
import ImpuestoEditModal from '../../modals/Impuestos/ImpuestoEditModal';
import { showDeleteConfirm } from '../../components/alerts/DeleteConfirm';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
import AddButton from '../../components/buttons/AddButton';

export default function Impuestos() {
    const [impuestos, setImpuestos] = useState([]);
    const [tiposCarga, setTiposCarga] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [impuestoEdit, setImpuestoEdit] = useState(null);

    // Obtener lista de impuestos desde la API
    const fetchImpuestos = async () => {
        setLoading(true);
        try {
            const data = await impuestosService.getAll();
            setImpuestos(data || []);
        } catch (err) {
            showErrorAlert('No se pudieron cargar los impuestos');
        } finally {
            setLoading(false);
        }
    };

    // Cargar tipos de carga para el dropdown
    const fetchTiposCarga = async () => {
        try {
            const data = await tiposCargaService.getAll();
            setTiposCarga(data);
        } catch (err) {
            console.error('Error cargando tipos de carga:', err);
        }
    };

    useEffect(() => {
        fetchImpuestos();
        fetchTiposCarga();
    }, []);

    const handleEdit = (row) => {
        setImpuestoEdit(row);
        setShowEdit(true);
    };

    const handleAdd = () => {
        setImpuestoEdit(null);
        setShowCreate(true);
    };

    const handleDelete = async (row) => {
        const ok = await showDeleteConfirm(`¿Eliminar impuesto: ${row.nombre}?`);
        if (ok === false) return;
        try {
            await impuestosService.delete(row.id);
            showSuccessAlert('Impuesto eliminado');
            fetchImpuestos();
        } catch (err) {
            showErrorAlert(err?.response?.data?.error || 'Error al eliminar');
        }
    };

    const headers = [
        { key: 'codigo', label: 'Código' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'tipoLabel', label: 'Tipo' },
        { key: 'valorLabel', label: 'Valor', align: 'center' },
        { key: 'aplicableLabel', label: 'Aplicable a' },
        { key: 'tipoCargaLabel', label: 'Tipo de Carga' },
        { key: 'activoLabel', label: 'Estado', align: 'center' },
    ];

    // Configuración de acciones de la tabla
    const actions = [
        {
            label: 'Editar',
            iconType: 'editar',
            variant: 'warning',
            onClick: handleEdit,
        },
        {
            label: 'Eliminar',
            iconType: 'eliminar',
            variant: 'danger',
            onClick: handleDelete,
        },
    ];

    // Adaptar los datos para render personalizado
    const data = impuestos.map(imp => ({
        ...imp,
        tipoLabel: imp.tipo === 'porcentaje' ? 'Porcentaje' : 'Monto Fijo',
        valorLabel: imp.tipo === 'porcentaje' ? `${imp.valor}%` : `L.${imp.valor}`,
        aplicableLabel: 
            imp.aplicable_a === 'subtotal_neto' ? 'Subtotal Neto' :
            imp.aplicable_a === 'total_bruto' ? 'Total Bruto' :
            imp.aplicable_a === 'tarifa_base' ? 'Tarifa Base' : imp.aplicable_a,
        tipoCargaLabel: imp.tipo_carga_id 
            ? (tiposCarga.find(tc => tc.id === imp.tipo_carga_id)?.nombre || 'Específico')
            : 'Todos',
        activoLabel: imp.activo ? (
            <span className="badge bg-success">Activo</span>
        ) : (
            <span className="badge bg-secondary">Inactivo</span>
        ),
    }));

    // Preparar options para los modales
    const tipoCargaOptions = [
        { value: '', label: 'Todos los tipos de carga' },
        ...tiposCarga.map(tc => ({ value: tc.id, label: tc.nombre }))
    ];

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Impuestos</h2>
                <AddButton onClick={handleAdd}>Agregar Impuesto</AddButton>
            </div>
            {loading ? (
                <div>Cargando...</div>
            ) : (
                <TableComponent
                    headers={headers}
                    data={data}
                    actions={actions}
                />
            )}
            <ImpuestoCreateModal
                show={showCreate}
                onClose={() => setShowCreate(false)}
                onSuccess={fetchImpuestos}
                tipoCargaOptions={tipoCargaOptions}
            />
            {impuestoEdit && (
                <ImpuestoEditModal
                    show={showEdit}
                    onClose={() => setShowEdit(false)}
                    onSuccess={fetchImpuestos}
                    impuesto={impuestoEdit}
                    tipoCargaOptions={tipoCargaOptions}
                />
            )}
        </div>
    );
}
