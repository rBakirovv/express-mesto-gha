const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ErrorConflict = require('../errors/ErrorConflict');
const Unauthorized = require('../errors/Unauthorized');
const ValidationError = require('../errors/ValidationError');

const SALT_ROUNDS = 10;

const {
  ERR_BAD_REQUEST,
  ERR_NOT_FOUND,
} = require('../errors/errors');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      if (err.message === 'NotFound') {
        res.status(ERR_NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      } else {
        next(err);
      }
    });
};

const findUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      if (err.message === 'NotFound') {
        res.status(ERR_NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    next(new ValidationError('Неккоректный email или пароль'));
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user) {
        throw new ErrorConflict('Пользователь с таким email уже существует');
      }

      return bcrypt.hash(password, SALT_ROUNDS);
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные в методы создания пользователя',
        });
      } else {
        next(err);
      }
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неккоректный email или пароль');
      }
      return bcrypt.compare(password, user.password);
    })
    .then((isVaid) => {
      if (!isVaid) {
        throw new Unauthorized('Неккоректный email или пароль');
      } else {
        const token = jwt.sign({ _id: isVaid._id }, 'some-secret-key', {
          expiresIn: '7d',
        });
        res
          .cookie('jwt', token, {
            expires: new Date(Date.now() + 7 * 24 * 3600000),
            httpOnly: true,
            sameSite: true,
          })
          .send({ message: 'Авторизация прошла успешно' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные в методы обновления профиля',
        });
      } else if (err.message === 'NotFound') {
        res.status(ERR_NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные в методы обновления аватара',
        });
      } else if (err.message === 'NotFound') {
        res.status(ERR_NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  login,
  findUser,
  updateProfile,
  updateAvatar,
};
