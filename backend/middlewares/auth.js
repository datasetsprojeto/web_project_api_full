const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/constants');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED).send({ message: 'Token de autorização ausente' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret_key'
    );

    req.user = payload;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(UNAUTHORIZED).send({ message: 'Token expirado' });
    }

    return res.status(UNAUTHORIZED).send({ message: 'Token inválido' });
  }
};