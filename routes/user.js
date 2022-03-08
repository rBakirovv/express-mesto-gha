const router = require('express').Router();
const { getUsers, findUser, createUser } = require('../controllers/user');

router.get('/users', getUsers);

router.get('/users/:userId', findUser);

router.post('/users', createUser);

module.exports = router;
