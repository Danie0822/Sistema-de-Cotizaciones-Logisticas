import React from 'react';
import PropTypes from 'prop-types';

/**
 * MultiSelect component for selecting multiple options
 * @param {string} label - Label for the select field
 * @param {Array<string>} value - Array of selected values
 * @param {function} onChange - Function to handle value change
 * @param {Array<{label: string, value: string}>} options - Available options
 * @param {string} [error] - Error message
 * @param {string} [placeholder] - Placeholder text
 * @param {boolean} [disabled] - Disabled state
 */
const MultiSelect = ({ label, value = [], onChange, options = [], error, placeholder, disabled }) => {
  const handleCheckboxChange = (optionValue) => {
    if (disabled) return;
    
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    
    onChange(newValue);
  };

  const selectedLabels = options
    .filter(opt => value.includes(opt.value))
    .map(opt => opt.label)
    .join(', ');

  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <div className={`form-control ${error ? 'is-invalid' : ''}`} style={{ minHeight: '38px', maxHeight: '200px', overflowY: 'auto' }}>
        {options.length === 0 ? (
          <div className="text-muted">{placeholder || 'No hay opciones disponibles'}</div>
        ) : (
          <div>
            {options.map(option => (
              <div key={option.value} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`multi-select-${option.value}`}
                  checked={value.includes(option.value)}
                  onChange={() => handleCheckboxChange(option.value)}
                  disabled={disabled}
                />
                <label
                  className="form-check-label"
                  htmlFor={`multi-select-${option.value}`}
                  style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <div className="invalid-feedback d-block">{error}</div>}
      {!error && value.length > 0 && (
        <div className="form-text">Seleccionados: {selectedLabels}</div>
      )}
    </div>
  );
};

MultiSelect.propTypes = {
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  error: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default MultiSelect;
