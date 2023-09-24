const mongoose = require('mongoose');
const { farmSchema } = require('./farmModel');

const MERCHANT_STATUS = {
    Rejected: 'Rejected',
    Approved: 'Approved',
    Waiting_Approval: 'Waiting Approval'
};

const merchantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    farm: [farmSchema],

    business: {
        type: String,
        required: true
    },
    isActive: {
        type: String,
        default: true
    },
    status: {
        type: String,
        default: MERCHANT_STATUS.Waiting_Approval,
        enum: [MERCHANT_STATUS.Approved, MERCHANT_STATUS.Rejected, MERCHANT_STATUS.Waiting_Approval]
    },
    created: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('merchant', merchantSchema)