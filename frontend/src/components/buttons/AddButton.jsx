import React from 'react';

const AddButton = ({ onClick, children = 'Agregar', className = '' }) => (
  <button
    type="button"
    className={`btn btn-primary d-flex align-items-center gap-2 ${className}`}
    onClick={onClick}
  >
    <i className="bi bi-plus-circle"></i>
    {children}
  </button>
);

export default AddButton;
