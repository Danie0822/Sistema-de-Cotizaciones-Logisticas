import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ModalBase from '../../components/modals/ModalBase';
import TextField from '../../components/inputs/TextField';
import ComboBox from '../../components/inputs/ComboBox';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
import { reglasCargoService } from '../../services/reglasCargoService';

const metodoOptions = [
  { label: 'Porcentaje', value: 'porcentaje' },
  { label: 'Cuota Fija', value: 'cuota_fija' }
];

const ReglaCargoCreateModal = ({ show, onClose, token, onSuccess, tipoCargaOptions }) => {
  const [tipoCargaId, setTipoCargaId] = useState('');
  const [nombreRubro, setNombreRubro] = useState('');
  const [pesoMin, setPesoMin] = useState('');
  const [pesoMax, setPesoMax] = useState('');
  const [metodo, setMetodo] = useState('porcentaje');
  const [valor, setValor] = useState('');
  const [orden, setOrden] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!tipoCargaId) errs.tipoCargaId = 'Tipo de carga requerido.';
    if (!nombreRubro.trim()) errs.nombreRubro = 'Nombre requerido.';
    else if (nombreRubro.length > 50) errs.nombreRubro = 'Máximo 50 caracteres.';
    if (!['porcentaje', 'cuota_fija'].includes(metodo)) errs.metodo = 'Método inválido.';
    if (valor === '' || isNaN(valor) || Number(valor) < 0) errs.valor = 'Valor debe ser un número mayor o igual a 0.';
    if (orden === '' || isNaN(orden) || Number(orden) < 0) errs.orden = 'Orden debe ser un entero mayor o igual a 0.';
    if (pesoMin !== '' && (isNaN(pesoMin) || Number(pesoMin) < 0)) errs.pesoMin = 'Peso mínimo debe ser >= 0.';
    if (pesoMax !== '' && (isNaN(pesoMax) || Number(pesoMax) < 0)) errs.pesoMax = 'Peso máximo debe ser >= 0.';
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
      await reglasCargoService.create({
        tipo_carga_id: tipoCargaId,
        nombre_rubro: nombreRubro.trim(),
        peso_min: pesoMin === '' ? null : Number(pesoMin),
        peso_max: pesoMax === '' ? null : Number(pesoMax),
        metodo,
        valor: Number(valor),
        orden: Number(orden)
      });
      showSuccessAlert('Regla de cargo creada');
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
      <h5 className="modal-title">Agregar Regla de Cargo</h5>
      <button type="button" className="btn-close" onClick={onClose}></button>
    </>}>
      <form onSubmit={handleSubmit}>
        <ComboBox
          label="Tipo de carga"
          value={tipoCargaId}
          onChange={setTipoCargaId}
          options={tipoCargaOptions}
          error={errors.tipoCargaId}
        />
        <TextField label="Nombre del rubro" value={nombreRubro} onChange={e => setNombreRubro(e.target.value)} error={errors.nombreRubro} maxLength={50} />
        <TextField label="Peso mínimo (Opcional)" type="number" value={pesoMin} onChange={e => setPesoMin(e.target.value)} error={errors.pesoMin} min={0} />
        <TextField label="Peso máximo (Opcional)" type="number" value={pesoMax} onChange={e => setPesoMax(e.target.value)} error={errors.pesoMax} min={0} />
        <ComboBox
          label="Método"
          value={metodo}
          onChange={setMetodo}
          options={metodoOptions}
          error={errors.metodo}
        />
        <TextField label="Valor" type="number" value={valor} onChange={e => setValor(e.target.value)} error={errors.valor} min={0} step="any"/>
        <TextField label="Orden" type="number" value={orden} onChange={e => setOrden(e.target.value)} error={errors.orden} min={0} />
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>Guardar</button>
        </div>
      </form>
    </ModalBase>
  );
};

ReglaCargoCreateModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  token: PropTypes.string,
  onSuccess: PropTypes.func,
  tipoCargaOptions: PropTypes.array.isRequired
};

export default ReglaCargoCreateModal;
