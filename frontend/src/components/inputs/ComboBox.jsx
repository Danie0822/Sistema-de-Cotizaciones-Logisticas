import React from 'react';
import PropTypes from 'prop-types';

/**
 * ComboBox con búsqueda/autocompletado para listas cortas.
 * @param {string} label
 * @param {string|number} value
 * @param {function} onChange
 * @param {Array<{label: string, value: string|number}>} options
 * @param {string} [error]
 * @param {string} [placeholder]
 * @param {boolean} [disabled]
 */
const ComboBox = ({ label, value, onChange, options, error, placeholder, disabled }) => {
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef();

  const filtered = (options || []).filter(opt =>
    (opt.label || '').toLowerCase().includes((search || '').toLowerCase())
  );

  React.useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  const selectedLabel = options.find(o => o.value === value)?.label || '';
  return (
    <div className="mb-3 position-relative" style={{ minWidth: 200 }}>
      {label && <label className="form-label">{label}</label>}
      <div
        className={`form-control d-flex align-items-center ${disabled ? 'disabled' : ''}`}
        tabIndex={0}
        onClick={() => !disabled && setOpen(true)}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer', minHeight: 38 }}
      >
        <input
          ref={inputRef}
          className="border-0 flex-grow-1 bg-transparent"
          style={{ outline: 'none' }}
          value={open ? search : selectedLabel}
          onChange={e => open && setSearch(e.target.value)}
          onFocus={() => !disabled && setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={!open}
        />
        <span className="ms-2"><i className="bi bi-caret-down-fill" /></span>
      </div>
      {open && (
        <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 10, maxHeight: 180, overflowY: 'auto' }}>
          {filtered.length === 0 && (
            <li className="list-group-item text-muted small">Sin resultados</li>
          )}
          {filtered.map(opt => (
            <li
              key={opt.value}
              className={`list-group-item list-group-item-action${opt.value === value ? ' active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
};

ComboBox.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  })).isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool
};

export default ComboBox;
