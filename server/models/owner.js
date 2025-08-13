const mongoose = require('mongoose')

const ownerSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    contactNumber:{
        type: String,
        required: true
    },
    machines:{
        type:[String]
    },
    timeStamp:{
        type: String,
        required: true
    },
    ownerID:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    isActive:{
        type:Boolean,
        default: false,
        required: true
    },
    organization:{
        type:String,
        //required: true
    },
    streetnumber:{
        type: String,
        require: true
    },
    city:{
        type:String,
        required: true
    },
    street:{
        type:String,
        required: true
    },
    zipcode:{
        type:String,
        required: true
    },
    accessedOnce:{
        type:Boolean,
        default:false
    },
    certificateReceiver:[{
        firstName:{
            type:String
        },
        lastName:{
            type:String
        },
        email:{
            type:String
        },
    }],
    session:[{
        token:{type:String},
        browser:{type:String},
    }],
    hash : { type:String },
    validTill : { type: String, default: String(Date.now() + 15 * 1000 * 60) }
})
module.exports = mongoose.model('Owner', ownerSchema)