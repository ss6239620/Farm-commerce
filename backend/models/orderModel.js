const mongoose = require('mongoose')

const STATUS = {
    intial:"AT_FARM",
    inProcess:'IN_PROCESS',
    delivery:"DELIVERD"
};

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    crop: {
        type: mongoose.Types.ObjectId,
        ref: "farmCrop"
    },
    quantity: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now()
    },
    orderStatus:{
        type:String,
        default:STATUS.intial,
        enum:[STATUS.intial,STATUS.inProcess,STATUS.delivery]
    }
})

module.exports = mongoose.model('order', orderSchema)