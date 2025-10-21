

import { useEffect, useState } from 'react';
import { reglasCargoService } from '../../services/reglasCargoService';
import { tiposCargaService } from '../../services/tiposCargaService';
import TableComponent from '../../components/tables/TableComponent';
import ReglaCargoCreateModal from '../../modals/ReglasCargo/ReglaCargoCreateModal';
import ReglaCargoEditModal from '../../modals/ReglasCargo/ReglaCargoEditModal';
import { showDeleteConfirm } from '../../components/alerts/DeleteConfirm';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
import AddButton from '../../components/buttons/AddButton';
export default function ReglasCargo() {
    const [reglas, setReglas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [reglaEdit, setReglaEdit] = useState(null);
    const [tipoCargaOptions, setTipoCargaOptions] = useState([]);
    // Obtener lista de reglas de cargo desde la API
    const fetchReglas = async () => {
        setLoading(true);
        try {
            const data = await reglasCargoService.getAll();
            setReglas(data);
        } catch (err) {
            showErrorAlert('No se pudieron cargar las reglas de cargo');
        } finally {
            setLoading(false);
        }
    };
    // Obtener opciones de tipo de carga para selects
    const fetchTipoCargaOptions = async () => {
        try {
            const tipos = await tiposCargaService.getAll();
            setTipoCargaOptions(
                (tipos || []).map(tc => ({ label: tc.nombre, value: tc.id }))
            );
        } catch (err) {
            setTipoCargaOptions([]);
        }
    };

    useEffect(() => {
        fetchReglas();
        fetchTipoCargaOptions();
    }, []);

    const handleEdit = (row) => {
        setReglaEdit(row);
        setShowEdit(true);
    };
    const handleAdd = () => {
        setReglaEdit(null);
        setShowCreate(true);
    };

    const handleDelete = async (row) => {
        const ok = await showDeleteConfirm(`¿Eliminar regla: ${row.nombre_rubro}?`);
        if (!ok) return;
        try {
            await reglasCargoService.delete(row.id);
            showSuccessAlert('Regla de cargo eliminada');
            fetchReglas();
        } catch (err) {
            showErrorAlert(err?.response?.data?.error || 'Error al eliminar');
        }
    };

    const headers = [
        { key: 'tipoCarga', label: 'Tipo de carga' },
        { key: 'nombre_rubro', label: 'Nombre' },
        { key: 'metodoLabel', label: 'Método' },
        { key: 'valorLabel', label: 'Valor', align: 'center' },
        { key: 'orden', label: 'Orden', align: 'center' },
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
    const data = reglas.map(r => ({
        ...r,
        tipoCarga: r.tipoCarga?.nombre || r.tipo_carga_nombre || '',
        metodoLabel: r.metodo === 'cuota_fija' ? 'Cuota fija' : r.metodo === 'porcentaje' ? 'Porcentaje' : r.metodo,
        valorLabel: r.metodo === 'porcentaje' ? `${r.valor} %` : r.valor,
    }));

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Reglas de Cargo</h2>
                <AddButton onClick={handleAdd}>Agregar Regla</AddButton>
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
            <ReglaCargoCreateModal
                show={showCreate}
                onClose={() => setShowCreate(false)}
                onSuccess={fetchReglas}
                tipoCargaOptions={tipoCargaOptions}
            />
            <ReglaCargoEditModal
                show={showEdit}
                onClose={() => setShowEdit(false)}
                regla={reglaEdit}
                onSuccess={fetchReglas}
                tipoCargaOptions={tipoCargaOptions}
            />
        </div>
    );
}
