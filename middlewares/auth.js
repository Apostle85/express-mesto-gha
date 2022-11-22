const jwt = require('jsonwebtoken');
const IncorrectProfileError = require('../errors/IncorrectProfileError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) next(new IncorrectProfileError('Необходима авторизация'));

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new IncorrectProfileError('Передан неверный токен'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
