const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    token: {
        type: String,
        required: true
    },

    passwordReset: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d'
    }
})

module.exports = mongoose.model('token', tokenSchema);