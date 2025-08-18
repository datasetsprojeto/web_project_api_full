import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../utils/auth';
import InfoTooltip from '../InfoTooltip/InfoTooltip';

function Register({ onRegister }) {
  const [tooltipOpen, setToolTipOpen] = useState(false);
  const [tooltipSuccess, setToolTipSuccess] = useState(false);
  const [tooltipMessage, setToolTipMessage] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Validação de nome
    if (!name) {
      setNameError('O nome é obrigatório');
    } else if (name.length < 2) {
      setNameError('O nome deve ter pelo menos 2 caracteres');
    } else {
      setNameError('');
    }

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
      name && name.length >= 2 &&
      emailPattern.test(email) && 
      password && password.length >= 6
    );
  }, [name, email, password]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await register({ name, email, password });
      onRegister(response.token, response.user);
      
      setToolTipSuccess(true);
      setToolTipMessage('Registro realizado com sucesso!');
      setToolTipOpen(true);

      setTimeout(() => {
        setToolTipOpen(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Erro no registro:', error.message);

      setToolTipSuccess(false);
      setToolTipMessage(error.message || 'Dados inválidos, tente novamente!');
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
            type="text"
            className={`form__input form__input_theme_dark ${nameError ? 'form__input_type_error' : ''}`}
            required
            placeholder="Nome"
            minLength="2"
            maxLength="30"
            value={name}
            onChange={handleNameChange}
          />
          <span className="form__error form__error_theme_dark">{nameError}</span>
        </fieldset>
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