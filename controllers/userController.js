const User = require('../models/user');
const Token = require('../models/token');
const AppError = require('../config/appError');
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
        let auth = req.headers['authorization']
        const authorized = jwt.verify(auth, process.env.JWT_SECRET);
        const id = authorized.id;
        let data = _.pick(req.body, ['bank_code', 'nuban', 'bank_name']);
        const verify = await paystack.verifyBank(data.nuban, data.bank_code);
        if(!verify.status) return next(new AppError('Error verifying details', 500));
        res.status(200).json({
            status: 'success',
            data: verify.data
        })
        await User.findByIdAndUpdate(id, {bank: data.bank_name});
    } catch (error) {
        return next(error);
    }
}

exports.saveBankDetails = async(req, res, next) => {
    try {
        let auth = req.headers['authorization']
        const authorized = jwt.verify(auth, process.env.JWT_SECRET);
        const id = authorized.id;
        let data = _.pick(req.body, ['nuban']);
        await User.findByIdAndUpdate(id, {nuban: data.nuban});
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