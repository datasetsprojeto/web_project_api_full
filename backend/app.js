require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validateLogin, validateUserCreation } = require('./middlewares/validation');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { PORT = 3001 } = process.env;
const app = express();

app.use(cors());
app.options('*', cors());

// Middleware de logging simplificado
app.use((req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    headers: req.headers
  };

  // Log da requisição
  console.log(`${req.method} ${req.path}`);

  // Salva em arquivo
  fs.appendFile('request.log', JSON.stringify(logEntry) + '\n', (err) => {
    if (err) console.error('Erro ao salvar log:', err);
  });

  next();
});

app.use(express.json());

// Rota de teste de crash
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('O servidor travará agora');
  }, 0);
});

// Rotas de autenticação
app.post('/signin', validateLogin, login);
app.post('/signup', validateUserCreation, createUser);

// Middleware de autenticação
app.use(auth);

// Rotas protegidas
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Rota não encontrada
app.use((req, res) => {
  res.status(404).send({ message: 'Recurso requisitado não encontrado' });
});

// Tratamento de erros centralizado
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Erro no servidor' : err.message;

  // Log de erro simplificado
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: message,
    stack: err.stack,
    request: {
      method: req.method,
      path: req.path,
      body: req.body
    }
  };

  console.error(errorLog);

  // Salva em arquivo
  fs.appendFile('error.log', JSON.stringify(errorLog) + '\n', (err) => {
    if (err) console.error('Erro ao salvar log de erro:', err);
  });

  res.status(statusCode).send({ message });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
})
.on('error', (err) => {
  console.error('Erro ao iniciar o servidor:', err);
});