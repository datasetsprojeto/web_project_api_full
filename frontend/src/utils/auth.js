import { BASE_URL } from './config';

// Função auxiliar para fazer requisições
async function makeRequest(url, options) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Tenta extrair a mensagem de erro do corpo da resposta
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Não foi possível parsear o JSON de erro
      }
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
}

export const register = ({ email, password }) => {
  return makeRequest(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
};

export const authorize = ({ email, password }) => {
  return makeRequest(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
};

export const checkToken = (token) => {
  return makeRequest(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};