const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    customerID: {
        type: String,
        require: true,
        
    },
    licenseNumber: {
        type: String,
        required: true,
       
    },
    machineID: {
        type: String,
        required: true,
        
    },
    trailerType: {
        type: String,
    },
    certificateID: {
        type: String,
        required: true,
        unique: true,
    },
    CreatedAttimeStamp: {
        type: String,
        required: true,
        default:Date.now()
    },
    washType: {
        type: String,
    },
    
    
})


module.exports = mongoose.model("Certificate", certificateSchema);
