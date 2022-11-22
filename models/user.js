const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const IncorrectProfileError = require('../errors/IncorrectProfileError');

const userSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => /^https?:\/\/(www.)?[A-Za-z0-9-.]+\.[a-z]+(\/[\w\-.~:/?#[\]@!$&'()*+,;=]*)?(#?)$/.test(v),
      message: (props) => `${props.value} - некорректный URL-адрес`,
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

// function findUserByCredentials(email, password) {
//   this.findOne({ email }).select('+password')
//     .then((user) => {
//       console.log('CHECK: 2');
//       if (!user) {
//         throw new IncorrectProfileError('Неправильные почта или пароль');
//       }

//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             throw new IncorrectProfileError('Неправильные почта или пароль');
//           }

//           return user;
//         });
//     });
// }
//
// userSchema.statics.findUserByCredentials = findUserByCredentials;

module.exports = mongoose.model('user', userSchema);
