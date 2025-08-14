import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../../images/logo.png'; 

function Header({ handleLogout, loggedIn }) {
  const navigate = useNavigate();
  const email = localStorage.getItem('userEmail');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 660);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 660;
      setIsMobile(mobile);
      if (!mobile) setIsMenuOpen(false);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

   function handleClick() {
    if (loggedIn) {
      setIsMenuOpen(false); 
      handleLogout();
    } else {
      navigate('/login');
    }
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <header className={`header ${isMenuOpen ? 'header_menu-open' : ''}`}>
      <div className={`header__top-bar ${isMenuOpen ? 'header__top-bar_bordered' : ''}`}>
        <div className="header__logo">
          <img 
            src={logo} 
            alt="Logo Around The U.S." 
            className="header__logo-img"
          />
        </div>
        
        {/* Botão hambúrguer para mobile quando logado */}
        {isMobile && loggedIn && (
          <button 
            className="header__menu-button"
            onClick={toggleMenu}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        )}
        
        {/* Botão Entrar para mobile quando não logado */}
        {isMobile && !loggedIn && (
          <button className="header__button" onClick={handleClick}>
            Entrar
          </button>
        )}
      </div>

      {/* Menu expandido */}
      {isMenuOpen && (
        <div className="header__menu">
          <div className="header__menu-top">
            <span className="header__menu-email">{email}</span>
            <button
              className="header__menu-logout"
              onClick={handleClick}
            >
              Sair
            </button>
          </div>
          
          <div className="header__menu-separator"></div>
          
          <div className="header__menu-bottom">
            <div className="header__logo">
              <img 
                src={logo} 
                alt="Logo Around The U.S." 
                className="header__logo-img"
              />
            </div>
            <button 
              className="header__menu-close"
              onClick={toggleMenu}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Versão desktop */}
      {!isMobile && (
        <div className="header__button-wrapper">
          {loggedIn ? (
            <>
              <button className="header__button" disabled>
                {email}
              </button>
              <button
                className="header__button header__button_type_active"
                onClick={handleClick}
              >
                Sair
              </button>
            </>
          ) : (
            <button className="header__button" onClick={handleClick}>
              Entrar
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;