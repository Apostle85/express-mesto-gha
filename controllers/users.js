const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const IncorrectDataError = require('../errors/IncorrectDataError');
const ExistingEmailError = require('../errors/ExistingEmailError');
const IncorrectProfileError = require('../errors/IncorrectProfileError');

// Возвращает всех Пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getProfile = (req, res, next) => {
  const { _id } = req.user;

  User.findOne({ _id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new IncorrectDataError('Введены некорректные данные для создания пользователя'));
      next(err);
    });
};

// Возвращает Пользователя по id
module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findOne({ _id: userId })
    .then((user) => {
      if (!user) throw new NotFoundError('Запрашиваемый пользователь не найден');
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new IncorrectDataError('Введены некорректные данные для создания пользователя'));
      next(err);
    });
};

// Создает Пользователя
module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  if (!validator.isEmail(email)) throw new IncorrectDataError('Введены некорректные данные для создания пользователя');
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => User.findOne(user))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) next(new ExistingEmailError('Почта уже занята'));
      if (err.name === 'ValidationError') next(new IncorrectDataError('Введены некорректные данные для создания пользователя'));
      if (err.name === 'CastError') next(new IncorrectDataError('Введены некорректные данные для создания пользователя'));
      next(err);
    });
};

// Обновляет Данные Профиля
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((newUser) => {
      if (!newUser) throw new NotFoundError('Запрашиваемый пользователь не найден');
      return res.send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new IncorrectDataError('Введены некорректные данные для обновления пользователя'));
      if (err.name === 'ValidationError') next(new IncorrectDataError('Введены некорректные данные для обновления пользователя'));
      next(err);
    });
};

// Обновляет Аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((newUser) => {
      if (!newUser) throw new NotFoundError('Запрашиваемый пользователь не найден');
      return res.send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new IncorrectDataError('Введены некорректные данные для обновления пользователя'));
      if (err.name === 'ValidationError') next(new IncorrectDataError('Введены некорректные данные для обновления пользователя'));
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User
    // .findUserByCredentials(req.body.email, req.body.password)
    .findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new IncorrectProfileError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new IncorrectProfileError('Неправильные почта или пароль');
          }

          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        });
      return res.send({ data: 'Авторизация прошла успешно!' });
    })
    .catch(next);
};
