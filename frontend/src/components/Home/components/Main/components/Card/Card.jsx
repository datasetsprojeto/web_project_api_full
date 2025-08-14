import { useState } from 'react';
import ImagePopup from '../ImagePopup/ImagePopup';
import ConfirmDelete from '../Popup/components/ConfirmDelete/ConfirmDelete';

export default function Card(props) {
  const { name, link, isLiked } = props.card;
  const { card, handleOpenPopup, onCardLike} = props;
  const [showConfirm, setShowConfirm] = useState(false);
  
  const imageComponent = {
    title: false,
    children: <ImagePopup card={props.card} />,
  };

  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? 'card__like-button_is-active' : ''
  }`;

  const handleLikeClick = (card) => {
    onCardLike(card);
  };

  const handleConfirmDelete = () => {
    props.onCardDelete(props.card);
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

   return (
      <li className="cards__item">
      <img
        alt="Apagar cartão"
        className="cards__trash"
        onClick={() => setShowConfirm(true)}
      />      
      {showConfirm && (
        <ConfirmDelete 
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      <img
        src={link}
        alt={`Foto do cartão, que mostra o ${name}`}
        className="cards__image"
        onClick={() => {
          handleOpenPopup(imageComponent);
        }}
      />
      <div className="cards__desc">
        <h2 className="cards__title">{name}</h2>
        <button
          className={cardLikeButtonClassName}
          alt="Curtir cartão"
          onClick={() => {
            handleLikeClick(card);
          }}
        />
      </div>
    </li>
  );
}
