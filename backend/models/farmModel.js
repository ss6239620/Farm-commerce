const mongoose = require('mongoose')

const farmSchema = new mongoose.Schema({
    farmName: {
        type: String,
        required: true
    },
    farmDesc: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

const Farm = mongoose.model('farm', farmSchema)

module.exports = {
    farmSchema: farmSchema,
    farm: Farm
}
