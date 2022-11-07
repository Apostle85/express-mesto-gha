const User = require('../models/user');

const {
  NOT_FOUND_ERROR,
  SERVER_ERROR,
  INCORRECT_DATA_ERROR,
} = require('../constants/errors');

// Возвращает всех Пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

// Возвращает Пользователя по id
module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  User.findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(INCORRECT_DATA_ERROR).send({ message: 'Введены некорректные данные для создания пользователя' });
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Создает Пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(INCORRECT_DATA_ERROR).send({ message: 'Введены некорректные данные для создания пользователя' });
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Обновляет Данные Профиля
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((newUser) => {
      if (!newUser) return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
      return res.send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(INCORRECT_DATA_ERROR).send({ message: 'Введены некорректные данные для обновления пользователя' });
      if (err.name === 'ValidationError') return res.status(INCORRECT_DATA_ERROR).send({ message: 'Введены некорректные данные для обновления пользователя' });
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Обновляет Аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((newUser) => {
      if (!newUser) return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
      return res.send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(INCORRECT_DATA_ERROR).send({ message: 'Введены некорректные данные для обновления пользователя' });
      if (err.name === 'ValidationError') return res.status(INCORRECT_DATA_ERROR).send({ message: 'Введены некорректные данные для обновления пользователя' });
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};
