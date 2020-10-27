const mongoose = require("mongoose");
const validator = require("validator");

const referralSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name!"]
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name!"]
    },
    email: {
      type: String,
      required: [true, "Please provide your email address!"],
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number"],
      validate: [validator.isMobilePhone, "Please provide a valid phone number"]
    },
    // accountNumber: {
    //   type: String,
    //   required: [true, "Please provide your account number!"]
    // },
    // bank: {
    //   type: String,
    //   required: [true, "Please provide your bank name!"]
    // },

    referralCode: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Referral", referralSchema);
