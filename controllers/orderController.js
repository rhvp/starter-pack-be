const Order = require('../models/order');
const User = require('../models/user');
const Customer = require('../models/customer');
const Product = require('../models/product');
const AppError = require('../config/appError');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const sendEmail = require('../config/email');
const sendEmailTemplate = require('../config/templateEmail');



exports.create = async(req, res, next) => {
    try {
        let id = req.query.user;
        let {amount, products} = req.body;
        const user = await User.findById(id);
        if(!user) return next(new AppError('User not found', 404));
        let customerData = _.pick(req.body, ['name', 'email', 'address', 'phone']);
        customerData.user = id;
        const customer = await Customer.create(customerData);
        
        // const productObjs = products.map(async obj=>{
        //     let prod_details = await Product.findById(obj.product);
        //     prod_details.quantity = obj.quantity;
        //     return prod_details;
        // })
        // console.log(productObjs);
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
        
        let customerOptions = {
            email: customer.email,
            from: 'StarterPak <hello@9id.com.ng>',
            subject: 'Order Processing',
            template: "invoice",
            products,
            customer,
            amount,
            user,
            order
        }
        let options = {
            email: user.email,
            from: 'StarterPak <hello@9id.com.ng>',
            subject: 'Order Recieved',
            message: `<p>Hello ${user.firstname},</p>
            <p>You've recieved an order.</p>
            <p>Order details are;</p>
            <p>Total Amount: ${amount}</p>
            <p>Customer Name: ${customer.name}</p>
            <p>Customer Phone Number: ${customer.phone}</p>
            <p>Customer Address: ${customer.address}</p>
            <p>Order Id: ${order._id}</p>
            `
        }
        sendEmailTemplate(customerOptions).then(()=>{
            console.log('Invoice sent to customer '+ customer.email);
            }).catch(err=>{
                console.log('Error sending invoive '+ err);
            });
        
        sendEmail(options).then(()=>{
            console.log('Order update sent to user '+ user.email);
            }).catch(err=>{
                console.log('Error sending order update '+ err);
            });
    } catch (error) {
        return next(error);
    }
}

exports.getDeliveryAmount = async(req, res, next) => {
    try {
        let delivery;
        const id = req.query.user;
        let {state, city} = req.body;
        const user = await User.findById(id);
        if(!user) return next(new AppError('User not found', 404));
        if(state == user.state && city == user.city) delivery = user.delivery.zone_1;
        else if(state == user.state) delivery = user.delivery.zone_2;
        else delivery = user.delivery.zone_3;
        res.status(200).json({
            status: 'success',
            fee: delivery
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