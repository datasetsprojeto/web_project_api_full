const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require('../utils/constants');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return res.status(SERVER_ERROR_CODE).send({ message: 'Erro ao buscar usuários' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .orFail(() => {
        const error = new Error('Usuário não encontrado');
        error.statusCode = NOT_FOUND_ERROR_CODE;
        throw error;
      });
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'ID inválido' });
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Erro no servidor' });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Dados inválidos' });
    }
    if (err.code === 11000) {
      return res.status(CONFLICT_ERROR_CODE).send({ message: 'E-mail já cadastrado' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Erro ao criar usuário' });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
      .orFail(() => {
        const error = new Error('Usuário não encontrado');
        error.statusCode = NOT_FOUND_ERROR_CODE;
        throw error;
      });
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Dados inválidos' });
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Erro no servidor' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
      .orFail(() => {
        const error = new Error('Usuário não encontrado');
        error.statusCode = NOT_FOUND_ERROR_CODE;
        throw error;
      });
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Dados inválidos' });
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Erro no servidor' });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'E-mail ou senha incorretos' });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'E-mail ou senha incorretos' });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' },
    );

    return res.send({ token });
  } catch (err) {
    return res.status(SERVER_ERROR_CODE).send({ message: 'Erro no servidor' });
  }
};

module.exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Usuário não encontrado' });
    }
    return res.send(user);
  } catch (err) {
    return res.status(SERVER_ERROR_CODE).send({ message: 'Erro no servidor' });
  }
};