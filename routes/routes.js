const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateSignIn, validateSignUp } = require('../middlewares/validations');

const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', validateSignIn, login);
router.post('/signup', validateSignUp, createUser);

router.use(auth);

router.get('/signout', (req, res) => res.clearCookie('jwt').send({ message: 'Выход' }));

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

module.exports = router;
