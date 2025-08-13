const mongoose = require('mongoose');

const machineModelSchema = new mongoose.Schema({
    currentOwnerID: {
        type: String,
        required: true
    },
    previousOwnerList: {
        type: Array,
        default: []
    },
    certificates: [{
        ownerID: {
            type: String,
        },
        ownerCertificates: {
            type: Array,
            default: []
        }

    }],
    publicMachine:{
        type: Boolean,
        default: false
    },
    machineID: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    machineName: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    createdTimestamp: {
        type: String,
        required: true
    },
    logs: [{
        action: {
            type: String,
            default: ""
        },
        actionTimestamp: {
            type: String,
            default: ""
        },
    }],
    machineDeactivated: [{
        machineDeactivatedTimestamp: {
            type: String,
            default: ""
        },
        reason: {
            type: String,
            default: "",
            required: true
        },
        ownerID: {
            type: String,
            default: ""
        }
    }],

    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    currentAddress: [{
        city: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        streetNumber:{
            type:String,
            requiired: true
        },
        postcode: {
            type: String,
            required: true
        }
    }],

    //previous address
    address: [{
        city: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        postcode: {
            type: String,
            required: true
        }
    }]
})


module.exports = mongoose.model('MachineModel', machineModelSchema)
