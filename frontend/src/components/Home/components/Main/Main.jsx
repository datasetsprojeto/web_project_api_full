import { useContext } from 'react';
import { CurrentUserContext } from '../../../../contexts/CurrentUserContext.js';
import Card from './components/Card/Card';

function Main({ onOpenPopup }) {
  const { currentUser, cards, handleCardLike, handleCardDelete } = useContext(CurrentUserContext);

  return (
    <main className="content">
      <div className="content__profile">
        <div className="content__avatar-container">
          <img
            src={currentUser.avatar}
            alt="Perfil do usuário"
            className="content__avatar"
          />
          <button
            className="content__avatar-button"
            aria-label="Editar avatar"
            onClick={() => onOpenPopup('edit-avatar')}
          />
        </div>
        <div className="content__profile-edit">
          <div className="content__wrap">
            <h1 className="content__title">{currentUser.name}</h1>
            <button
              className="content__edit-button"
              aria-label="Editar perfil"
              onClick={() => onOpenPopup('edit-profile')}
            />
          </div>
          <p className="content__subtitle">{currentUser.about}</p>
        </div>
        <button
          className="content__add"
          aria-label="Adicionar cartões"
          onClick={() => onOpenPopup('new-card')}
        />
      </div>
      <section className="cards">
        {cards.length > 0 ? (
          cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
          ))
        ) : (
          <div className="cards__empty-message">
            Nenhum card encontrado. Adicione o primeiro!
          </div>
        )}
      </section>
    </main>
  );
}

export default Main;