// const { PORT = 3000 } = process.env;
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
// const path = require('path');

const routes = require('./routes/routes');
const error = require('./middlewares/error');

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(routes);

app.use(errors());
app.use(error);
// app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT);
