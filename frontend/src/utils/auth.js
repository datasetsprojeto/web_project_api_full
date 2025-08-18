import { BASE_URL } from './config';

// Função auxiliar para fazer requisições
async function makeRequest(url, options) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.message || `Erro ${response.status}`);
      error.status = response.status;
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
}

export const register = ({ name, email, password }) => {
  return makeRequest(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  }).then(data => {
    return {
      token: data.token,
      user: {
        _id: data._id,
        name: data.name,
        email: data.email,
        avatar: data.avatar
      }
    };
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