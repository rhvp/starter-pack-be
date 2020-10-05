const State = require('../models/state');
const City = require('../models/city');
const AppError = require('../config/appError');

exports.getStates = async(req, res, next) => {
    try {
        const states = await State.find({}).lean();
        res.status(200).json({
            status: 'success',
            data: states
        })
    } catch (error) {
        return next(error);
    }
}

exports.getCitiesByState = async(req, res, next) => {
    try {
        const data = await City.find({state: req.params.state}).lean();
        res.status(200).json({
            status: 'success',
            data
        })
    } catch (error) {
        return next(error);
    }
}