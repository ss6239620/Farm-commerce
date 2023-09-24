const mongoose = require('mongoose')

const cropSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "users",
    },
    cropName: {
        type: String,
        required: true,
    },
    plantingSeason: {
        type: String,
        required: true,
    },
    soilType: {
        type: String,
        required: true,
    },
    quality: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: String,
        required: true,
    },
    isActive:{
        type:Boolean,
        default:true
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:"category",
        default:null
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports=mongoose.model('farmCrop',cropSchema)
