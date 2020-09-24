const express = require('express');
const user = require('../controllers/userController');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/signup', user.signup)
router.post('/login', user.login)

router.get('/list-banks', user.getBanks)
router.post('/verify-account', auth.userAuth, user.verifyBankDetails)
router.patch('/confirm-account', auth.userAuth, user.saveBankDetails)
router.get('/customers', auth.userAuth, user.getCustomers)
router.patch('/set-delivery', auth.userAuth, user.setDelivery)
router.post('/change-password', auth.userAuth, user.changePassword)
router.get('forgot-password/:email', user.forgotPasswordRequest)
router.post('reset-password/:token', user.resetPassword)

module.exports = router;