import { useState, useContext, useEffect } from 'react';
import { CurrentUserContext } from '../../../../../../../../contexts/CurrentUserContext';

function NewCard() {
  const { handleAddPlaceSubmit } = useContext(CurrentUserContext);
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [linkError, setLinkError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    // Validação do campo nome
    if (!name.trim()) {
      setNameError('O título é obrigatório');
    } else if (name.length < 2) {
      setNameError('O título deve ter pelo menos 2 caracteres');
    } else {
      setNameError('');
    }

    // Validação do campo link
    if (!link.trim()) {
      setLinkError('A URL é obrigatória');
    } else if (!validateUrl(link)) {
      setLinkError('Por favor, insira uma URL válida');
    } else {
      setLinkError('');
    }

    // Validação geral do formulário
    setIsFormValid(
      name.trim() !== '' && 
      name.length >= 2 &&
      link.trim() !== '' &&
      validateUrl(link)
    );
  }, [name, link]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setIsLoading(true);
    
    handleAddPlaceSubmit({ name, link })
      .catch(error => {
        setLinkError(error.message || 'Erro ao criar o card');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form className="popup__form" onSubmit={handleSubmit}>
      <fieldset className="form__input-block">
        <input
          type="text"
          className={`form__input ${nameError ? 'form__input_type_error' : ''}`}
          placeholder="Título"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength="2"
          maxLength="30"
        />
        <span className="form__error">{nameError}</span>
      </fieldset>
      <fieldset className="form__input-block">
        <input
          type="url"
          className={`form__input ${linkError ? 'form__input_type_error' : ''}`}
          placeholder="URL da imagem"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <span className="form__error">{linkError}</span>
      </fieldset>
      <button 
        type="submit" 
        className="form__submit"
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? 'Criando...' : 'Criar'}
      </button>
    </form>
  );
}

export default NewCard;