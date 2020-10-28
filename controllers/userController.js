const User = require('../models/user');
const Token = require('../models/token');
const AppError = require('../config/appError');
const Customer = require('../models/customer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const paystack = require('../config/paystack');
const crypto = require('crypto');
const sendEmail = require('../config/email');
const uploader = require('../config/cloudinary');


exports.signup = async(req, res, next) => {
    try {
        let data = _.pick(req.body, ['firstname', 'lastname', 'email', 'phone', 'address', 'password', 'business_name', 'city', 'state']);
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

exports.updateProfile = async(req, res, next) => {
    try {
        let data = _.pick(req.body, ['email', 'phone', 'address', 'city', 'state']);
        const user = await User.findByIdAndUpdate(req.user.id, data, {new: true});
        res.status(200).json({
            status: "success",
            data: user
        })
    } catch (error) {
        return next(error);
    }
}

exports.updateLogo = async(req, res, next) => {
    try {
        const id = req.user.id;
        let {image} = req.body;
        await uploader.uploadMerchantLogo(image, id);
        res.status(200).json({
            status: 'success',
            message: 'Logo update successfully'
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

exports.changePassword = async(req, res, next)=>{
    try {
        let {newPass, oldPass, confirm} = req.body;
        if(newPass !== confirm){
            return next(new AppError('New password and Confirm password do not match', 406));
        }
        
        const id = req.user.id;
        const profile = await User.findById(id);
        if(!profile) next(new AppError('User not found', 404));
        const passwordCorrect = bcrypt.compareSync(oldPass, profile.password);
        if(passwordCorrect){
            const cryptPass = bcrypt.hashSync(newPass, 12);
            profile.password = cryptPass
            await profile.save();
            res.status(200).json({
                status: 'success',
                message: 'Password updated'
            })
        } else {
            return next(new AppError('Incorrect Old Password', 401));
        }
    } catch (error) {
        return next(error);
    }
},

exports.forgotPasswordRequest = async(req, res, next) => {
    try {
        const user = await User.findOne({email: req.params.email});
        if(!user) return next(new AppError('Email not found',404));
        const str = crypto.randomBytes(16).toString("hex");
        let token = await Token.create({user: user._id, token: str, passwordReset: true});
        const url = `https://starterPak.com/password-reset?token=${token.token}`;

        const mailOptions = {
            email: user.email,
            from: 'StarterPak <hello@9id.com.ng>',
            subject: 'Password Reset',
            message: `<p>Hello ${user.firstname},</p>
            <p>Follow this link to reset your account's password:</p>
            <p><a href="${url}">Reset</a></p>
            `
        }
        sendEmail(mailOptions).then(()=>{
        res.status(200).json({
            status: 'success',
            message: 'Password reset mail sent',
        })
        }).catch(err=>{
            console.error(err, 'Password reset email not sent');
            return next(new AppError('error sending password reset', 500));
        });
          
    } catch (error) {
        return next(error)
    }
},

exports.resetPassword = async(req, res, next)=>{
    try {
        let data = _.pick(req.body, ['password', 'confirm_password']);
        if(data.password !== data.confirm_password) return next(new AppError('New password and Confirm password do not match', 406));
        const token = await Token.findOne({token: req.params.token});
        if(!token || !token.passwordReset) return next(new AppError('Invalid access token.', 401));
        const id = token.user;
        const hashed_password = bcrypt.hashSync(data.password, 12);
        await User.findByIdAndUpdate(id, {password: hashed_password, confirmed: true});

        res.status(200).json({
            status: 'success',
            message: 'Password successfully updated'
        })

    } catch (error) {
        return next(error);
    }
},

exports.getCustomers = async(req, res, next) => {
    try {
        let id = req.user.id;
        const customers = await Customer.find({user: id}).lean();
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
        let delivery = _.pick(req.body, ['zone_1', 'zone_2', 'zone_3'])
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