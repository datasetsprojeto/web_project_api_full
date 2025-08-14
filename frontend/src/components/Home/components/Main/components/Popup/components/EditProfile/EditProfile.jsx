import { useState, useContext, useEffect } from 'react';
import { CurrentUserContext } from '../../../../../../../../contexts/CurrentUserContext';

export default function EditProfile() {
  const userContext = useContext(CurrentUserContext);
  const { currentUser, handleUpdateUser } = userContext;

  const [name, setName] = useState(currentUser.name);
  const [description, setDescription] = useState(currentUser.about);

  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    handleUpdateUser({ name, about: description });
  };

  useEffect(() => {
    // Validação do nome
    if (!name || name.length < 2) {
      setNameError('O nome deve ter pelo menos 2 caracteres');
    } else {
      setNameError('');
    }

    // Validação da descrição
    if (!description || description.length < 2) {
      setDescriptionError('A descrição deve ter pelo menos 2 caracteres');
    } else {
      setDescriptionError('');
    }

    // Validação geral do formulário
    setIsFormValid(
      name && name.length >= 2 && 
      description && description.length >= 2
    );
  }, [name, description]);

  return (
    <form className="popup__form form" id="profile-form" noValidate onSubmit={handleSubmit}>
      <fieldset className="form__input-block">
        <input
          type="text"
          className={`form__input ${nameError ? 'form__input_type_error' : ''}`}
          id="name-input"
          placeholder="Nome"
          required
          minLength="2"
          maxLength="40"
          value={name}
          onChange={handleNameChange}
        />
        <span className="form__error">{nameError}</span>
      </fieldset>
      <fieldset className="form__input-block">
        <input
          type="text"
          className={`form__input ${descriptionError ? 'form__input_type_error' : ''}`}
          id="about-input"
          placeholder="Sobre mim"
          required
          minLength="2"
          maxLength="200"
          value={description}
          onChange={handleDescriptionChange}
        />
        <span className="form__error">{descriptionError}</span>
      </fieldset>
      <button 
        type="submit" 
        className="form__submit" 
        id="profile-submit"
        disabled={!isFormValid}
      >
        Salvar
      </button>
    </form>
  );
}