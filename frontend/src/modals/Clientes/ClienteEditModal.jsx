import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ModalBase from '../../components/modals/ModalBase';
import TextField from '../../components/inputs/TextField';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
import { clientesService } from '../../services/clientesService';

const ClienteEditModal = ({ show, onClose, cliente, token, onSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && cliente) {
      setNombre(cliente.nombre || '');
      setContacto(cliente.contacto || '');
    }
  }, [show, cliente]);

  const validate = () => {
    const errs = {};
    if (!nombre.trim()) {
      errs.nombre = 'El nombre es requerido.';
    } else if (nombre.length > 100) {
      errs.nombre = 'Máximo 100 caracteres.';
    }
    if (contacto && contacto.length > 100) {
      errs.contacto = 'Máximo 100 caracteres.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
  await clientesService.update(cliente.id, { nombre: nombre.trim(), contacto: contacto.trim() });
      showSuccessAlert('Cliente actualizado');
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
     showErrorAlert(err?.response?.data?.error || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase
      show={show}
      onClose={onClose}
      header={
        <>
          <h5 className="modal-title">Editar Cliente</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </>
      }
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button type="submit" form="cliente-edit-form" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : null}
            Guardar Cambios
          </button>
        </>
      }
    >
      <form id="cliente-edit-form" onSubmit={handleSubmit} autoComplete="off">
        <TextField
          id="cliente-edit-nombre"
          label="Nombre *"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          maxLength={100}
          error={errors.nombre}
          required
        />
        <TextField
          id="cliente-edit-contacto"
          label="Contacto"
          value={contacto}
          onChange={e => setContacto(e.target.value)}
          maxLength={100}
          error={errors.contacto}
        />
      </form>
    </ModalBase>
  );
};

ClienteEditModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cliente: PropTypes.object,
  token: PropTypes.string.isRequired,
  onSuccess: PropTypes.func
};

export default ClienteEditModal;
