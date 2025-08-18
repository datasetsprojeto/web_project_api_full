require('dotenv').config();
JWT_SECRET=sua_chave_secreta_forte
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
};