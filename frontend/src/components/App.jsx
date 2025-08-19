import React from 'react';
import Popup from '../components/Home/components/Main/components/Popup/Popup.jsx';
import EditAvatar from '../components/Home/components/Main/components/Popup/components/EditAvatar/EditAvatar.jsx';
import EditProfile from '../components/Home/components/Main/components/Popup/components/EditProfile/EditProfile.jsx';
import NewCard from '../components/Home/components/Main/components/Popup/components/NewCard/NewCard.jsx';
import ImagePopup from '../components/Home/components/Main/components/ImagePopup/ImagePopup.jsx';
import ConfirmDelete from '../components/Home/components/Main/components/Popup/components/ConfirmDelete/ConfirmDelete.jsx';
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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activePopup, setActivePopup] = useState(null);
  const [popupData, setPopupData] = useState(null);

  // Funções para abrir popups específicos
  const handleOpenPopup = (popupType, data = null) => {
    setActivePopup(popupType);
    setPopupData(data);
  };

  const handleClosePopup = () => {
    setActivePopup(null);
    setPopupData(null);
    setErrorMessage('');
  };

  useEffect(() => {
    const handleOpenPopupEvent = (event) => {
      handleOpenPopup(event.detail.type, event.detail.data);
    };

    document.addEventListener('openPopup', handleOpenPopupEvent);

    return () => {
      document.removeEventListener('openPopup', handleOpenPopupEvent);
    };
  }, [handleOpenPopup]);

  // Renderizar conteúdo do popup baseado no tipo
  const renderPopupContent = () => {
    switch (activePopup) {
      case 'edit-avatar':
        return <EditAvatar onClose={handleClosePopup} />;
      case 'edit-profile':
        return <EditProfile onClose={handleClosePopup} />;
      case 'new-card':
        return <NewCard onClose={handleClosePopup} />;
      case 'image':
        return <ImagePopup card={popupData} onClose={handleClosePopup} />;
      case 'confirm-delete':
        return (
          <ConfirmDelete
            onConfirm={() => handleCardDelete(popupData)}
            onCancel={handleClosePopup}
            isOwner={popupData.owner === currentUser._id}
          />
        );
      default:
        return null;
    }
  };

  const getPopupTitle = () => {
    switch (activePopup) {
      case 'edit-avatar':
        return 'Editar avatar';
      case 'edit-profile':
        return 'Editar perfil';
      case 'new-card':
        return 'Novo cartão';
      case 'image':
      case 'confirm-delete':
        return null;
      default:
        return '';
    }
  };

  const getPopupType = () => {
    return (activePopup === 'image' || activePopup === 'confirm-delete') ? activePopup : 'form';
  };

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
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userEmail');
    setLoggedIn(false);
    setCurrentUser({});
    setCards([]);
    navigate('/login');
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
      handleClosePopup();
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
        handleAddPlaceSubmit,
        handleOpenPopup
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
                  onOpenPopup={handleOpenPopup}
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

        {activePopup && (
          <Popup
            onClose={handleClosePopup}
            title={getPopupTitle()}
            type={getPopupType()}
          >
            {renderPopupContent()}
          </Popup>
        )}

        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;