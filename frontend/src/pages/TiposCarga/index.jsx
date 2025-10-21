
import { useEffect, useState } from 'react';
import { tiposCargaService } from '../../services/tiposCargaService';
import TableComponent from '../../components/tables/TableComponent';
import TipoCargaCreateModal from '../../modals/TiposCarga/TipoCargaCreateModal';
import TipoCargaEditModal from '../../modals/TiposCarga/TipoCargaEditModal';
import { showDeleteConfirm } from '../../components/alerts/DeleteConfirm';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
import AddButton from '../../components/buttons/AddButton';
export default function TiposCarga() {
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [tipoEdit, setTipoEdit] = useState(null);

    const fetchTipos = async () => {
        setLoading(true);
        try {
            const data = await tiposCargaService.getAll();
            setTipos(data);
        } catch (err) {
            showErrorAlert('No se pudieron cargar los tipos de carga');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTipos();
    }, []);

    const handleEdit = (row) => {
        setTipoEdit(row);
        setShowEdit(true);
    };

    const handleAdd = () => {
        setTipoEdit(null);
        setShowCreate(true);
    };

    const handleDelete = async (row) => {
        const ok = await showDeleteConfirm(`¿Eliminar tipo de carga: ${row.nombre}?`);
        if (ok === false) return;
        try {
            await tiposCargaService.delete(row.id);
            showSuccessAlert('Tipo de carga eliminado');
            fetchTipos();
        } catch (err) {
            showErrorAlert(err?.response?.data?.error || 'Error al eliminar');
        }
    };

    const headers = [
        { key: 'nombre', label: 'Nombre' },
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
                <h2>Tipos de Carga</h2>
                <AddButton onClick={handleAdd}>Agregar Tipo de Carga</AddButton>
            </div>
            {loading ? (
                <div>Cargando...</div>
            ) : (
                <TableComponent
                    headers={headers}
                    data={tipos}
                    actions={actions}
                />
            )}
            <TipoCargaCreateModal
                show={showCreate}
                onClose={() => setShowCreate(false)}
                onSuccess={fetchTipos}
            />
            <TipoCargaEditModal
                show={showEdit}
                onClose={() => setShowEdit(false)}
                tipoCarga={tipoEdit}
                onSuccess={fetchTipos}
            />
        </div>
    );
}
