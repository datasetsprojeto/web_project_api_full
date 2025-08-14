export default function ImagePopup(props) {
  const { name, link } = props.card;

  return (
    <>
      <img
        src={link}
        alt={`Imagem que mostra o ${name}`}
        className="popup__zoom-image"
      />
      <h3 className="popup__zoom-title">{name}</h3>
    </>
  );
}
