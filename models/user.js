const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Please enter your firstname']
    },
    lastname: {
        type: String,
        required: [true, 'Please enter your lastname']
    },
    business_name: {
        type: String,
        required: [true, 'Please enter your business name']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please enter your email address']
    },
    password: {
        type: String,
        unique: true,
        required: [true, 'Please enter a password']
    },
    phone: {
        type: String,
        unique: true,
        required: [true, 'Please enter your phone number']
    },
    address: {
        type: String,
        unique: true,
        required: [true, 'Please enter your address']
    },
    role: {
        type: String,
        enum: ['merchant', 'admin'],
        default: 'merchant'
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('user', userSchema);