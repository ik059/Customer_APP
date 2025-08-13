const mongoose = require('mongoose')

const appointmentSchema = mongoose.Schema({
    date:{
        type:String,
        required: true,
    },
    machineID:{
        type:String,
        required: true
    },
    time:{
        type: [String],
       
    },
    program:{
        type: [String],
    },
    customerID:{
        type: [String],
        
       
    }
})

module.exports = mongoose.model('Appointment1', appointmentSchema)