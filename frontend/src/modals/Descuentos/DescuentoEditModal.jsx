import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ModalBase from '../../components/modals/ModalBase';
import TextField from '../../components/inputs/TextField';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';

import { descuentosService } from '../../services/descuentosService';
import ComboBox from '../../components/inputs/ComboBox';

const DescuentoEditModal = ({ show, onClose, descuento, token, onSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [metodo, setMetodo] = useState('porcentaje');
  const [valor, setValor] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // Cargar datos del descuento cuando se abre el modal
  useEffect(() => {
    if (show && descuento) {
      setNombre(descuento.nombre_descuento || '');
      setMetodo(descuento.metodo || 'porcentaje');
      setValor(descuento.valor !== undefined ? descuento.valor : '');
    }
  }, [show, descuento]);
  // Validacion de campos
  const validate = () => {
    const errs = {};
    if (!nombre.trim()) {
      errs.nombre = 'El nombre es requerido.';
    } else if (nombre.length > 50) {
      errs.nombre = 'Máximo 50 caracteres.';
    }
    if (!['porcentaje', 'cuota_fija'].includes(metodo)) {
      errs.metodo = 'Método inválido.';
    }
    if (valor === '' || isNaN(valor) || Number(valor) < 0) {
      errs.valor = 'Valor debe ser un número mayor o igual a 0.';
    }
    return errs;
  };
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await descuentosService.update(descuento.id, {
        nombre_descuento: nombre.trim(),
        metodo,
        valor: Number(valor)
      });
      showSuccessAlert('Descuento actualizado');
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
      <h5 className="modal-title">Editar Descuento</h5>
      <button type="button" className="btn-close" onClick={onClose}></button>
    </>}>
      <form onSubmit={handleSubmit}>
        <TextField label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} error={errors.nombre} maxLength={50} />
        <ComboBox
          label="Método"
          value={metodo}
          onChange={setMetodo}
          options={[
            { label: 'Porcentaje', value: 'porcentaje' },
            { label: 'Cuota fija', value: 'cuota_fija' }
          ]}
          error={errors.metodo}
        />
        <TextField label="Valor" type="number" value={valor} onChange={e => setValor(e.target.value)} error={errors.valor} min={0} step="any"/>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>Guardar</button>
        </div>
      </form>
    </ModalBase>
  );
};

DescuentoEditModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  descuento: PropTypes.object,
  token: PropTypes.string,
  onSuccess: PropTypes.func,
};

export default DescuentoEditModal;
