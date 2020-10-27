const Referral = require('../models/referral');
const AppError = require('../config/appError');
const sendEmailTemplate = require('../config/templateEmail');


const generateOTCode = (size = 6, alpha = true) => {
    let characters = alpha
      ? "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      : "0123456789";
    characters = characters.split("");
    let selections = "";
    for (let i = 0; i < size; i++) {
      let index = Math.floor(Math.random() * characters.length);
      selections += characters[index];
      characters.splice(index, 1);
    }
    return selections;
};


exports.create = async(req, res, next) => {
    try {
        const {email} = req.body;
        
        // Check if referee exists
        const refereeExists = await Referral.findOne({ email });
        if (refereeExists) return next(new AppError('This referee already exists', 409));

        let referralCode = "FEC-" + generateOTCode(8, true);

        const referee = await Referral.create({...req.body, referralCode});
        res.status(201).json({
            status: 'success',
            referee
        })
        let options = {
            email: referee.email,
            from: 'StarterPak <hello@9id.com.ng>',
            subject: 'Welcome To StarterPak Referral Program',
            template: "referrals",
            referralCode
        }
        sendEmailTemplate(options).then(()=>{
            console.log('Email sent to referee');
        }).catch(err=>{
            console.log('Error sending referee email', err);
        })
        
    } catch (error) {
        return next(error);
    }
}

exports.getAll = async(req, res, next) => {
    try {
        const referees = await Referral.find({}).lean();
        res.status(200).json({
            status: 'success',
            data: referees
        })
    } catch (error) {
        return next(error);
    }
}

exports.getOne = async(req, res, next) => {
    try {
        const referee = await Referral.findById(req.params.id);
        if(!referee) return next(new AppError('Referee not found', 404));
        res.status(200).json({
            status: 'success',
            data: referee
        })
    } catch (error) {
        return next(error);
    }
}