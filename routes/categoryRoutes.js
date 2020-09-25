const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const category = require('../controllers/categoryController');

router.route('/')
    .post(auth.userAuth, category.create)
    .get(category.findAll)

module.exports = router;