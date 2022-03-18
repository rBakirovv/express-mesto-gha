const User = require('../models/user');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const {
  ERR_BAD_REQUEST,
  ERR_NOT_FOUND,
  ERR_DEFAULT,
} = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERR_DEFAULT).send({ message: 'Произошла ошибка' }));
};

const findUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные в методы создания пользователя',
        });
      }
      if (err.message === 'NotFound') {
        res.status(ERR_NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
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
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные в методы создания пользователя',
        });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateProfile = (req, res) => {
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
        res.status(ERR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
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
        res.status(ERR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  createUser,
  findUser,
  updateProfile,
  updateAvatar,
};
