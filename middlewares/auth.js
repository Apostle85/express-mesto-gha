const jwt = require('jsonwebtoken');
const IncorrectProfileError = require('../errors/IncorrectProfileError');

module.exports = (req, res, next) => {
  let token;
  if (!req.cookies) {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) next(new IncorrectProfileError('Необходима авторизация'));
    token = authorization.replace('Bearer ', '');
  } else token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new IncorrectProfileError('Передан неверный токен'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
