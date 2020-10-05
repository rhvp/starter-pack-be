const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const stateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

stateSchema.plugin(URLSlugs('name'));

module.exports = mongoose.model('state', stateSchema)