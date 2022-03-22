const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const user = require('./routes/user');
const card = require('./routes/card');
const { login, createUser } = require('./controllers/user');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', user);
app.use('/', card);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
