import React from 'react';
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { api } from '../utils/api.js';
import Header from './Header/Header';
import Main from './Home/components/Main/Main.jsx'; // Importando Main diretamente
import Footer from './Home/components/Footer/Footer.jsx'; // Importando Footer diretamente
import Login from './Login/Login';
import Register from './Register/Register';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import { checkToken } from '../utils/auth';

function App() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState(null);

  // Verificação de token e inicialização
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    
    if (jwt) {
      checkToken(jwt)
        .then(() => {
          setLoggedIn(true);
          navigate('/');
          
          // Buscar dados do usuário
          api.getData('users/me')
            .then(setCurrentUser)
            .catch(console.error);
            
          // Buscar cards
          api.getData('cards')
            .then(setCards)
            .catch(console.error);
        })
        .catch(error => {
          console.error('Token verification failed:', error);
          handleLogout();
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userEmail');
    setLoggedIn(false);
    navigate('/login');
  };

  // Funções de popup
  const handleOpenPopup = (popupName) => setPopup(popupName);
  const handleClosePopup = () => setPopup(null);

  // Operações de usuário
  const handleUpdateUser = (data) => {
    api.profileEdit(data)
      .then(setCurrentUser)
      .then(handleClosePopup)
      .catch(error => console.error('Error updating profile:', error));
  };

  const handleUpdateAvatar = (url) => {
  return api.avatarEdit(url)
    .then(updatedUser => {
      setCurrentUser(updatedUser);
      handleClosePopup();
      return updatedUser;
    })
    .catch(error => {
      console.error('Error updating avatar:', error);
      throw error; 
    });
};

  // Operações de cards
  const handleCardLike = async (card) => {
    const isLiked = card.likes.some(id => id === currentUser._id);
    
    try {
      const updatedCard = isLiked 
        ? await api.removeLike(card._id)
        : await api.addLike(card._id);
      
      setCards(prev => prev.map(c => c._id === card._id ? updatedCard : c));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCardDelete = async (card) => {
    try {
      await api.deleteCard(card._id);
      setCards(prev => prev.filter(c => c._id !== card._id));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleAddPlaceSubmit = (card) => {
  return api.sendCard(card)
    .then(newCard => {
      setCards(prev => [newCard, ...prev]);
      handleClosePopup();
      return newCard;
    })
    .catch(error => {
      console.error('Error adding card:', error);
      throw error; 
    });
};

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        cards,
        handleUpdateUser,
        handleUpdateAvatar,
        handleCardLike,
        handleCardDelete,
        handleAddPlaceSubmit
      }}
    >
      <div className="page">
        <Header loggedIn={loggedIn} handleLogout={handleLogout} />
        
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <>
                  <Main
                    popup={popup}
                    onOpenPopup={handleOpenPopup}
                    onClosePopup={handleClosePopup}
                  />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        </Routes>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;