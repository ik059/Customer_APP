const db = require('../apiDBconnection');
const mongoose = require('mongoose');

const apiuserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    lastName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    date: {
        type: String,
        default: Date.now()
    },
    organization: {
        type: String,
    },
    currenAPIkey: {
        type: String,
    },
    phone: {
        type: String,
    },
    verificationCode: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    
});

const apiDB = db.model('Apiuser', apiuserSchema);

module.exports = apiDB;