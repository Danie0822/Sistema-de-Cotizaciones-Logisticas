import React from 'react';
import PropTypes from 'prop-types';

/**
 * ModalBase: Modal Bootstrap 5 reutilizable
 * Props:
 * - show: bool
 * - onClose: func
 * - header: nodo para el header (reemplaza title)
 * - children: contenido del modal
 * - footer: nodo para el pie del modal
 * - size: 'sm' | 'lg' | 'xl' | ''
 */
const ModalBase = ({ show, onClose, header, children, footer, size = '', ...props }) => {
  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className={`modal-dialog modal-dialog-centered${size ? ` modal-${size}` : ''}`}>
        <div className="modal-content">
          <div className="modal-header">{header}</div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">{footer}</div>
        </div>
      </div>
    </div>
  );
};

ModalBase.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  header: PropTypes.node.isRequired,
  children: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['', 'sm', 'lg', 'xl'])
};

export default ModalBase;
