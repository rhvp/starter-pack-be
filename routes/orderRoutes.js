const express = require('express');
const auth = require('../controllers/authController');
const router = express.Router();
const order = require('../controllers/orderController');


router.get('/', auth.adminAuth, order.getOrders)
router.route('/:id')
    .post(order.create)
    .get(auth.adminAuth, order.fetchOrder)

router.get('/my-orders', auth.userAuth, order.getAllMyOrders)
router.get('/my-orders/:id', auth.userAuth, order.fetchMyOrder)


module.exports = router;