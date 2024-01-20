const mongoose = require('mongoose')
const { isEmail } = require('validator')

const UserSchema = new mongoose.Schema({
    name: {
        required: [true, 'Please enter your name'],
        type: String
    },
    phone: {
        minlength: 10,
        maxLength: 10,
        type: Number,
        default: null
    },
    email: {
        required: [true, 'Please enter an email'],
        type: String,
        unique: true,
        validate: [isEmail, 'Please enter a valid email']
    },

}, {
    versionKey: false,
    timestamps: true,
})

module.exports = mongoose.model('Users', UserSchema)