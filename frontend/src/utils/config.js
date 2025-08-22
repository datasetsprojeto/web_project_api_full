// Configuração para ambiente de desenvolvimento e produção
export const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? 'https://api.project-aroundus.strangled.net' 
    : 'http://localhost:3000'; // Backend na porta 3000

export const FRONTEND_URL = 
  process.env.NODE_ENV === 'production'
    ? 'https://project-aroundus.strangled.net'
    : 'http://localhost:3001'; // Frontend na porta 3001

export const AUTH_TOKEN_KEY = 'jwt';