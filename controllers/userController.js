const User = require('../models/user');
const Token = require('../models/token');
const AppError = require('../config/appError');
const Customer = require('../models/customer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const paystack = require('../config/paystack');


exports.signup = async(req, res, next) => {
    try {
        let data = _.pick(req.body, ['firstname', 'lastname', 'email', 'phone', 'address', 'password', 'business_name']);
        const emailExists = await User.findOne({email: data.email});
        if(emailExists) return next(new AppError('This email is already registered', 409));
        let hashedPassword = bcrypt.hashSync(data.password);
        data.password = hashedPassword;
        const user = await User.create(data);
        user.password = undefined;
        res.status(201).json({
            status: 'success',
            message: 'Signup successful',
            data: user
        })
    } catch (error) {
        return next(error);
    }
}

exports.getBanks = async(req, res, next) => {
    try {
        const banks = await paystack.listBanks();
        console.log(banks);
        if(!banks.status) return next(new AppError('Error retrieving banks', 500));
        res.status(200).json({
            status: 'success',
            data: banks.data
        })
    } catch (error) {
        next(error);
    }
}

exports.verifyBankDetails = async(req, res, next) => {
    try {
        const id = req.user.id;
        let data = _.pick(req.body, ['bank_code', 'nuban']);
        const verify = await paystack.verifyBank(data.nuban, data.bank_code);
        if(!verify.status) return next(new AppError('Error verifying details', 500));
        res.status(200).json({
            status: 'success',
            data: verify.data
        })
    } catch (error) {
        return next(error);
    }
}

exports.saveBankDetails = async(req, res, next) => {
    try {
        const id = req.user.id;
        let data = _.pick(req.body, ['nuban', 'bank_name']);
        await User.findByIdAndUpdate(id, {nuban: data.nuban, bank: data.bank_name});
        res.status(200).json({
            status: 'success',
            message: 'Bank details updated'
        })
    } catch (error) {
        return next(error);
    }
}

exports.login = async(req, res, next) => {
    try {
        let data = _.pick(req.body, ['email', 'password']);
        const user = await User.findOne({email: data.email});
        if(!user) return next(new AppError('User not found', 404));
        let passwordCorrect = bcrypt.compareSync(data.password, user.password);
        if(!passwordCorrect) return next(new AppError('Incorrect email/password match', 401));
        let signature = {
            id: user._id,
            email: user.email,
            role: user.role
        }
        const token = jwt.sign(signature, process.env.JWT_SECRET);
        await Token.create({user: user._id, token: token});
        const cookieOptions = {
            expires: new Date(
                Date.now() + 86400000
            ),
            httpOnly: true
        };
        if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        res.cookie('jwt', token, cookieOptions);
        user.password = undefined;
        res.status(200).json({
            status: 'success',
            data: user,
            token: token
        })
    } catch (error) {
        return next(error);
    }
}

exports.getCustomers = async(req, res, next) => {
    try {
        let id = req.user.id;
        const customers = await Customer.find({user: id});
        res.status(200).json({
            status: 'success',
            data: customers
        })
    } catch (error) {
        return next(error);
    }
}

exports.setDelivery = async(req, res, next) => {
    try {
        let id = req.user.id;
        let delivery = _.pick(req.body, ['zone_1', 'zone_2', 'zone_3', 'zone_4'])
        const user = await User.findByIdAndUpdate(id, {delivery}, {new: true});
        if(!user) return next(new AppError('User not found', 404));
        res.status(200).json({
            status: 'success',
            data: user
        })
    } catch (error) {
        return next(error);
    }
}