import { useState } from 'react';
import ImagePopup from '../ImagePopup/ImagePopup';
import ConfirmDelete from '../Popup/components/ConfirmDelete/ConfirmDelete';

export default function Card(props) {
  const { card, handleOpenPopup, onCardLike, onCardDelete, currentUserId } = props;
  const { name, link, owner } = card;
  const [showConfirm, setShowConfirm] = useState(false);
  const [likeDisabled, setLikeDisabled] = useState(false);

  // Verificação se o usuário atual é o dono do card
  const isOwner = (owner._id === currentUserId) || (owner === currentUserId);

  // Verificação de likes
  const isLiked = card.likes?.some(like => {
    if (typeof like === 'string') {
      return like === currentUserId;
    } else if (like && typeof like === 'object') {
      return like._id === currentUserId;
    }
    return false;
  });

  const imageComponent = {
    title: false,
    children: <ImagePopup card={card} />,
  };

  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? 'card__like-button_is-active' : ''
  }`;

  const handleLikeClick = () => {
    setLikeDisabled(true);
    onCardLike(card);
    setTimeout(() => setLikeDisabled(false), 500);
  };

  const handleConfirmDelete = () => {
    onCardDelete(card);
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <li className="cards__item">
      {/* Lixeira sempre visível */}
      <img
        alt="Apagar cartão"
        className="cards__trash"
        onClick={() => setShowConfirm(true)}
      />
      
      {showConfirm && (
        <ConfirmDelete 
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isOwner={isOwner} // Passa informação se é dono
        />
      )}
      
      <img
        src={link}
        alt={`Foto do cartão, que mostra o ${name}`}
        className="cards__image"
        onClick={() => handleOpenPopup(imageComponent)}
      />
      
      <div className="cards__desc">
        <h2 className="cards__title">{name}</h2>
        <div className="cards__like-container">
          <button
            className={cardLikeButtonClassName}
            alt="Curtir cartão"
            onClick={handleLikeClick}
            disabled={likeDisabled}
          />
          <span className="cards__like-count">
            {card.likes?.length || 0} {/* Mostra contagem de likes */}
          </span>
        </div>
      </div>
    </li>
  );
}