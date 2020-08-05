"start":"node server"

"heroku-postbuild": "cd client && npm install && npm run build"

```js
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

if(ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.use((req,res)=>{
        res.sendFile(path.join(__dirname,'../client/build/index.html'))
    })
}

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
```

heroku login

heroku create weather-app-demo-2020

heroku addons:create heroku-postgresql:hobby-dev --name=weather-app-demo-2020-db


heroku addons:attach weather-app-demo-2020-db --app=weather-app-demo-2020

heroku pg:psql --app weather-app-demo-2020

CREATE TABLE cities (
	id serial NOT NULL,
	city_name character varying(50) NOT NULL,
	PRIMARY KEY (id)
);

\q

git add .
git commit -m'ready for deploy'
git push
git push heroku master

heroku ps:scale web=1

heroku open

`"pg": "^8.3.0",`:

```js
var { Pool } = require('pg');

const CONNECTION_STRING = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/weather-db';

class Database {
  constructor() {
    this._pool = new Pool({
      connectionString: CONNECTION_STRING,
    });

    this._pool.on('error', (err, client) => {
      console.error('Unexpected error on idle PostgreSQL client.', err);
      process.exit(-1);
    });

  }

  query(query, ...args) {
    this._pool.connect((err, client, done) => {
      if (err) throw err;
      const params = args.length === 2 ? args[0] : [];
      const callback = args.length === 1 ? args[0] : args[1];

      client.query(query, params, (err, res) => {
        done();
        if (err) {
          console.log(err.stack);
          return callback({ error: 'Database error.' }, null);
        }
        callback({}, res.rows);
      });
    });

  }

  end() {
    this._pool.end();
  }
}

module.exports = new Database();
```

`"pg": "^7.4.3"`:

```js
var { Pool } = require('pg');

const CONNECTION_STRING = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/weather-db';
const SSL = process.env.NODE_ENV === 'production';


class Database {
  constructor () {
    this._pool = new Pool({
      connectionString: CONNECTION_STRING,
      ssl: SSL
    });

    this._pool.on('error', (err, client) => {
      console.error('Unexpected error on idle PostgreSQL client.', err);
      process.exit(-1);
    });

  }

  query (query, ...args) {
    this._pool.connect((err, client, done) => {
      if (err) throw err;
      const params = args.length === 2 ? args[0] : [];
      const callback = args.length === 1 ? args[0] : args[1];

      client.query(query, params, (err, res) => {
        done();
        if (err) {
          console.log(err.stack);
          return callback({ error: 'Database error.' }, null);
        }
        callback({}, res.rows);
      });
    });

  }

  end () {
    this._pool.end();
  }
}

module.exports = new Database();
```

check port usage Mac:

```bash
lsof -i :5000 # <---port number
kill -QUIT <PID>
```