const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },

        quanitiy: Number
    }],
    amount: {
        type: Number,
        required: true
    },
    
    status: {
        type: String,
        enum: ['processing', 'completed'],
        default: 'processing'
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('order', orderSchema);