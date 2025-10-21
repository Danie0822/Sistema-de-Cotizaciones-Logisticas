import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ModalBase from '../../components/modals/ModalBase';
import TextField from '../../components/inputs/TextField';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
import { unidadesMedidaService } from '../../services/unidadesMedidaService';

const UnidadMedidaEditModal = ({ show, onClose, unidad, token, onSuccess }) => {
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && unidad) {
      setCodigo(unidad.codigo || '');
      setDescripcion(unidad.descripcion || '');
    }
  }, [show, unidad]);
  // Validación de campos
  const validate = () => {
    const errs = {};
    if (!codigo.trim()) {
      errs.codigo = 'El código es requerido.';
    } else if (codigo.length > 10) {
      errs.codigo = 'Máximo 10 caracteres.';
    }
    if (!descripcion.trim()) {
      errs.descripcion = 'La descripción es requerida.';
    } else if (descripcion.length > 50) {
      errs.descripcion = 'Máximo 50 caracteres.';
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
      await unidadesMedidaService.update(unidad.id, {
        codigo: codigo.trim(),
        descripcion: descripcion.trim()
      });
      showSuccessAlert('Unidad de medida actualizada');
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
      <h5 className="modal-title">Editar Unidad de Medida</h5>
      <button type="button" className="btn-close" onClick={onClose}></button>
    </>}>
      <form onSubmit={handleSubmit}>
        <TextField label="Código" value={codigo} onChange={e => setCodigo(e.target.value)} error={errors.codigo} maxLength={10} />
        <TextField label="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} error={errors.descripcion} maxLength={50} />
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>Guardar</button>
        </div>
      </form>
    </ModalBase>
  );
};

UnidadMedidaEditModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  unidad: PropTypes.object,
  token: PropTypes.string,
  onSuccess: PropTypes.func,
};

export default UnidadMedidaEditModal;
