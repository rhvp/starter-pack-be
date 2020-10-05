const express = require('express');
const auth = require('../controllers/authController');
const router = express.Router();
const order = require('../controllers/orderController');

router.get('/my-orders',auth.userAuth, order.getAllMyOrders)
router.get('/fetch-order/:id', auth.userAuth, order.fetchMyOrder)
router.post('/get-delivery-fee', order.getDeliveryAmount)
router.route('/')
    .get(auth.adminAuth, order.getOrders)
    .post(order.create)
router.route('/:id')
    .patch(auth.userAuth, order.updateOrder)
    .get(auth.adminAuth, order.fetchOrder)



module.exports = router;