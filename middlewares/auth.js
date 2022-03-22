const jwt = require('jsonwebtoken');
const Forbidden = require('../errors/Forbidden');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token)
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    res.send({message: err.message})
    next(new Forbidden('Необходима авторизация'));
  }
  req.user = payload;
  next();
};

module.exports = auth;
