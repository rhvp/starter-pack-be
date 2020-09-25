const product = require('../controllers/productController');
const express = require('express');
const auth = require('../controllers/authController');
const router = express.Router();

router.get('/available', product.findAvailable)

router.get('/fetch', product.fetch)

router.get('/get-by-category', product.findByCategory)

router.route('/:id')
    .patch(auth.userAuth, product.edit)
    .delete(auth.userAuth, product.delete)

router.route('/')
    .post(auth.userAuth, product.create)
    .get(product.findAll)

module.exports = router;