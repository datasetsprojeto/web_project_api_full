import React from 'react';
import successIcon from '../../images/success.svg';
import errorIcon from '../../images/error.svg';

function InfoTooltip({ isOpen, onClose, isSuccess, message }) {
  if (!isOpen) return null;

  return (    
    <div className="tooltip-wrapper">                                                                                                                                                                <div className="tooltip-container">
        <div className="tooltip-content">
          {/* Botão de fechar */}
          <button 
            className="tooltip__close-button" 
            onClick={onClose}
            aria-label="Fechar"
          >
          </button>
          <img
            src={isSuccess ? successIcon : errorIcon}
            alt={isSuccess ? 'Success' : 'Error'}
          />
          <p className="tooltip-message">{message}</p>
        </div>
      </div>
      <div className="tooltip-overlay" onClick={onClose} />
       </div>
  );
}

export default InfoTooltip;