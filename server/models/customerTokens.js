const { response } = require('express');
const { default: mongoose } = require('mongoose')


const customerTokenSchema = new mongoose.Schema({
    customerID: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: String,
        default: Date.now()
    },
    lastUsedAt: {
        type: String
    },
    chemicalUsage: {
        type: String
    },
    totalHits: {
        type: Number,
        default: 0
    },
    history:[{
        hitTime:{
            type: String,
        },
        response: {
            type: String
        }
    }]
});

const CustomerToken = mongoose.model('CustomerToken', customerTokenSchema);
module.exports = CustomerToken;