import React from 'react';
import './ModalComponent.css'; // Importa el archivo CSS
import { AiOutlineCloseCircle } from 'react-icons/ai';

function ModalComponent({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <AiOutlineCloseCircle className='modal-close-button' onClick={onClose} />

        {children}
      </div>
    </div>
  );
}

export default ModalComponent;
