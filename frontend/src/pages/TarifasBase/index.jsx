

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tarifasBaseService } from '../../services/tarifasBaseService';
import { clientesService } from '../../services/clientesService';
import { tiposCargaService } from '../../services/tiposCargaService';
import { unidadesMedidaService } from '../../services/unidadesMedidaService';
import TableComponent from '../../components/tables/TableComponent';
import TarifaBaseCreateModal from '../../modals/TarifasBase/TarifaBaseCreateModal';
import TarifaBaseEditModal from '../../modals/TarifasBase/TarifaBaseEditModal';
import { showDeleteConfirm } from '../../components/alerts/DeleteConfirm';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
import AddButton from '../../components/buttons/AddButton';
export default function TarifasBase() {
    const { clientId } = useParams();
    const [tarifas, setTarifas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [tarifaEdit, setTarifaEdit] = useState(null);
    const [clienteOptions, setClienteOptions] = useState([]);
    const [tipoCargaOptions, setTipoCargaOptions] = useState([]);
    const [unidadOptions, setUnidadOptions] = useState([]);

    const fetchTarifas = async () => {
        setLoading(true);
        try {
            let data;
            if (clientId) {
                data = await tarifasBaseService.getByClientId(clientId);
            } else {
                data = await tarifasBaseService.getAll();
            }
            setTarifas(data);
        } catch (err) {
            showErrorAlert('No se pudieron cargar las tarifas base');
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

    useEffect(() => {
        fetchTarifas();
        fetchClienteOptions();
        fetchTipoCargaOptions();
        fetchUnidadOptions();
    }, []);

    const handleEdit = (row) => {
        setTarifaEdit(row);
        setShowEdit(true);
    };

    const handleDelete = async (row) => {
        const ok = await showDeleteConfirm('¿Eliminar tarifa base?');
        if (!ok) return;
        try {
            await tarifasBaseService.delete(row.id);
            showSuccessAlert('Tarifa base eliminada');
            fetchTarifas();
        } catch (err) {
            showErrorAlert(err?.response?.data?.error || 'Error al eliminar');
        }
    };

    const headers = [
        { key: 'cliente', label: 'Cliente' },
        { key: 'tipoCarga', label: 'Tipo de carga' },
        { key: 'unidadMedida', label: 'Unidad de medida' },
        { key: 'precio_unitario', label: 'Precio unitario', align: 'center' },
        { key: 'vigencia_desde', label: 'Desde' },
        { key: 'vigencia_hasta', label: 'Hasta' },
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

    // Adaptar los datos para mostrar los campos anidados
    const data = tarifas.map(t => ({
        ...t,
        cliente: t.cliente?.nombre ?? 'No disponible',
        tipoCarga: t.tipoCarga?.nombre ?? 'No disponible',
        unidadMedida: t.unidadMedida?.codigo ?? 'No disponible',
        vigencia_hasta: t.vigencia_hasta || 'Sin vigencia',
    }));

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Tarifas Base</h2>
                <AddButton onClick={() => setShowCreate(true)} />
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
            <TarifaBaseCreateModal
                show={showCreate}
                onClose={() => setShowCreate(false)}
                onSuccess={fetchTarifas}
                clienteOptions={clienteOptions}
                tipoCargaOptions={tipoCargaOptions}
                unidadOptions={unidadOptions}
            />
            <TarifaBaseEditModal
                show={showEdit}
                onClose={() => setShowEdit(false)}
                tarifa={tarifaEdit}
                onSuccess={fetchTarifas}
                clienteOptions={clienteOptions}
                tipoCargaOptions={tipoCargaOptions}
                unidadOptions={unidadOptions}
            />
        </div>
    );
}
