require('dotenv').config();
const path = require('path');
const express = require('express');
const bodayParser = require('body-parser');

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

const db = require('./database');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodayParser.json());

app.use('/api/cities', require('./database/api/cities'));
app.use('/api/weather', require('./database/api/weather'));

app.listen(PORT, () => {
    console.log(`Server is liatening on port ${PORT}`);
});

db.query('SELECT NOW()', (err, res) => {
    if (err.error) {
        return console.log(err.error);
    }
    console.log(`Postgres connected: ${res[0].now}`)

});

module.exports = app;
