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
        await uploader.uploadProductImage(image, product._id);
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async(req, res, next) => {
    try {
        
        const customLabels = {
            docs: "products"
        };
        const options = {
            page: req.query.page,
            limit: req.query.perPage,
            sort: { createdAt: -1 },
            customLabels,
            collation: {
              locale: "en"
            },
            populate: 'category'
        };
        
        let user = req.query.user;
        Product.paginate({user: user}, options, (err, products)=>{
            res.status(200).json({
                status: 'success',
                data: {...products}
            })
        })
        
        
    } catch (error) {
        return next(error);
    }
}

exports.findByCategory = async(req, res, next) => {
    try {
        
        let category = req.query.category
        const customLabels = {
            docs: "products"
        };
        const options = {
            page: req.query.page,
            limit: req.query.perPage,
            sort: { createdAt: -1 },
            customLabels,
            collation: {
              locale: "en"
            },
            populate: 'category'
        };
        
        let user = req.query.user
        Product.paginate({user, category}, options, (err, products)=>{
            res.status(200).json({
                status: 'success',
                data: {...products}
            })
        })
        
    } catch (error) {
        return next(error);
    }
}

exports.findAvailable = async(req, res, next) => {
    try {
        let user = req.query.user;
        const customLabels = {
            docs: "products"
        };
        const options = {
            page: req.query.page,
            limit: req.query.perPage,
            sort: { createdAt: -1 },
            customLabels,
            collation: {
              locale: "en"
            },
            populate: 'category'
        };
        Product.paginate({user, available: true}, options, (err, products)=>{
            res.status(200).json({
                status: 'success',
                data: {...products}
            })
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
            uploader.uploadProductImage(image, product._id);
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