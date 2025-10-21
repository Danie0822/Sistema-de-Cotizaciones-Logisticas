import React from 'react';

export default function TextField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  autoComplete = 'off',
  ...props
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="form-label fw-semibold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="form-control form-control-lg rounded-3 shadow-sm"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        {...props}
      />
    </div>
  );
}
