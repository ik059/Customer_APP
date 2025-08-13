const mongoose = require('mongoose')

const appointmentSchema = mongoose.Schema({
    date:{
        type:String,
        required: true,
    },
    shift:{
        type:String,
        required: true
    },
    machineID:{
        type:String,
        required: true
    },
    time:{
        type: [String],
    },
    customerID:{
        type: [String],
       
    }
})

module.exports = mongoose.model('Appointment3', appointmentSchema)