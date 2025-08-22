const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { UNAUTHORIZED } = require('../utils/constants');

// Middleware de autenticação JWT
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token não fornecido ou formato inválido' });
    }

    const token = authHeader.substring(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar se usuário ainda existe
    const user = await User.findById(payload._id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Falha na verificação do token:', err);

    // Mensagens de erro específicas
    if (err.name === 'TokenExpiredError') {
      return res.status(UNAUTHORIZED).send({
        message: 'Token expirado'
      });
    }

    if (err.name === 'JsonWebTokenError') {
      if (err.message === 'invalid signature') {
        return res.status(UNAUTHORIZED).send({
          message: 'Assinatura do token inválida'
        });
      }
      if (err.message === 'jwt malformed') {
        return res.status(UNAUTHORIZED).send({
          message: 'Token malformado'
        });
      }
    }

    // Erro genérico para outros casos
    return res.status(UNAUTHORIZED).send({
      message: 'Token inválido'
    });
  }
};