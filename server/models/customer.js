const { default: mongoose } = require('mongoose')

const bcrypt = require('bcryptjs')
const { custom } = require('@hapi/joi')

const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    customerID: {
        type: String,
        required: true,
        unique: true
    },
    organizationName:{
        type: String,
    },
    ownerCustomer:{
        type: Boolean,
        default: false
    },
    ownerID:{
        type: String
    },
    customerMessages:[{
        subject:{
            type:String
        },
        message:{
            type:String
        },
        date:{
            type:String
        },
        isRead:{
            type:Boolean,
            default:false
        },
        isAgreed:{
            type:Boolean,
            default:false
        },
        agreedTime:{
            type:String
        }
    }],
    agreedOnApis:[{
        organizationName:{
            type:String
        },
        isAgreed:{
            type:Boolean,
            default:false
        }
    }],
    profilePicture:{
        type: String,
        default:'',
    },

    city: {
        type: String,
        reruired: true
    },
    street: {
        type: String,
        require: true
    },
    streetnumber:{
        type:String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
        
    },
    password: {
        type: String,
        required: true
    },
    sessionToken:{
        type: String
    } ,
    session:[{
        token:{type:String},
        browser:{type:String},
    }],
    situation:{
        type: String,
    },
    backupLicenseNumber:[
        {
            licenseNumber:{
                type: String
            },
            trailerDesignation:{
                type: String
            },
            trailerModel:{
                type: String
            },
            constractedYear:
            {
                type: String
            }
        }
    ],
    licenses: [
        {
            licenseNumber:{
                type: String
            },
            trailerDesignation:{
                type: String
            },
            trailerModel:{
                type: String
            },
            constractedYear:
            {
                type: String
            }
        }
    ],
    //this is the array of certificates that will be generated for the customers 
    certificated: {
        type: [String]
    },
    role:{
        type:String,
        required: true
    },
    //appointment details for the customer as an array
    appointments:[{
        date:{
            type:String, 
        },
        shift:{
            type:String,
        },
        time:{
            type:String,
        },
        machineID:{
            type:String, 
        },
        licenseNumber:{
            type:String,    
        },
        createdTimestamp:{
            type: String,
        },
        machineAdress:{
            type: String,
        },
        deleteTimeStamp:{
            type:String
        },
        program:{
            type:String
        }
       
         
       
    }],
    //this token will be used for resetting the password and it will be deleted right after reseting the password
    resetToken:{
        type:String
    },
    emailToken:{
        type: String
    },
    isActive:{
        type: Boolean,
        default:false,
        required:true
    },
    deactiveByAdmin:{
        type: Boolean,
        default: false,
        required: true
    },
    customerPosition:{
        type: String,
        //required: true
    },
    //this is tax number for the customer
    personalizedNumber:{
        type: String
    },
    customerSituation:{
        type: String
    },
    billingemail:{
        type: String
    }
})

//hashing the password before saving
customerSchema.pre('save', async function(next){
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    }
    catch(error){
        console.log(error)

    }
})
//comparing the password with the hashed password
customerSchema.methods.validPassword = async function (password){
    try{
        return await bcrypt.compare(password, this.password)
    }
    catch(error){
        console.log(error)
    }
}

module.exports = mongoose.model('Customer', customerSchema)