import { API_BASE_URL } from './config';

// Timeout para requisições (10 segundos)
const REQUEST_TIMEOUT = 10000;

// Função auxiliar para fazer requisições com timeout
async function makeRequest(url, options, retries = 3) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
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
    
    // Verificar se a resposta é bem-sucedida
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
    clearTimeout(timeoutId);
    
    // Retry logic for rate limiting
    if (error.status === 429 && retries > 0) {
      console.log(`Retrying request (${retries} attempts left)...`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      return makeRequest(url, options, retries - 1);
    }
    
    if (error.name === 'AbortError') {
      throw new Error('Tempo limite excedido. Verifique sua conexão.');
    }
    
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Erro de conexão. Verifique se o servidor está respondendo.');
    }
    
    // Repassar erros já tratados
    if (error.status) {
      throw error;
    }
    
    // Erro genérico
    console.error('Request failed:', error.message);
    throw new Error('Erro inesperado. Tente novamente.');
  }
}

export const register = async ({ name, email, password }) => {
  try {
    const data = await makeRequest(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    
    return {
      token: data.token,
      user: {
        _id: data._id,
        name: data.name,
        email: data.email,
        avatar: data.avatar
      }
    };
  } catch (error) {
    // Tratamento específico para erros de registro
    if (error.status === 409) {
      throw new Error('Este e-mail já está cadastrado.');
    }
    if (error.status === 400) {
      throw new Error('Dados inválidos. Verifique as informações fornecidas.');
    }
    throw error;
  }
};

export const authorize = async ({ email, password }) => {
  try {
    const data = await makeRequest(`${API_BASE_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    return data;
  } catch (error) {
    // Tratamento específico para erros de login
    if (error.status === 401) {
      throw new Error('E-mail ou senha incorretos.');
    }
    throw error;
  }
};

export const checkToken = async (token) => {
  try {
    const data = await makeRequest(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    
    return data;
  } catch (error) {
    // Tratamento específico para erros de token
    if (error.status === 401) {
      throw new Error('Sessão expirada. Faça login novamente.');
    }
    throw error;
  }
};

// Função adicional para logout (limpar token do localStorage)
export const logout = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('userEmail');
  return Promise.resolve();
};