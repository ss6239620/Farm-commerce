const { default: mongoose } = require('mongoose');
const Mongoose = require('mongoose');

const categorySchema= new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    categoryDesc:{
        type:String,
        required:true
    },
    createdDate:{
        type:Date,
        default:Date.now()
    },
    isActive:{
        type:Boolean,
        default:true
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    }
})

module.exports=mongoose.model('category',categorySchema)