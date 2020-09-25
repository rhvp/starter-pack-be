const Category = require('../models/category');
const AppError = require('../config/appError');

exports.create = async(req, res, next) => {
    try {
        let {name} = req.body;
        const category = await Category.create({name});
        res.status(201).json({
            status: 'success',
            data: category
        })
    } catch (error) {
        return next(error);
    }
}

exports.findAll = async(req, res, next) => {
    try {
        const data = await Category.find();
        res.status(200).json({
            status: 'success',
            data
        })
    } catch (error) {
        return next(error);
    }
}