
import { useEffect, useState } from 'react';
import { unidadesMedidaService } from '../../services/unidadesMedidaService';
import TableComponent from '../../components/tables/TableComponent';
import UnidadMedidaCreateModal from '../../modals/UnidadesMedida/UnidadMedidaCreateModal';
import UnidadMedidaEditModal from '../../modals/UnidadesMedida/UnidadMedidaEditModal';
import { showDeleteConfirm } from '../../components/alerts/DeleteConfirm';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
import AddButton from '../../components/buttons/AddButton';
export default function UnidadesMedida() {
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [unidadEdit, setUnidadEdit] = useState(null);

    const fetchUnidades = async () => {
        setLoading(true);
        try {
            const data = await unidadesMedidaService.getAll();
            setUnidades(data);
        } catch (err) {
            showErrorAlert('No se pudieron cargar las unidades de medida');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnidades();
    }, []);

    const handleEdit = (row) => {
        setUnidadEdit(row);
        setShowEdit(true);
    };

    const handleAdd = () => {
        setUnidadEdit(null);
        setShowCreate(true);
    };

    const handleDelete = async (row) => {
        const ok = await showDeleteConfirm(`¿Eliminar unidad: ${row.codigo}?`);
        if (!ok) return;
        try {
            await unidadesMedidaService.delete(row.id);
            showSuccessAlert('Unidad de medida eliminada');
            fetchUnidades();
        } catch (err) {
            showErrorAlert(err?.response?.data?.error || 'Error al eliminar');
        }
    };

    const headers = [
        { key: 'codigo', label: 'Código' },
        { key: 'descripcion', label: 'Descripción' },
    ];

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

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Unidades de Medida</h2>
               <AddButton onClick={handleAdd}>Agregar Unidad de Medida</AddButton>
            </div>
            {loading ? (
                <div>Cargando...</div>
            ) : (
                <TableComponent
                    headers={headers}
                    data={unidades}
                    actions={actions}
                />
            )}
            <UnidadMedidaCreateModal
                show={showCreate}
                onClose={() => setShowCreate(false)}
                onSuccess={fetchUnidades}
            />
            <UnidadMedidaEditModal
                show={showEdit}
                onClose={() => setShowEdit(false)}
                unidad={unidadEdit}
                onSuccess={fetchUnidades}
            />
        </div>
    );
}
