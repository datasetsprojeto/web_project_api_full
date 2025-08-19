import { useState, useContext } from 'react';
import { CurrentUserContext } from '../../../../../../contexts/CurrentUserContext';
import ConfirmDelete from '../Popup/components/ConfirmDelete/ConfirmDelete';

export default function Card({ card, onCardLike, onCardDelete }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const isOwner = card.owner === currentUser._id;
  const isLiked = card.likes.some(id => id === currentUser._id);
  
  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? 'card__like-button_is-active' : ''
  }`;

  const handleLikeClick = () => {
    onCardLike(card);
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    onCardDelete(card);
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  const handleImageClick = () => {
    // Abre o popup de imagem diretamente
    document.dispatchEvent(new CustomEvent('openPopup', { 
      detail: { type: 'image', data: card } 
    }));
  };

  return (
    <li className="cards__item">
      <button
        className="cards__trash"
        onClick={handleDeleteClick}
        aria-label="Excluir card"
      />
      
      <img
        src={card.link}
        alt={card.name}
        className="cards__image"
        onClick={handleImageClick}
      />
      
      <div className="cards__desc">
        <h2 className="cards__title">{card.name}</h2>
        <div className="cards__like-container">
          <button
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
            aria-label="Curtir"
          />
          <span className="cards__like-count">{card.likes.length}</span>
        </div>
      </div>
      
      {showConfirm && (
        <ConfirmDelete 
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </li>
  );
}