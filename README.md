# Tripleten web_project_api_full - Around The U.S. - Authentication

Este projeto estende o aplicativo React "Around The U.S." com um sistema completo de autenticação. Implementa registro, login, rotas protegidas e integração com back-end, permitindo que usuários acessem conteúdo exclusivo após autenticação.

### Resumo de Implementação

1. **Autenticação JWT**:
   - Tokens com validade de 7 dias
   - Proteção de rotas com middleware de autenticação
   - Armazenamento no localStorage

2. **Validação**:
   - Celebrate/Joi para validação de dados no backend
   - Validação em tempo real no frontend
   - Schemas para todas as entradas de dados

3. **Segurança**:
   - Helmet para headers de segurança
   - Rate limiting para prevenção de ataques
   - Bcrypt para hash de senhas
   - CORS configurado corretamente

4. **Tratamento de Erros**:
   - Middleware centralizado de erros
   - Códigos HTTP apropriados (400, 401, 403, 404, 500)
   - Logging de erros em arquivo

5. **Frontend**:
   - Context API para gerenciamento de estado
   - Rotas protegidas com React Router
   - Formulários com validação
   - Feedback visual com InfoTooltip

6. **Implantação**:
   - Variáveis de ambiente para configuração
   - Scripts de build e execução
   - Configuração para produção

## Funcionalidades

1. Registro e autenticação de usuários com JWT
2. Rotas protegidas no frontend e backend
3. Validação de formulários no cliente e servidor
4. Tratamento centralizado de erros
5. Proteção contra operações não autorizadas
6. Logging de requisições e erros
7. Feedback visual com InfoTooltip
8. Armazenamento seguro de tokens

## Tecnologias Utilizadas

- **Frontend**: React, React Router, Context API
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Autenticação**: JWT
- **Validação**: Celebrate, Joi
- **Segurança**: Helmet, rate-limiting

## Configuração do Projeto

- Pré-requisitos:

-- Node.js (v18.x ou superior)
-- npm (v9.x ou superior)

## Instalação

1. Clonar repositório:
   ```git clone https://github.com/seu-usuario web_project_around_auth.git```
2. Entrar no diretório:
   ```cd web_project_around_auth```
3. Instalar dependências:
```cd backend && npm install```
```cd ../frontend && npm install ```
4. Iniciar servidor de desenvolvimento:
  ```cd backend && npm start```
  ```cd frontend && npm start```

## Imagens e layout :

### Página de Login
![Formulário de Login](./src/images/login-form.png)

### Página do Perfil
![Perfil do Usuário](./src/images/profile-page.png)