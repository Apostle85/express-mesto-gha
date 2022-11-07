const Card = require('../models/card');

const {
  NOT_FOUND_ERROR,
  SERVER_ERROR,
  INCORRECT_DATA_ERROR,
} = require('../constants/errors');

// Возвращает все Карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

// Создает Карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(INCORRECT_DATA_ERROR).send({ message: 'Введены некорректные данные для создания карточки' });
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Удаляет Карточку по id
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.deleteOne({ _id: cardId })
    .then((card) => {
      if (card.deletedCount === 0) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(INCORRECT_DATA_ERROR).send({ message: 'Введены некорректные данные для удаления карточки' });
      if (err.name === 'ValidationError') return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Поставить Карточке лайк
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
      if (err.name === 'CastError') return res.status(INCORRECT_DATA_ERROR).send({ message: 'Введены некорректные данные для постановки лайка карточки' });
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// Убрать у Карточки лайк
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
    }

    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
    if (err.name === 'CastError') return res.status(INCORRECT_DATA_ERROR).send({ message: 'Введены некорректные данные для снятия лайка карточки' });
    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  });
