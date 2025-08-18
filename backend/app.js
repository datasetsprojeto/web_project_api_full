require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { validateLogin, validateUserCreation } = require('./middlewares/validation');
const { NOT_FOUND, SERVER_ERROR } = require('./utils/constants');

const app = express();
const PORT = process.env.PORT || 3001;


const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174'
];

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://seu-frontend.com'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Conexão com MongoDB (versão atualizada)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aroundb')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(express.json());
app.use(requestLogger);

// Middleware para OPTIONS
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(204).send();
  }
  next();
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateUserCreation, createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Recurso não encontrado' });
});

app.use(errorLogger);
app.use(errors());

app.use((req, res, next) => {
  console.log('Headers received:', req.headers);
  next();
});

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(SERVER_ERROR).send({ message: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});