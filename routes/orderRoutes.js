const express = require('express');
const auth = require('../controllers/authController');
const router = express.Router();
const order = require('../controllers/orderController');


router.route('/')
    .get(auth.adminAuth, order.getOrders)
    .post(auth.userAuth, order.create)
router.route('/:id')
    .patch(auth.userAuth, order.updateOrder)
    .get(auth.adminAuth, order.fetchOrder)

router.get('/my-orders', auth.userAuth, order.getAllMyOrders)
router.get('/my-orders/:id', auth.userAuth, order.fetchMyOrder)


module.exports = router;