const db = require('../database');

class Cities {
  static retrieveAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT city_name from cities', (err, res) => {
        if (err) return reject(err);
        resolve({ cities: res.rows })
      });
    })
  }

  static insert({ city }) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO cities (city_name) VALUES ($1)', [city], (err, res) => {
        if (err) return reject(err);
        resolve({ message: `Insert a new city ${city} success!` });
      });
    })
  }
}

module.exports = Cities;