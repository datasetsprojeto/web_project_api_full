import { BASE_URL } from './config';

class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _request(endpoint, method, body = null) {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this._baseUrl}${normalizedEndpoint}`;
    
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
    
    return fetch(url, options)
      .then(async (res) => {
        const data = await res.json();
        
        if (!res.ok) {
          return Promise.reject({
            status: res.status,
            message: data.message || `Erro ${res.status}`,
          });
        }
        
        return data;
      })
      .catch(error => {
        console.error(`API Error [${method} ${endpoint}]:`, error);
        throw error;
      });
  }


  // Métodos públicos utilizando _request
  getData(path) {
    return this._request(path, "GET");
  }

  profileEdit({ name, about }) {
    return this._request("/users/me", "PATCH", { name, about });
  }

  avatarEdit(avatar) {
    return this._request("/users/me/avatar", "PATCH", { avatar });
  }

  sendCard({ name, link }) {
    return this._request("/cards", "POST", { name, link });
  }

  deleteCard(id) {
    return this._request(`/cards/${id}`, "DELETE");
  }

  addLike(id) {
    return this._request(`/cards/${id}/likes`, "PUT");
  }

  removeLike(id) {
    return this._request(`/cards/${id}/likes`, "DELETE");
  }
}

export const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});