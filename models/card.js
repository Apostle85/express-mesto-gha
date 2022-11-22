const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    required: true,
    validate: {
      validator: (v) => /^https?:\/\/(www.)?[A-Za-z0-9-.]+\.[a-z]+(\/[\w\-.~:/?#[\]@!$&'()*+,;=]*)?(#?)$/.test(v),
      message: (props) => `${props.value} - некорректный URL-адрес`,
    },
    type: String,
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  createdAt: {
    default: Date.now,
    type: Date,
  },
});

module.exports = mongoose.model('card', cardSchema);
