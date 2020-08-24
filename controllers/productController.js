const Product = require('../models/product');
const AppError = require('../config/appError');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

exports.create = async(req, res, next) => {
    try {
        let auth = req.headers['authorization'];
        let authorized = jwt.verify(auth, process.env.JWT_SECRET);
        const id = authorized.id;
        let data = _.pick(req.body, ['name', 'image', 'description', 'price', 'stock']);
        data.user = id;
        const product = await Product.create(data);
        res.status(201).json({
            status: 'success',
            data: product
        })
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async(req, res, next) => {
    try {
        let user = req.params.id;
        const products = await Product.find({user: user});
        res.status(200).json({
            status: 'success',
            count: products.length,
            data: products
        })
    } catch (error) {
        return next(error);
    }
}

exports.fetch = async(req, res, next) => {
    try {
        let user = req.query.user;
        let product_id = req.query.product;
        const product = await Product.findOne({user: user, _id: product_id});
        if(!product) return next(new AppError('Product not found', 404));
        res.status(200).json({
            status: 'success',
            data: product
        })
        
    } catch (error) {
        return next(error);
    }
}

exports.edit = async(req, res, next) => {
    try {
        let auth = req.headers['authorization'];
        let authorized = jwt.verify(auth, process.env.JWT_SECRET);
        const id = authorized.id;
        let update = _.pick(req.body, ['name', 'image', 'description', 'price', 'stock', 'available']);
        let product_id = req.params.id;
        const product = await Product.findById(product_id);
        if(!product) return next(new AppError('Product not found', 404));
        if(product.user != id) return next(new AppError('Action unauthorized', 401));
        await product.updateOne(update);
        
        res.status(200).json({
            status: 'success',
            data: product
        })
    } catch (error) {
        return next(error);
    }
}

exports.delete = async(req, res, next) => {
    try {
        let auth = req.headers['authorization'];
        let authorized = jwt.verify(auth, process.env.JWT_SECRET);
        const id = authorized.id;
        let product_id = req.params.id;
        const product = await Product.findById(product_id);
        if(!product) return next(new AppError('Product not found', 404));
        if(product.user != id) return next(new AppError('Action unauthorized', 401));
        await Product.deleteOne({_id: product_id});
        res.status(204).end();
    } catch (error) {
        return next(error);
    }
}