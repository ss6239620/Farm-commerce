const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
    created:{
        type:Date,
        default:Date.now()
    }
})

module.exports=mongoose.model('contact',contactSchema)