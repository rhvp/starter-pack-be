const product = require('../controllers/productController');
const express = require('express');
const auth = require('../controllers/authController');
const router = express.Router();

router.get('/available/:id', product.findAvailable)

router.route('/:id')
    .get(product.findAll)
    .patch(auth.userAuth, product.edit)
    .delete(auth.userAuth, product.delete)

router.route('/')
    .post(auth.userAuth, product.create)
    .get(product.fetch)

module.exports = router;