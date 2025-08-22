import { useContext } from 'react';
import { CurrentUserContext } from '../../../../contexts/CurrentUserContext.js';
import Card from './components/Card/Card';
import ImagePopup  from './components/ImagePopup/ImagePopup.jsx';

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
       
      {/* Mensagem quando não há cards */}
      {cards.length === 0 && (
        <div className="content__no-cards">
          <p className="content__no-cards-text">Nenhum card encontrado. Adicione o primeiro!</p>
        </div>
      )}
      
      {/* Seção de cards (só aparece quando há cards) */}
      {cards.length > 0 && (
        <section className="cards">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              currentUserId={currentUser._id}
              onOpenPopup={onOpenPopup}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
          ))}
        </section>
      )}
    </main>
  );
}

export default Main;