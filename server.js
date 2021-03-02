
const express = require('express');
const bp = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const wordsRouter = require('./routes/words.js');
const usersRouter = require('./routes/users.js');

const PORT = process.env.PORT || 4001;

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.use('/words', wordsRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.send(`
    <p>Hello. There is no index page for this database.</p>
    <p>Please visit <a href="https://hsk-drills.netlify.app">the HSK drills web app</a>.</p>
  `);
});

// 500 error route
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something is broken.');
});

app.use(function (req, res, next) {
  res.status(404).send('Looks like we got a 404 error over here.');
});

app.listen(PORT, function () {
  console.log(`Server is runnin' on port ${ PORT }`);
});