const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const IncorrectDataError = require('../errors/IncorrectDataError');
const NotEnoughRightsError = require('../errors/NotEnoughRightsError');

// Возвращает все Карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// Создает Карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new IncorrectDataError('Введены некорректные данные для создания карточки'));
      next(err);
    });
};

// Удаляет Карточку по id
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findOne({ _id: cardId })
    .then((card) => {
      if (!card) throw new NotFoundError('Запрашиваемая карточка не найдена');
      if (req.user._id !== card.owner.toString()) {
        throw new NotEnoughRightsError('Недостаточно прав для удаления карточки');
      }

      return Card.deleteOne({ _id: cardId });
    })
    .then((newCard) => {
      if (newCard.deletedCount === 0) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }

      return res.send({ data: newCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new IncorrectDataError('Введены некорректные данные для удаления карточки'));
      next(err);
    });
};

// Поставить Карточке лайк
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new IncorrectDataError('Введены некорректные данные для постановки лайка карточки'));
      next(err);
    });
};

// Убрать у Карточки лайк
module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }

    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') next(new IncorrectDataError('Введены некорректные данные для снятия лайка карточки'));
    next(err);
  });
