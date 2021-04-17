require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./database');

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/cities', require('./api/cities'));
app.use('/api/weather', require('./api/weather'));

app.use((err, req, res, next) => {
  const statusCode = err.cod || 500;
  res.status(statusCode).json({
      type: 'error',
      message: err.message
  })
})

if (ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

db.query('SELECT NOW()', (err, res) => {
  if (err) return console.log(err.error);
  console.log(`PostgreSQL connected: ${res.rows[0].now}.`);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

module.exports = app;