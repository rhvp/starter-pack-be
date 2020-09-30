const Product = require('../models/product');
const AppError = require('../config/appError');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const uploader = require('../config/cloudinary');

// cloudinary.config({
//     cloud_name: 'intelligent-innovations',
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

exports.create = async(req, res, next) => {
    try {
        const id = req.user.id;
        let data = _.pick(req.body, ['name','description', 'price', 'available','published','category']);
        let {image} = req.body;
        data.user = id;
        const product = await Product.create(data);
        // add image upload to cloudinary
        res.status(201).json({
            status: 'success',
            data: product
        })
        await uploader.uploadImage(image, product._id);
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async(req, res, next) => {
    try {
        let user = req.query.user;
        const products = await Product.find({user: user}).populate('category');
        return res.status(200).json({
            status: 'success',
            count: products.length,
            data: products
        })
    } catch (error) {
        return next(error);
    }
}

exports.findByCategory = async(req, res, next) => {
    try {
        let user = req.query.user
        let category = req.query.category
        const products = await Product.find({user, category});
        res.status(200).json({
            status: 'success',
            data: products
        })
    } catch (error) {
        return next(error);
    }
}

exports.findAvailable = async(req, res, next) => {
    try {
        let user = req.query.user;
        const products = await Product.find({user: user, available: true});
        return res.status(200).json({
            status: 'success',
            data: products
        })
    } catch (error) {
        return next(error);
    }
}

exports.fetch = async(req, res, next) => {
    try {
        let user = req.query.user;
        const product = await Product.findOne({_id: req.query.id, user});
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
        const id = req.user.id;
        let update = _.pick(req.body, ['name', 'description', 'price', 'available', 'published','category']);
        let {image} = req.body;
        let product_id = req.params.id;
        const product = await Product.findById(product_id);
        if(!product) return next(new AppError('Product not found', 404));
        if(product.user != id) return next(new AppError('Action unauthorized', 401));
        await product.updateOne(update);
        
        res.status(200).json({
            status: 'success',
            data: product
        })
        
        if(image) {
            cloudinary.uploader.upload(image, async(error, result)=>{
                if(error) console.log('Error uploading image', error);
                else console.log(result.secure_url);
                await Product.updateOne({_id: product._id}, {image: result.secure_url});
            })
        }
        
    } catch (error) {
        return next(error);
    }
}

exports.delete = async(req, res, next) => {
    try {
        const id = req.user.id;
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