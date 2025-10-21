
import { useEffect, useState } from 'react';
import { descuentosService } from '../../services/descuentosService';
import TableComponent from '../../components/tables/TableComponent';
import DescuentoCreateModal from '../../modals/Descuentos/DescuentoCreateModal';
import DescuentoEditModal from '../../modals/Descuentos/DescuentoEditModal';
import { showDeleteConfirm } from '../../components/alerts/DeleteConfirm';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
import AddButton from '../../components/buttons/AddButton';
export default function Descuentos() {
    const [descuentos, setDescuentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [descuentoEdit, setDescuentoEdit] = useState(null);

    const fetchDescuentos = async () => {
        setLoading(true);
        try {
            const data = await descuentosService.getAll();
            setDescuentos(data);
        } catch (err) {
            showErrorAlert('No se pudieron cargar los descuentos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDescuentos();
    }, []);

    const handleEdit = (row) => {
        setDescuentoEdit(row);
        setShowEdit(true);
    };

    const handleAdd = () => {
        setDescuentoEdit(null);
        setShowCreate(true);
    };

    const handleDelete = async (row) => {
        const ok = await showDeleteConfirm(`¿Eliminar descuento: ${row.nombre_descuento}?`);
        if (ok === false ) return;
        try {
            await descuentosService.delete(row.id);
            showSuccessAlert('Descuento eliminado');
            fetchDescuentos();
        } catch (err) {
            showErrorAlert(err?.response?.data?.error || 'Error al eliminar');
        }
    };

    const headers = [
        { key: 'nombre_descuento', label: 'Nombre' },
        { key: 'metodoLabel', label: 'Método' },
        { key: 'valorLabel', label: 'Valor', align: 'center' },
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

    // Adaptar los datos para render personalizado
    const data = descuentos.map(r => ({
        ...r,
        metodoLabel: r.metodo === 'cuota_fija' ? 'Cuota fija' : r.metodo === 'porcentaje' ? 'Porcentaje' : r.metodo,
        valorLabel: r.metodo === 'porcentaje' ? `${r.valor} %` : r.valor,
    }));

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Descuentos</h2>
                  <AddButton onClick={handleAdd}>Agregar Descuento</AddButton>
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
            <DescuentoCreateModal
                show={showCreate}
                onClose={() => setShowCreate(false)}
                onSuccess={fetchDescuentos}
            />
            <DescuentoEditModal
                show={showEdit}
                onClose={() => setShowEdit(false)}
                descuento={descuentoEdit}
                onSuccess={fetchDescuentos}
            />
        </div>
    );
}
