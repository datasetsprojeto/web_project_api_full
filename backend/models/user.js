const mongoose = require('mongoose');
const { isURL, isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'O nome deve ter pelo menos 2 caracteres'],
    maxlength: [30, 'O nome deve ter no máximo 30 caracteres'],
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: [2, 'A descrição deve ter pelo menos 2 caracteres'],
    maxlength: [30, 'A descrição deve ter no máximo 30 caracteres'],
    default: 'Explorer',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => isURL(v, {
        protocols: ['http', 'https'],
        require_protocol: true,
      }),
      message: 'O campo "avatar" deve ser uma URL válida com protocolo HTTP/HTTPS',
    },
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
  },
  email: {
    type: String,
    required: [true, 'O campo "email" é obrigatório'],
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'O campo "email" deve ser um endereço de e-mail válido',
    },
  },
  password: {
    type: String,
    required: [true, 'O campo "password" é obrigatório'],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);