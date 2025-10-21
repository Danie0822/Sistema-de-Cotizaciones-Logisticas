
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {clientesService} from '../../services/clientesService';
import Swal from 'sweetalert2';
import TableComponent from '../../components/tables/TableComponent';
import AddButton from '../../components/buttons/AddButton';
import ClienteCreateModal from '../../modals/Clientes/ClienteCreateModal';
import ClienteEditModal from '../../modals/Clientes/ClienteEditModal';
import { showDeleteConfirm } from '../../components/alerts/DeleteConfirm';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
export default function Clientes() {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);

    // TODO: Reemplaza esto por la obtención real del token admin
    const token = localStorage.getItem('token') || '';

    // Obtener lista de clientes desde la API
    const fetchClientes = async () => {
        setLoading(true);
        try {
            const data = await clientesService.getAll();
            setClientes(data);
        } catch (err) {
            showErrorAlert('Error al obtener clientes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleAdd = () => {
        setShowCreate(true);
    };

    const handleEdit = (row) => {
        setSelectedCliente(row);
        setShowEdit(true);
    };

    const deleteCliente = async (row) => {
        const confirmed = await showDeleteConfirm(`¿Estás seguro de que deseas eliminar al cliente: ${row.nombre}?`, 'Eliminar Cliente');
        if (confirmed === true) {
            try {
                await clientesService.delete(row.id);
                showSuccessAlert('Cliente eliminado');
                fetchClientes(); // Recargar lista
            } catch (err) {
                showErrorAlert('Error al eliminar cliente');
            }
        }
    };

// Configuracion de acciones para cada fila de la tabla
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
        onClick: deleteCliente,
    },
    {
        label: 'Tarifas Base',
        iconType: 'tarifas',
        variant: 'info',
        onClick: (row) => {
            navigate(`/tarifasBase/${row.id}`);
        },
    },
];

const headers = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'contacto', label: 'Contacto' },
];

return (
    <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Clientes</h2>
            <AddButton onClick={handleAdd}>Agregar Cliente</AddButton>
        </div>
        {loading ? (
            <div>Cargando...</div>
        ) : (
            <TableComponent
                headers={headers}
                data={clientes}
                actions={actions}
            />
        )}
        <ClienteCreateModal
            show={showCreate}
            onClose={() => setShowCreate(false)}
            token={token}
            onSuccess={fetchClientes}
        />
        <ClienteEditModal
            show={showEdit}
            onClose={() => setShowEdit(false)}
            cliente={selectedCliente}
            token={token}
            onSuccess={fetchClientes}
        />
    </div>
);
}
