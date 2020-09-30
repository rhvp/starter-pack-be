const cloudinary = require('cloudinary').v2;
const Product = require('../models/product');
const User = require('../models/user');

cloudinary.config({
    cloud_name: 'intelligent-innovations',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadProductImage = async(image, product) => {
    try {
        cloudinary.uploader.upload(image, async(error, result)=>{
            if(error) console.log('Error uploading image', error);
            else console.log(result.secure_url);
            await Product.updateOne({_id: product}, {image: result.secure_url})
        })
    } catch (error) {
        console.log('Error updating image ', error);
    }
}

exports.uploadMerchantLogo = async(image, user) => {
    try {
        cloudinary.uploader.upload(image, async(error, result)=>{
            if(error) console.log('Error uploading image', error);
            else console.log(result.secure_url);
            await User.updateOne({_id: user}, {logo: result.secure_url});
        })
    } catch (error) {
        console.log('Error updating logo ', error);
    }
}