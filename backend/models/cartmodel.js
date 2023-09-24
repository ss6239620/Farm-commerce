const mongoose = require('mongoose')

const {cartItemSchema}=require('./cartItemModel')

const cartSchema = new mongoose.Schema({
    cartItem: [cartItemSchema],
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    created: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('cart', cartSchema)