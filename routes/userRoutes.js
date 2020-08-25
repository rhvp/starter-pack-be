const express = require('express');
const user = require('../controllers/userController');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/signup', user.signup)
router.post('/login', user.login)

router.get('/list-banks', user.getBanks)
router.post('/verify-account', auth.userAuth, user.verifyBankDetails)
router.patch('/confirm-account', auth.userAuth, user.saveBankDetails)

module.exports = router;