import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ModalBase from '../../components/modals/ModalBase';
import TextField from '../../components/inputs/TextField';
import ComboBox from '../../components/inputs/ComboBox';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
import { tarifasBaseService } from '../../services/tarifasBaseService';

const TarifaBaseEditModal = ({ show, onClose, tarifa, onSuccess, clienteOptions, tipoCargaOptions, unidadOptions }) => {
  const [clienteId, setClienteId] = useState('');
  const [tipoCargaId, setTipoCargaId] = useState('');
  const [unidadId, setUnidadId] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [vigenciaDesde, setVigenciaDesde] = useState('');
  const [vigenciaHasta, setVigenciaHasta] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && tarifa) {
      setClienteId(tarifa.cliente_id || '');
      setTipoCargaId(tarifa.tipo_carga_id || '');
      setUnidadId(tarifa.unidad_id || '');
      setPrecioUnitario(tarifa.precio_unitario !== undefined ? tarifa.precio_unitario : '');
      setVigenciaDesde(tarifa.vigencia_desde || '');
      setVigenciaHasta(tarifa.vigencia_hasta || '');
    }
  }, [show, tarifa]);

  const validate = () => {
    const errs = {};
    if (!tipoCargaId) errs.tipoCargaId = 'Tipo de carga requerido.';
    if (!unidadId) errs.unidadId = 'Unidad requerida.';
    if (precioUnitario === '' || isNaN(precioUnitario) || Number(precioUnitario) < 0) errs.precioUnitario = 'Precio unitario debe ser >= 0.';
    if (!vigenciaDesde) errs.vigenciaDesde = 'Vigencia desde requerida.';
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
      await tarifasBaseService.update(tarifa.id, {
        cliente_id: clienteId === '' ? null : clienteId,
        tipo_carga_id: tipoCargaId,
        unidad_id: unidadId,
        precio_unitario: Number(precioUnitario),
        vigencia_desde: vigenciaDesde,
        vigencia_hasta: vigenciaHasta === '' || vigenciaHasta === 'Sin vigencia' ? null : vigenciaHasta
      });
      showSuccessAlert('Tarifa base actualizada');
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      showErrorAlert(err?.response?.data?.error || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase show={show} onClose={onClose} header={
      <>
        <h5 className="modal-title">Editar Tarifa Base</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </>
    }>
      <form onSubmit={handleSubmit}>
        <ComboBox label="Cliente (opcional)" value={clienteId} onChange={setClienteId} options={clienteOptions} error={errors.clienteId} />
        <ComboBox label="Tipo de carga" value={tipoCargaId} onChange={setTipoCargaId} options={tipoCargaOptions} error={errors.tipoCargaId} />
        <ComboBox label="Unidad" value={unidadId} onChange={setUnidadId} options={unidadOptions} error={errors.unidadId} />
        <TextField label="Precio unitario" type="number" value={precioUnitario} onChange={e => setPrecioUnitario(e.target.value)} error={errors.precioUnitario} min={0} step="any" />
        <TextField label="Vigencia desde" type="date" value={vigenciaDesde} onChange={e => setVigenciaDesde(e.target.value)} error={errors.vigenciaDesde} />
        <TextField label="Vigencia hasta (opcional)" type="date" value={vigenciaHasta} onChange={e => setVigenciaHasta(e.target.value)} error={errors.vigenciaHasta} />
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>Guardar</button>
        </div>
      </form>
    </ModalBase>
  );
};

TarifaBaseEditModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tarifa: PropTypes.object,
  onSuccess: PropTypes.func,
  clienteOptions: PropTypes.array.isRequired,
  tipoCargaOptions: PropTypes.array.isRequired,
  unidadOptions: PropTypes.array.isRequired
};

export default TarifaBaseEditModal;
