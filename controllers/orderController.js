const Order = require('../models/order');
const Transaction = require('../models/transaction');
const Customer = require('../models/customer');
const AppError = require('../config/appError');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const paystack = require('../config/paystack');



exports.create = async(req, res, next) => {
    try {
        let id = req.query.user;
        let {amount, products} = req.body;
        let customerData = _.pick(req.body, ['name', 'email', 'address', 'phone']);
        customerData.user = id;
        const customer = await Customer.create(customerData);
        
        
        let orderData = {
            products,
            user: id,
            amount,
            customer: customer._id
        }
        const order = await Order.create(orderData);
        res.status(200).json({
            status: 'success',
            message: 'Order recieved successfully',
            data: order
        })
    } catch (error) {
        return next(error);
    }
}

exports.getAllMyOrders = async(req, res, next) => {
    try {
        const id = req.user.id;
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
        const id = req.user.id;
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

exports.updateOrder = async(req, res, next) => {
    try {
        const id = req.user.id;
        let orderId = req.params.id;
        let {status} = req.body;
        const orderExists = await Order.findById(orderId);
        if(!orderExists) if(!order) return next(new AppError('Order not found', 404));
        if(orderExists._id != id) return next(new AppError('You\'re unauthorized to modify this resource', 401))
        const order = await Order.findByIdAndUpdate(orderId, {status}, {new: true});
        res.status(200).json({
            status: 'success',
            data: order
        })
    } catch (error) {
        return next(error);
    }
}