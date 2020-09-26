const Category = require('../models/category');
const AppError = require('../config/appError');

exports.create = async(req, res, next) => {
    try {
        let user = req.user.id;
        let {name} = req.body;
        const category = await Category.create({name, user});
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
        let user = req.query.user;
        const data = await Category.find({user});
        res.status(200).json({
            status: 'success',
            data
        })
    } catch (error) {
        return next(error);
    }
}

exports.edit = async(req, res, next) => {
    try {
        let user = req.user.id;
        let {name} = req.body;
        const category = await Category.findOneAndUpdate({_id: req.params.id, user}, {name}, {new: true});
        if(!category) return next(new AppError('Category not found', 404));
        res.status(200).json({
            status: 'success',
            data: category
        })
    } catch (error) {
        return next(error);
    }
}

exports.fetch = async(req, res, next) => {
    try {
        let user = req.query.user;
        const category = await Category.findOne({_id: req.query.id, user});
        if(!category) return next(new AppError('Category not found', 404));
        res.status(200).json({
            status: 'success',
            data: category
        })
    } catch (error) {
        return next(error);
    }
}

exports.delete = async(req, res, next) => {
    try {
        let user = req.user.id;
        const category = await Category.findOneAndDelete({_id: req.params.id, user});
        if(!category) return next(new AppError('Category not found', 404));
        res.status(204).end()
    } catch (error) {
        return next(error);
    }
}