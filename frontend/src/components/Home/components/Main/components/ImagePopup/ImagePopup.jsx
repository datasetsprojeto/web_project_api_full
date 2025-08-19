export default function ImagePopup({ card, onClose }) {
  if (!card) return null;
  
  return (
    <>
      <img
        src={card.link}
        alt={`Imagem que mostra ${card.name}`}
        className="popup__zoom-image"
      />
      <p className="popup__zoom-title">{card.name}</p>
      <button
        className="popup__close popup__close_content_image"
        type="button"
        onClick={onClose}
        aria-label="Fechar visualização de imagem"
      />
    </>
  );
}