import React from 'react';
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { api } from '../utils/api.js';
import Header from './Header/Header';
import Main from './Home/components/Main/Main.jsx';
import Footer from './Home/components/Footer/Footer.jsx';
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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Verificação de token e inicialização
  useEffect(() => {
  const jwt = localStorage.getItem('jwt');
  if (jwt && !loggedIn) { 
    setIsLoading(true);
    checkToken(jwt)
      .then((userData) => {
        setLoggedIn(true);
        setCurrentUser(userData);
        navigate('/');
        
        return api.getData('cards');
      })
      .then((cardsData) => {
        const normalizedCards = cardsData.map(card => ({
          ...card,
          likes: card.likes.map(like => like._id || like)
        }));
        setCards(normalizedCards);
      })
      .catch(error => {
        console.error('Token verification failed:', error);
        handleLogout();
        setErrorMessage('Sessão expirada. Faça login novamente.');
      })
      .finally(() => setIsLoading(false));
  }
}, [navigate, loggedIn]); 

  const handleLogin = (token, userData) => {
    localStorage.setItem('jwt', token);
    localStorage.setItem('userEmail', userData.email);
    setLoggedIn(true);
    setCurrentUser(userData);
    navigate('/');
    
    // Atualizar cards após login
    api.getData('cards')
      .then(setCards)
      .catch(console.error);
  };

  const handleRegister = (token, userData) => {
  localStorage.setItem('jwt', token);
  localStorage.setItem('userEmail', userData.email);
  setLoggedIn(true);
  setCurrentUser(userData);
  navigate('/');
  
  // Atualizar cards após registro
  api.getData('cards')
    .then(cardsData => {
      const normalizedCards = cardsData.map(card => ({
        ...card,
        likes: card.likes.map(like => like._id || like)
      }));
      setCards(normalizedCards);
    })
    .catch(console.error);

  setPopup('success');
  setTimeout(() => setPopup(null), 3000);
};

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userEmail');
    setLoggedIn(false);
    setCurrentUser({});
    setCards([]);
    navigate('/login');
  };

  // Funções de popup
  const handleOpenPopup = (popupName) => setPopup(popupName);
  const handleClosePopup = () => {
    setPopup(null);
    setErrorMessage('');
  };

  // Operações de usuário
  const handleUpdateUser = (data) => {
    setIsLoading(true);
    api.profileEdit(data)
      .then(setCurrentUser)
      .then(() => handleClosePopup())
      .catch(error => {
        console.error('Error updating profile:', error);
        setErrorMessage('Falha ao atualizar perfil. Tente novamente.');
      })
      .finally(() => setIsLoading(false));
  };

  const handleUpdateAvatar = (url) => {
    setIsLoading(true);
    return api.avatarEdit(url)
      .then(setCurrentUser)
      .then(() => handleClosePopup())
      .catch(error => {
        console.error('Error updating avatar:', error);
        setErrorMessage('Falha ao atualizar avatar. Verifique o URL.');
        throw error;
      })
      .finally(() => setIsLoading(false));
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
      setErrorMessage('Falha ao curtir. Tente novamente.');
    }
  };

  const handleCardDelete = async (card) => {
    try {
      await api.deleteCard(card._id);
      setCards(prev => prev.filter(c => c._id !== card._id));
    } catch (error) {
      console.error('Error deleting card:', error);
      setErrorMessage('Falha ao excluir. Você só pode excluir seus próprios cards.');
    }
  };

  const handleAddPlaceSubmit = (card) => {
    setIsLoading(true);
    return api.sendCard(card)
      .then(newCard => {
        setCards(prev => [newCard, ...prev]);
        handleClosePopup();
        return newCard;
      })
      .catch(error => {
        console.error('Error adding card:', error);
        setErrorMessage('Falha ao criar card. Verifique os dados.');
        throw error;
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        cards,
        isLoading,
        errorMessage,
        handleUpdateUser,
        handleUpdateAvatar,
        handleCardLike,
        handleCardDelete,
        handleAddPlaceSubmit
      }}
    >
      <div className="page">
        <Header 
          loggedIn={loggedIn} 
          userEmail={localStorage.getItem('userEmail')}
          handleLogout={handleLogout} 
        />
        
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Main
                  popup={popup}
                  onOpenPopup={handleOpenPopup}
                  onClosePopup={handleClosePopup}
                />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/register" 
            element={<Register onRegister={handleRegister} />} 
          />
          <Route 
            path="/login" 
            element={<Login onLogin={handleLogin} />} 
          />
        </Routes>
        
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;