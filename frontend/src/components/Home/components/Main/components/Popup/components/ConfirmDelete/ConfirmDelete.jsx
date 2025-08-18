import { useEffect } from 'react';

export default function ConfirmDelete({ onConfirm, onCancel, isOwner }) {
  useEffect(() => {
    const handleEscClose = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    
    document.addEventListener('keydown', handleEscClose);
    return () => document.removeEventListener('keydown', handleEscClose);
  }, [onCancel]);

  return (
    <div className="popup">
      <div className="popup__overlay" onClick={onCancel} />
      <div className="popup__content popup__content-confirm">
        <button
          aria-label="Fechar"
          className="popup__close popup__close_confirm"
          type="button"
          onClick={onCancel}
        />
        <div className="popup__block-confirm">
          {isOwner ? (
            // Mensagem para o dono do card
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
            // Mensagem para não-donos
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