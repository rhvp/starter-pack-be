const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const category = require('../controllers/categoryController');

router.route('/')
    .post(auth.userAuth, category.create)
    .get(category.findAll)

router.get('/fetch', category.fetch)

router.route('/:id')
    .delete(auth.userAuth, category.delete)
    .patch(auth.userAuth, category.edit)


module.exports = router;