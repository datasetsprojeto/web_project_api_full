import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../utils/auth';
import InfoTooltip from '../InfoTooltip/InfoTooltip';

function Register() {
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
      await register({ email, password });
      setToolTipSuccess(true);
      setToolTipMessage('Vitória! Você precisa se registrar.');
      setToolTipOpen(true);

      setTimeout(() => {
        setToolTipOpen(false);
        navigate('/login');
      }, 2000);
    } catch {
      console.error('Erro no registro');

      setToolTipSuccess(false);
      setToolTipMessage('Dados inválidos, tente novamente!');
      setToolTipOpen(true);
    }
  }

  return (
    <div className="register">
      <h3 className="register__title">Inscrever-se</h3>
      <form
        className="popup__form form"
        id="register-form"
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
          id="register-submit"
          disabled={!isFormValid}
        >
          Inscrever-se
        </button>
      </form>
      <InfoTooltip
        isOpen={tooltipOpen}
        isSuccess={tooltipSuccess}
        message={tooltipMessage}
        onClose={() => setToolTipOpen(false)}
      />
      <div className="register__signin">
        <p className="register__text">Já é um membro?</p>
        <Link to="/login" className="register__login-link">
          Faça o login
        </Link>
      </div>
    </div>
  );
}

export default Register;