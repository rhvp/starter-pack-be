const product = require('../controllers/productController');
const express = require('express');
const auth = require('../controllers/authController');
const router = express.Router();

router.get('/available', product.findAvailable)

router.route('/:id')
    .get(product.fetch)
    .patch(auth.userAuth, product.edit)
    .delete(auth.userAuth, product.delete)

router.route('/')
    .post(auth.userAuth, product.create)
    .get(product.findAll)

module.exports = router;