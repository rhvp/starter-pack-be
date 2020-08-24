const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    custome_email: {
        type: String,
        required: true
    },
    paystack_ref: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failed']
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('transaction', transactionSchema);