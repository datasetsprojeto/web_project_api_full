require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { validateLogin, validateUserCreation } = require('./middlewares/validation');
const { NOT_FOUND, SERVER_ERROR } = require('./utils/constants');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do CORS
const corsOptions = {
  origin: [
    'http://localhost:3001',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aroundb')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: 'Muitas requisições. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(limiter);

// Rota de teste de falha
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('O servidor travará agora');
  }, 0);
});

// Rotas públicas
app.post('/signin', validateLogin, login);
app.post('/signup', validateUserCreation, createUser);

// Middleware de autenticação
app.use(auth);

// Rotas protegidas
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Rota não encontrada
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Recurso não encontrado' });
});

// Log de erros
app.use(errorLogger);
app.use(errors());

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(SERVER_ERROR).send({ message: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});