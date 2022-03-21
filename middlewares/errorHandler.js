const { ERR_DEFAULT } = require('./errors');

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || ERR_DEFAULT;

  res.status(status).send({
    message: err.message,
  });
};

module.exports = errorHandler;
