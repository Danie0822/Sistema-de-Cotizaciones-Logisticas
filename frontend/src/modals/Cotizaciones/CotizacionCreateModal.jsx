import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ModalBase from '../../components/modals/ModalBase';
import ComboBox from '../../components/inputs/ComboBox';
import TextField from '../../components/inputs/TextField';
import { cotizacionesService } from '../../services/cotizacionesService';
import { showSuccessAlert } from '../../components/alerts/SuccessAlert';
import { showErrorAlert } from '../../components/alerts/ErrorAlert';
import { generateAndViewPDF } from '../../utils/pdfUtils';

const CotizacionCreateModal = ({ show, onClose, onSuccess, clienteOptions, tipoCargaOptions, unidadOptions, descuentoOptions }) => {
  const [clienteId, setClienteId] = useState('');
  const [tipoCargaId, setTipoCargaId] = useState('');
  const [unidadId, setUnidadId] = useState('');
  const [peso, setPeso] = useState('');
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [descuentoId, setDescuentoId] = useState('');
  const [includeNotes, setIncludeNotes] = useState(false);
  const [includeTerms, setIncludeTerms] = useState(false);
  const [notes, setNotes] = useState('');
  const [includeSignatures, setIncludeSignatures] = useState(false);
  const [includeClientSignature, setIncludeClientSignature] = useState(false);
  const [includeAuthorizedSignature, setIncludeAuthorizedSignature] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validación de campos 
  const validate = () => {
    const errs = {};
    if (!clienteId) errs.clienteId = 'Cliente requerido.';
    if (!tipoCargaId) errs.tipoCargaId = 'Tipo de carga requerido.';
    if (!unidadId) errs.unidadId = 'Unidad requerida.';
    if (!origen || origen.length > 254) errs.origen = 'Origen requerido (máx 254 caracteres).';
    if (!destino || destino.length > 254) errs.destino = 'Destino requerido (máx 254 caracteres).';
    if (peso === '' || isNaN(peso) || Number(peso) <= 0) errs.peso = 'Peso debe ser mayor a 0.';
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
      // Preparar datos para enviar
      const body = {
        cliente_id: clienteId,
        tipo_carga_id: tipoCargaId,
        unidad_id: unidadId,
        peso: Number(peso),
        origen,
        destino,
        ...(descuentoId && { descuento_id: descuentoId }),
        ...(includeNotes && { includeNotes }),
        ...(includeTerms && { includeTerms }),
        ...(notes && { notes }),
        ...(includeSignatures && { includeSignatures }),
        ...(includeClientSignature && { includeClientSignature }),
        ...(includeAuthorizedSignature && { includeAuthorizedSignature })
      };
      
      // Generar PDF y abrirlo automaticamente
      await generateAndViewPDF(
        cotizacionesService.crearCotizacionPDF,
        body,
        'nueva_cotizacion',
        'Nueva Cotización'
      );
      
      showSuccessAlert('Cotización creada exitosamente');
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
        <h5 className="modal-title">Crear Cotización</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </>
    }>
      <form onSubmit={handleSubmit}>
        <ComboBox label="Cliente" value={clienteId} onChange={setClienteId} options={clienteOptions} error={errors.clienteId} />
        <ComboBox label="Tipo de carga" value={tipoCargaId} onChange={setTipoCargaId} options={tipoCargaOptions} error={errors.tipoCargaId} />
        <ComboBox label="Unidad" value={unidadId} onChange={setUnidadId} options={unidadOptions} error={errors.unidadId} />
        <TextField label="Peso" type="number" value={peso} onChange={e => setPeso(e.target.value)} error={errors.peso} min={0.01} step="any" />
        <TextField label="Origen" value={origen} onChange={e => setOrigen(e.target.value)} error={errors.origen} maxLength={254} />
        <TextField label="Destino" value={destino} onChange={e => setDestino(e.target.value)} error={errors.destino} maxLength={254} />
        {descuentoOptions && descuentoOptions.length > 0 && (
          <ComboBox label="Descuento (opcional)" value={descuentoId} onChange={setDescuentoId} options={descuentoOptions} error={errors.descuentoId} />
        )}
        <div className="form-check mt-2">
          <input className="form-check-input" type="checkbox" checked={includeNotes} onChange={e => setIncludeNotes(e.target.checked)} id="includeNotes" />
          <label className="form-check-label" htmlFor="includeNotes">Incluir notas adicionales</label>
        </div>
        {includeNotes && (
          <TextField label="Notas adicionales" value={notes} onChange={e => setNotes(e.target.value)} />
        )}
        <div className="form-check mt-2">
          <input className="form-check-input" type="checkbox" checked={includeTerms} onChange={e => setIncludeTerms(e.target.checked)} id="includeTerms" />
          <label className="form-check-label" htmlFor="includeTerms">Incluir términos y condiciones</label>
        </div>
        <div className="form-check mt-2">
          <input className="form-check-input" type="checkbox" checked={includeSignatures} onChange={e => setIncludeSignatures(e.target.checked)} id="includeSignatures" />
          <label className="form-check-label" htmlFor="includeSignatures">Incluir sección de firmas</label>
        </div>
        {includeSignatures && (
          <>
            <div className="form-check ms-3 mt-1">
              <input className="form-check-input" type="checkbox" checked={includeClientSignature} onChange={e => setIncludeClientSignature(e.target.checked)} id="includeClientSignature" />
              <label className="form-check-label" htmlFor="includeClientSignature">Firma del cliente</label>
            </div>
            <div className="form-check ms-3 mt-1">
              <input className="form-check-input" type="checkbox" checked={includeAuthorizedSignature} onChange={e => setIncludeAuthorizedSignature(e.target.checked)} id="includeAuthorizedSignature" />
              <label className="form-check-label" htmlFor="includeAuthorizedSignature">Firma del autorizado</label>
            </div>
          </>
        )}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>Crear y Visualizar PDF</button>
        </div>
      </form>
    </ModalBase>
  );
};

CotizacionCreateModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  clienteOptions: PropTypes.array.isRequired,
  tipoCargaOptions: PropTypes.array.isRequired,
  unidadOptions: PropTypes.array.isRequired,
  descuentoOptions: PropTypes.array
};

export default CotizacionCreateModal;
