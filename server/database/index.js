// class Database {
//   constructor() {
//     this._pool = new Pool({
//       connectionString: CONNECTION_STRING,
//     });

//     this._pool.on('error', (err, client) => {
//       console.error('Unexpected error on idle PostgreSQL client.', err);
//       process.exit(-1);
//     });
//   }

//   query(query, ...args) {
//     this._pool.connect((err, client, done) => {
//       if (err) throw err;
//       const params = args.length === 2 ? args[0] : [];
//       const callback = args.length === 1 ? args[0] : args[1];

//       client.query(query, params, (err, res) => {
//         done();
//         if (err) {
//           console.log(err.stack,'======>');
//           return callback({ error: 'Database error.' }, null);
//         }
//         callback({}, res.rows);
//       });
//     });
//   }

//   end() {
//     this._pool.end();
//   }
// }

module.exports = new Database();

const { Pool } = require('pg');

const CONNECTION_STRING = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/weather-db';

const pool = new Pool({
  connectionString: CONNECTION_STRING,
});

pool.connect();

module.exports = pool;

// require('dotenv').config();
// const { Client } = require('pg');

// const dbSetting = process.env.DATABASE_URL ?
//     {
//         connectionString: process.env.DATABASE_URL,
//         ssl: {
//             rejectUnauthorized: false
//         }
//     }
//     :
//     {
//         user: process.env.POSTGRE_USER,
//         host: process.env.POSTGRE_HOST,
//         database: process.env.POSTGRE_LOCAL_DATABASE,
//         password: process.env.POSTGRE_password,
//         port: process.env.POSTGRE_PORT
//     }

// const db = new Client(dbSetting);

// db.connect();

// module.exports = db;