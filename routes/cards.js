const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().alphanum().min(2)
      .max(30),
    link: Joi.string().required().alphanum()
      .pattern(/^https?:\/\/(www.)?[A-Za-z0-9-.]+\.[a-z]+(\/[\w\-.~:/?#[\]@!$&'()*+,;=]*)?(#?)$/),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = router;
