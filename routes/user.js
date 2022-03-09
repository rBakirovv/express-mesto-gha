const router = require('express').Router();
const {
  getUsers,
  findUser,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/user');

router.get('/users', getUsers);

router.get('/users/:userId', findUser);

router.post('/users', createUser);

router.patch('/users/me', updateProfile);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
