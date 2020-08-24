const Order = require('../models/order');
const Transaction = require('../models/transaction');
const AppError = require('../config/appError');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const axios = require('axios').default;
const crypto = require('crypto');

const verifyTransaction = async(ref, next) => {
    try {
        const response = await axios.request({
            method: 'GET',
            url: 'https://api.paystack.co/transaction/verify/' + ref,
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET}`
            }
        })
        return response;
    } catch (error) {
        console.log('error', error.response.status);
        return next(new AppError(error.response.data.message, error.response.status));
    }
}


exports.create = async(req, res, next) => {
    try {
        let id = req.query.user;
        let {paystack_ref, amount, customer_email, products} = req.body;
        const payment = await verifyTransaction(paystack_ref, next);
        let txData = {
            paystack_ref,
            amount,
            customer_email,
            user: id
        }
        if(payment.data.data.status) {
            console.log('Payment Success');
            txData.status = 'success';
            const transaction = await Transaction.create(txData);
            res.status(200).json({
                status: 'success',
                message: 'Payment Successfully Verified. Processing Order...',
                data: transaction
            })
            let orderData = {
                products,
                transaction,
                user: id,
                paystack_ref,
                amount,
                customer_email
            }
            await Order.create(orderData);
        } else {
            console.log('Payment failed');
            txData.status = 'failed';
            await Transaction.create(txData);
            return next(new AppError('Payment failed. Order not created', 406));
        }
    } catch (error) {
        return next(error);
    }
}

exports.getAllMyOrders = async(req, res, next) => {
    try {
        let auth = req.headers['authorization'];
        let authorized = jwt.verify(auth, process.env.JWT_SECRET);
        const id = authorized.id;
        const orders = await Order.find({user: id});
        res.status(200).json({
            status: 'success',
            count: orders.length,
            data: orders
        })
    } catch (error) {
        return next(error);
    }
}

exports.fetchMyOrder = async(req, res, next) => {
    try {
        let auth = req.headers['authorization'];
        let authorized = jwt.verify(auth, process.env.JWT_SECRET);
        const id = authorized.id;
        const order = await Order.findOne({_id: req.params.id, user: id});
        if(!order) return next(new AppError('Order not found', 404));
        res.status(200).json({
            status: 'success',
            data: order
        })
    } catch (error) {
        return next(error);
    }
}

exports.getOrders = async(req, res, next) => {
    try {
        const orders = await Order.find();
        res.status(200).json({
            status: 'success',
            count: orders.length,
            data: orders
        })
    } catch (error) {
        return next(error);
    }
}

exports.fetchOrder = async(req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if(!order) return next(new AppError('Order not found', 404));
        res.status(200).json({
            status: 'success',
            data: order
        })
    } catch (error) {
        return next(error);
    }
}