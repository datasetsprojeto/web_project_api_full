const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_ERROR_CODE } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'Autorização necessária' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
  } catch (err) {
    return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'Autorização necessária' });
  }

  req.user = payload;
  next();
};