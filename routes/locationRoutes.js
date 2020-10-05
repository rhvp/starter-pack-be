const express = require('express');
const router = express.Router();
const location = require('../controllers/locationController');

router.get('/states', location.getStates);

router.get('/cities/:state', location.getCitiesByState)

module.exports = router;