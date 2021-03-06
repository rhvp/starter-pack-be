const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: false
    },
    published: Boolean
}, {
    timestamps: true
})

productSchema.plugin(paginate);
module.exports = mongoose.model('product', productSchema);