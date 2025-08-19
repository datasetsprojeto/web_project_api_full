import { API_BASE_URL, AUTH_TOKEN_KEY } from './config';

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  async _request(endpoint, method, body = null, retries = 3) {
    const url = `${this._baseUrl}/${endpoint.replace(/^\//, '')}`;
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
      method,
      headers,
      credentials: 'include'
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    try {
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      // Create fetch promise
      const fetchPromise = fetch(url, options);
      
      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      // Check if response is valid (not a timeout error)
      if (!(response instanceof Response)) {
        throw new Error('Request timeout');
      }
      
      // Read response as text first
      const text = await response.text();
      let data;
      
      // Try to parse as JSON if content-type indicates JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error(`Invalid JSON response: ${text}`);
        }
      } else {
        data = text;
      }
      
      if (!response.ok) {
        let errorMessage = data.message || `Erro ${response.status}`;
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          errorMessage = 'Muitas requisições. Tente novamente em alguns minutos.';
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      
      // Retry logic for rate limiting
      if (error.status === 429 && retries > 0) {
        console.log(`Retrying request (${retries} attempts left)...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        return this._request(endpoint, method, body, retries - 1);
      }
      
      // Verificar se é erro de conexão
      if (error.message === 'Failed to fetch' || error.message === 'Request timeout') {
        throw new Error('Erro de conexão com o servidor');
      }
      
      throw error;
    }
  }

  // Métodos públicos (unchanged)
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
  baseUrl: API_BASE_URL
});