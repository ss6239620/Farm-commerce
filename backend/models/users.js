const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const {ROLES}= require('../constant/index')

// create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    cropType: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: ROLES.Member,
        enum: [ROLES.Admin, ROLES.Member, ROLES.Merchant]
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model("users", UserSchema)