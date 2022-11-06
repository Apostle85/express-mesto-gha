const { PORT } = process.env;
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express();
const NOT_FOUND_ERROR = 404;

app.use((req, res, next) => {
  req.user = {
    _id: '6367eb7ee963b8170368476a',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('/:wrongRoute', (req, res) => {
  const { wrongRoute } = req.params;
  if (wrongRoute !== 'users'
  && wrongRoute !== 'cards'
  && wrongRoute !== '') {
    return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый ресурс не найден' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
