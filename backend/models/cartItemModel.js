const mongoose = require('mongoose')


const CART_ITEM_STATUS = {
    Processing: 'Processing',
    Shipped: 'Shipped',
    Delivered: 'Delivered',
    Cancelled: 'Cancelled',
    Not_processed: 'Not processed'
};

const cartItemSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    crop: {
        type: mongoose.Types.ObjectId,
        ref: 'farmCrop'
    },
    quantity: {
        type: Number,
        default: 1
    },
    purchasePrice: {
        type: Number,
        default: 0
    },
    priceWithTax: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    totalTax: {
        type: Number,
        default: 0
    },
    taxable: {
        type: Boolean,
        default: false
    },
    status: {
        type:String,
        default: CART_ITEM_STATUS.Processing,
        enum: [CART_ITEM_STATUS.Processing, CART_ITEM_STATUS.Delivered, CART_ITEM_STATUS.Cancelled, CART_ITEM_STATUS.Not_processed, CART_ITEM_STATUS.Shipped]
    }
})

const cartItem=mongoose.model('cartItem', cartItemSchema)

module.exports = {
    cartItemSchema:cartItemSchema,
    cartItem:cartItem
}