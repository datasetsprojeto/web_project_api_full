const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/constants');

// Middleware de autenticação JWT
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se o cabeçalho de autorização existe e está no formato correto
  if (!authHeader) {
    return res.status(UNAUTHORIZED).send({
      message: 'Cabeçalho de autorização ausente'
    });
  }

  // Verifica o formato do token (Bearer token)
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(UNAUTHORIZED).send({
      message: 'Formato de token inválido. Use: Bearer <token>'
    });
  }

  const token = parts[1];

  // Verifica se o token não está vazio
  if (!token) {
    return res.status(UNAUTHORIZED).send({
      message: 'Token não fornecido'
    });
  }

  try {
    // Verifica e decodifica o token
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET // Usa apenas a variável de ambiente, sem fallback
    );

    // Adiciona os dados do usuário à requisição
    req.user = payload;
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