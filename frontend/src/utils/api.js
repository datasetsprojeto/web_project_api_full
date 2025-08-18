import { BASE_URL } from './config';

class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  async _request(endpoint, method, body = null) {
  const url = `${this._baseUrl}/${endpoint.replace(/^\//, '')}`;
  
  const options = {
    method,
    headers: this._headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const token = localStorage.getItem('jwt');
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  
  try {
    const response = await fetch(url, options);
    
    // Verifique se a resposta é JSON antes de tentar parsear
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(text || `Erro ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.message || `Erro ${response.status}`);
      error.status = response.status;
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
}

  // Métodos públicos utilizando _request
  getData(path) {
    return this._request(path, "GET");
  }

  profileEdit({ name, about }) {
    return this._request("users/me", "PATCH", { name, about });
  }

  avatarEdit(avatar) {
    return this._request("users/me/avatar", "PATCH", { avatar });
  }

  sendCard({ name, link }) {
    return this._request("cards", "POST", { name, link });
  }

  deleteCard(id) {
    return this._request(`cards/${id}`, "DELETE");
  }

  addLike(id) {
    return this._request(`cards/${id}/likes`, "PUT");
  }

  removeLike(id) {
    return this._request(`cards/${id}/likes`, "DELETE");
  }
}

export const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});