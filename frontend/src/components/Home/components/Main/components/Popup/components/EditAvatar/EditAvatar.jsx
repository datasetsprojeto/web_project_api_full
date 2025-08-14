import { useState, useContext, useEffect } from 'react';
import { CurrentUserContext } from '../../../../../../../../contexts/CurrentUserContext';

function EditAvatar() {
  const { handleUpdateAvatar } = useContext(CurrentUserContext);
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
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
    // Validação do campo avatar
    if (!avatar.trim()) {
      setAvatarError('O campo URL é obrigatório');
    } else if (!validateUrl(avatar)) {
      setAvatarError('Por favor, insira uma URL válida');
    } else {
      setAvatarError('');
    }

    // Validação geral do formulário
    setIsFormValid(
      avatar.trim() !== '' && 
      validateUrl(avatar)
    );
  }, [avatar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setIsLoading(true);
    
    handleUpdateAvatar(avatar)
      .catch(error => {
        setAvatarError(error.message || 'Erro ao atualizar o avatar');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form className="popup__form" onSubmit={handleSubmit}>
      <fieldset className="form__input-block">
        <input
          type="url"
          className={`form__input ${avatarError ? 'form__input_type_error' : ''}`}
          placeholder="URL da imagem"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          required
        />
        <span className="form__error">{avatarError}</span>
      </fieldset>
      <button 
        type="submit" 
        className="form__submit"
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}

export default EditAvatar;