import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authorize } from '../../utils/auth';
import InfoTooltip from '../InfoTooltip/InfoTooltip';

function Login({ setLoggedIn }) {
  const [tooltipOpen, setToolTipOpen] = useState(false);
  const [tooltipSuccess, setToolTipSuccess] = useState(false);
  const [tooltipMessage, setToolTipMessage] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Validação de email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('O email é obrigatório');
    } else if (!emailPattern.test(email)) {
      setEmailError('Por favor, insira um email válido');
    } else {
      setEmailError('');
    }

    // Validação de senha
    if (!password) {
      setPasswordError('A senha é obrigatória');
    } else if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
    } else {
      setPasswordError('');
    }

    // Validação geral do formulário
    setIsFormValid(
      emailPattern.test(email) && 
      password && password.length >= 6
    );
  }, [email, password]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const userData = await authorize({ email, password });

      if (userData.token) {
        localStorage.setItem('jwt', userData.token);
        localStorage.setItem('userEmail', email);
        setLoggedIn(true);
      }

      setToolTipSuccess(true);
      setToolTipMessage('Login realizado com sucesso!');
      setToolTipOpen(true);

      setTimeout(() => {
        setToolTipOpen(false);
        navigate('/');
      }, 1500);
    } catch (status) {
      console.error(`ERROR [LOGIN]: Código ${status}`);

      setToolTipSuccess(false);
      setToolTipMessage(
        status === 400
          ? 'Por favor, preencha todos os dados solicitados!'
          : 'Usuário não encontrado, tente novamente!'
      );
      setToolTipOpen(true);
    }
  }
  return (
    <div className="login">
      <h3 className="login__title">Entrar</h3>
      <form
        className="popup__form form"
        id="login-form"
        noValidate
        onSubmit={handleSubmit}
      >
        <fieldset className="form__input-block">
          <input
            type="email"
            className={`form__input form__input_theme_dark ${emailError ? 'form__input_type_error' : ''}`}
            required
            placeholder="E-mail"
            minLength="2"
            maxLength="40"
            value={email}
            onChange={handleEmailChange}
          />
          <span className="form__error form__error_theme_dark">{emailError}</span>
        </fieldset>
        <fieldset className="form__input-block">
          <input
            type="password"
            className={`form__input form__input_theme_dark ${passwordError ? 'form__input_type_error' : ''}`}
            required
            placeholder="Senha"
            minLength="6"
            maxLength="14"
            value={password}
            onChange={handlePasswordChange}
          />
          <span className="form__error form__error_theme_dark">{passwordError}</span>
        </fieldset>
        <button
          type="submit"
          className="form__submit form__submit_theme_dark"
          id="login-submit"
          disabled={!isFormValid}
        >
          Entrar
        </button>
      </form>
      <InfoTooltip
        isOpen={tooltipOpen}
        isSuccess={tooltipSuccess}
        message={tooltipMessage}
        onClose={() => setToolTipOpen(false)}
      />
      <div className="login__signin">
        <p className="login__text">Ainda não é um membro?</p>
        <Link to="/register" className="login__login-link">
          Inscreva-se aqui!
        </Link>
      </div>
    </div>
  );
}

export default Login;