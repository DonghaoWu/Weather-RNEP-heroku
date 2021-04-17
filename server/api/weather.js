let express = require('express');
let Weather = require('../models/weather');

let router = express.Router();

router.get('/:city', async (req, res, next) => {
  try {
    let city = req.params.city;
    const { weather } = await Weather.retrieveByCity({ city });
    return res.json(weather);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;