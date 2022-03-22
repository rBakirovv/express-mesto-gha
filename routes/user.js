const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  findUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/user');

router.get('/users', getUsers);

router.get('/users/:userId', findUser);

router.get('/users/me', getCurrentUser);

router.patch('/users/me', updateProfile);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
