import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ModalBase from '../../components/modals/ModalBase';
import TextField from '../../components/inputs/TextField';
import ComboBox from '../../components/inputs/ComboBox';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
import { impuestosService } from '../../services/impuestosService';

const ImpuestoEditModal = ({ show, onClose, onSuccess, impuesto, tipoCargaOptions }) => {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('porcentaje');
  const [valor, setValor] = useState('');
  const [aplicableA, setAplicableA] = useState('subtotal_neto');
  const [tipoCargaId, setTipoCargaId] = useState('');
  const [esAcumulativo, setEsAcumulativo] = useState(false);
  const [vigenciaDesde, setVigenciaDesde] = useState('');
  const [vigenciaHasta, setVigenciaHasta] = useState('');
  const [activo, setActivo] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Cargar datos del impuesto al abrir el modal
  useEffect(() => {
    if (impuesto && show) {
      setCodigo(impuesto.codigo || '');
      setNombre(impuesto.nombre || '');
      setTipo(impuesto.tipo || 'porcentaje');
      setValor(impuesto.valor || '');
      setAplicableA(impuesto.aplicable_a || 'subtotal_neto');
      setTipoCargaId(impuesto.tipo_carga_id || '');
      setEsAcumulativo(impuesto.es_acumulativo || false);
      setVigenciaDesde(impuesto.vigencia_desde ? impuesto.vigencia_desde.split('T')[0] : '');
      setVigenciaHasta(impuesto.vigencia_hasta ? impuesto.vigencia_hasta.split('T')[0] : '');
      setActivo(impuesto.activo !== undefined ? impuesto.activo : true);
      setErrors({});
    }
  }, [impuesto, show]);

  // Validación de campos
  const validate = () => {
    const errs = {};
    if (!codigo.trim()) {
      errs.codigo = 'El código es requerido.';
    } else if (codigo.length > 20) {
      errs.codigo = 'Máximo 20 caracteres.';
    }
    if (!nombre.trim()) {
      errs.nombre = 'El nombre es requerido.';
    } else if (nombre.length > 100) {
      errs.nombre = 'Máximo 100 caracteres.';
    }
    if (!['porcentaje', 'monto_fijo'].includes(tipo)) {
      errs.tipo = 'Tipo inválido.';
    }
    if (valor === '' || isNaN(valor) || Number(valor) < 0) {
      errs.valor = 'Valor debe ser un número mayor o igual a 0.';
    }
    if (!['subtotal_neto', 'total_bruto', 'tarifa_base'].includes(aplicableA)) {
      errs.aplicableA = 'Base de cálculo inválida.';
    }
    if (!vigenciaDesde) {
      errs.vigenciaDesde = 'Fecha de inicio es requerida.';
    }
    if (vigenciaHasta && vigenciaDesde && new Date(vigenciaHasta) < new Date(vigenciaDesde)) {
      errs.vigenciaHasta = 'Fecha de fin debe ser posterior a fecha de inicio.';
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
      await impuestosService.update(impuesto.id, {
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        tipo,
        valor: Number(valor),
        aplicable_a: aplicableA,
        tipo_carga_id: tipoCargaId || null,
        es_acumulativo: esAcumulativo,
        vigencia_desde: vigenciaDesde,
        vigencia_hasta: vigenciaHasta || null,
        activo
      });
      showSuccessAlert('Impuesto actualizado exitosamente');
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
        <h5 className="modal-title">Editar Impuesto</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </>
    }>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <TextField 
              label="Código" 
              value={codigo} 
              onChange={e => setCodigo(e.target.value)} 
              error={errors.codigo} 
              maxLength={20} 
              placeholder="IVA, ISV, etc."
            />
          </div>
          <div className="col-md-6">
            <TextField 
              label="Nombre" 
              value={nombre} 
              onChange={e => setNombre(e.target.value)} 
              error={errors.nombre} 
              maxLength={100} 
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <ComboBox
              label="Tipo"
              value={tipo}
              onChange={setTipo}
              options={[
                { label: 'Porcentaje', value: 'porcentaje' },
                { label: 'Monto Fijo', value: 'monto_fijo' }
              ]}
              error={errors.tipo}
            />
          </div>
          <div className="col-md-6">
            <TextField 
              label="Valor" 
              type="number" 
              value={valor} 
              onChange={e => setValor(e.target.value)} 
              error={errors.valor} 
              min={0} 
              step="0.01"
            />
          </div>
        </div>

        <ComboBox
          label="Aplicable a"
          value={aplicableA}
          onChange={setAplicableA}
          options={[
            { label: 'Subtotal Neto', value: 'subtotal_neto' },
            { label: 'Total Bruto', value: 'total_bruto' },
            { label: 'Tarifa Base', value: 'tarifa_base' }
          ]}
          error={errors.aplicableA}
        />

        <ComboBox
          label="Tipo de Carga"
          value={tipoCargaId}
          onChange={setTipoCargaId}
          options={tipoCargaOptions}
          placeholder="Seleccionar tipo de carga"
        />

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={esAcumulativo}
            onChange={e => setEsAcumulativo(e.target.checked)}
            id="esAcumulativoEdit"
          />
          <label className="form-check-label" htmlFor="esAcumulativoEdit">
            Es acumulativo (otros impuestos se calculan sobre este)
          </label>
        </div>

        <div className="row">
          <div className="col-md-6">
            <TextField 
              label="Vigencia Desde" 
              type="date" 
              value={vigenciaDesde} 
              onChange={e => setVigenciaDesde(e.target.value)} 
              error={errors.vigenciaDesde} 
            />
          </div>
          <div className="col-md-6">
            <TextField 
              label="Vigencia Hasta (opcional)" 
              type="date" 
              value={vigenciaHasta} 
              onChange={e => setVigenciaHasta(e.target.value)} 
              error={errors.vigenciaHasta} 
            />
          </div>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={activo}
            onChange={e => setActivo(e.target.checked)}
            id="activoEdit"
          />
          <label className="form-check-label" htmlFor="activoEdit">
            Activo
          </label>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Actualizar
          </button>
        </div>
      </form>
    </ModalBase>
  );
};

ImpuestoEditModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  impuesto: PropTypes.object.isRequired,
  tipoCargaOptions: PropTypes.array.isRequired,
};

export default ImpuestoEditModal;
