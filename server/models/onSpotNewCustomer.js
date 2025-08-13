const {default:mongoose} = require('mongoose')


const onSpotNewcustomerSchema = new mongoose.Schema({
    licenseNumber:{
        type: String
    },
    certificateID: {
        type: String,
        unique: true
    },
    machineID:{
        type:String,
        required: true
    },
    
    email:{
        type:String
    },
    CreatedAttimeStamp:{
        type:String
    },
    washType:{
        type:String
    },
    trailerType: {
        type: String,
    },
})


module.exports = mongoose.model('onSpotNewcustomer',onSpotNewcustomerSchema)