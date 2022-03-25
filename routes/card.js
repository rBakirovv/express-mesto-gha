const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

const { validateUserCard } = require('../middlewares/validations');

router.get('/cards', getCards);

router.post('/cards', validateUserCard, createCard);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId', deleteCard);

router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
