import { useEffect, useRef } from 'react';

export default function Popup(props) {
  const { onClose, title, children, type } = props; // Adicione type como prop
  const popupRef = useRef();

  useEffect(() => {
    const handleEscClose = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscClose);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscClose);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="popup">
      <div className="popup__overlay" onClick={onClose} />
      <div 
        className="popup__content"
        ref={popupRef}
      >
        {/* Só mostra o botão de fechar para popups que não são de imagem */}
        {type !== 'image' && (
          <button
            aria-label="Close modal"
            className="popup__close"
            type="button"
            onClick={onClose}
          />
        )}
        <div
          className={`${type === 'image' ? 'popup__block_content_image' : 'popup__block'}`}
        >
          {title && <h3 className="popup__title">{title}</h3>}
          {children}
        </div>
      </div>
    </div>
  );
}