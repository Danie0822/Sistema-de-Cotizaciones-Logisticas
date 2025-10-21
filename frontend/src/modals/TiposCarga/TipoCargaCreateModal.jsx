import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ModalBase from '../../components/modals/ModalBase';
import TextField from '../../components/inputs/TextField';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
import { tiposCargaService } from '../../services/tiposCargaService';

const TipoCargaCreateModal = ({ show, onClose, token, onSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!nombre.trim()) {
      errs.nombre = 'El nombre es requerido.';
    } else if (nombre.length > 100) {
      errs.nombre = 'Máximo 100 caracteres.';
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
      await tiposCargaService.create({
        nombre: nombre.trim(),
        descripcion: descripcion.trim()
      });
      showSuccessAlert('Tipo de carga creado');
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      showErrorAlert(err?.response?.data?.error || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase show={show} onClose={onClose} header={<>
      <h5 className="modal-title">Agregar Tipo de Carga</h5>
      <button type="button" className="btn-close" onClick={onClose}></button>
    </>}>
      <form onSubmit={handleSubmit}>
        <TextField label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} error={errors.nombre} maxLength={100} />
        <div className="mb-3">
          <label>Descripción (opcional)</label>
          <textarea className="form-control" value={descripcion} onChange={e => setDescripcion(e.target.value)} maxLength={255} />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>Guardar</button>
        </div>
      </form>
    </ModalBase>
  );
};

TipoCargaCreateModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  token: PropTypes.string,
  onSuccess: PropTypes.func,
};

export default TipoCargaCreateModal;
