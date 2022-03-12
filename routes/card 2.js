const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteUser,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

router.get('/cards', getCards);

router.post('/cards', createCard);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId', deleteUser);

router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
