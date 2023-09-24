const mongoose = require('mongoose')

const REVIEW_STATUS={
    Approved:'Approved',
    Rejected:'Rejected',
    Waitng_Approval:'Waitng_Approval'
}

const reviewSchema = new mongoose.Schema({
    crop: {
        type: mongoose.Types.ObjectId,
        ref: 'farmCrop',
        default: null
    },
    cropUser: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        default: null
    },
    reviewUser: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        default: null
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    review: {
        type: String,
        required: true
    },
    isRecommended: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        default:REVIEW_STATUS.Waitng_Approval,
        enum:[REVIEW_STATUS.Approved,REVIEW_STATUS.Rejected,REVIEW_STATUS.Waitng_Approval]
    },
    created: {
        type: Date,
        default: Date.now()
    }
})

module.exports=mongoose.model('review',reviewSchema)