let express = require('express');
let Cities = require('../models/cities');

let router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { cities } = await Cities.retrieveAll();
    return res.json(cities);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    let city = req.body.city;
    const { message } = await Cities.insert({ city });
    return res.json(message);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;