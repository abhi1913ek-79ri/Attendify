import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ open, title, message, onCancel, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <h3 className="confirm-title">{title || 'Confirm'}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn-danger" onClick={onConfirm}>OK</button>
          <button className="btn-muted" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
