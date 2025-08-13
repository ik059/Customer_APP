const Joi = require('@hapi/joi')
const registrationValidation = (data)=>{ 
    const registrationSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().min(6).required(),
        customerID: Joi.string(),
        city: Joi.string(),
        street: Joi.string(),
        postcode: Joi.string(),
        contactNumber: Joi.string(),
        role: Joi.string(),
        streetnumber: Joi.string().required(),
        companyName: Joi.string().required(),
        customerSituation: Joi.string().required(),
        taxidNumber: Joi.string().required(),
        billingemail: Joi.string().required(),

})
return registrationSchema.validate(data)
}

module.exports.registrationValidation = registrationValidation