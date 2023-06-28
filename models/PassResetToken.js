const mongoose = require('mongoose')

const passResetToken = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accessToken: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean
    }
},{
    timestamps: true
})

const ResetToken = mongoose.model('ResetToken',passResetToken)

module.exports = ResetToken