import { useEffect, useRef } from 'react';

export default function ConfirmDelete({ onConfirm, onCancel, isOwner }) {
  const popupRef = useRef();

  useEffect(() => {
    const handleEscClose = (e) => {
      if (e.key === 'Escape') onCancel();
    };

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscClose);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscClose);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  return (
    <div className="popup">
      <div className="popup__overlay" onClick={onCancel} />
      <div className="popup__content popup__content-confirm" ref={popupRef}>
        <button
          aria-label="Fechar"
          className="popup__close popup__close_confirm"
          type="button"
          onClick={onCancel}
        />
        <div className="popup__block-confirm">
          {isOwner ? (
            <>
              <h3 className="popup__title-confirm">Tem certeza?</h3>
              <button
                type="button"
                className="popup__confirm-button"
                onClick={onConfirm}
              >
                Sim
              </button>
            </>
          ) : (
            <>
              <h3 className="popup__title-confirm">
                Você não pode deletar esse card, você não é o criador!
              </h3>
              <button
                type="button"
                className="popup__confirm-button"
                onClick={onCancel}
              >
                Fechar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}