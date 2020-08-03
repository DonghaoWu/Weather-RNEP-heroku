const express = require('express');

const Cities = require('../models/cities');

const router = express.Router();

router.get('/', (req, res) => {
    Cities.retrieveAll((err, cities) => {
        if (err) return res.json(err);
        return res.json(cities);
    })
})

router.post('/', (req, res) => {
    let city = rq.body.city;

    Cities.insert(city, (err, res) => {
        if (err) return res.json(err);
        return res.json();
    })
})

module.exports = router;