const router = require('express').Router()
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const {registrationValidation} = require('../validation')
const crypto = require('crypto')
var hbs = require('nodemailer-express-handlebars');
const path = require('path');
var ObjectId = require('mongodb').ObjectId;
const owners = require('../models/owner') //Schema for owner collection
const Customer = require('../models/customer') //Schema for customer collection
const Machine = require('../models/machine')//Schema for Machine collection
const Certificate = require('../models/certificate')//Schema for Certificate collection
const Image = require('../models/images')
const onSpot = require('../models/onSpotNewCustomer')
const pdf = require('html-pdf');
const fs = require('fs');
const apiDB = require('../models/apiDB')
const predefiendCustomer = require('../models/predefiendCustomer')
const { DateTime } = require('luxon');
const axios = require('axios');
//const { f } = require('html2pdf.js')
let transporter = nodemailer.createTransport({
     host: process.env.sendingHost,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.sendingEmail,
      pass: process.env.sendingPassword,
    },
    tls: {
           ciphers: 'SSLv3'
         }
  });


const handlebarOptions = {
    viewEngine:{
        extName: ".handlebars",

        partialsDir: path.resolve( __dirname,'../emails'),
        defaultLayout: false,
    },
    viewPath: path.resolve(__dirname,'../emails'),
    extName: ".handlebars"
}

transporter.use('compile',hbs(handlebarOptions))

///registration API
router.post('/customerregistration', async (req, res) => {
   
    const { error } = registrationValidation(req.body)
    if (error) {
        // error.details.forEach(detail => {
        //     console.error('Error Field:', detail.context.key);
        //     console.error('Error Message:', detail.message);
        //   });
        console.log(error.details[0].message)
        
        if(error.details[0].context.key == 'password'){
            res.send('DIE LÄNGE DES "PASSWORTS" MUSS MINDESTENS 6 ZEICHEN BETRAGEN!')
        }
        if(error.details[0].context.key == 'email'){
            res.send('"E-MAIL" DARF NICHT LEER SEIN!')
        }
        if(error.details[0].context.key == 'firstName'){
            res.send('"VORNAME" DARF NICHT LEER SEIN!')
        }
        if(error.details[0].context.key == 'lastName'){
            res.send('"NACHNAME" DARF NICHT LEER SEIN!')
        }
        if(error.details[0].context.key == 'city'){
            res.send('"Stadt" darf nicht leer sein!')
        }
        if(error.details[0].context.key == 'postcode'){
            res.send('"Postleitzahl" darf nicht leer sein')
        }
        if(error.details[0].context.key == 'contactNumber'){
            res.send('Die "Telefonnummer" darf nicht leer sein!')
        }
        if(error.details[0].context.key == 'streetnumber'){
            res.send('"Straßennummer" ist erforderlich!')
        }
        if(error.details[0].context.key == 'companyName'){
            res.send('"Der Firmenname wird abgefragt!')
        }
        if(error.details[0].context.key == 'customerSituation'){
            res.send('"Kundensituation" ist erforderlich!')
        }
        if(error.details[0].context.key == 'taxidNumber'){
            res.send('"Steuernummer" ist erforderlich!')
        }
        if(error.details[0].context.key == 'billingemail'){
            res.send('"Rechnungs-E-Mail" ist erforderlich!')
        }
        //res.send(error.details[0].message)
    }
    //checking the email if it iw already registered or not 
    else{
        const existEmail = await Customer.findOne({ email: req.body.email })
    if (existEmail) {
        return res.send('E-Mail bereits verwendet. Bitte melden Sie sich an!')
    }
    else {
       
        const customer = new Customer({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            customerID: req.body.customerID,
            city: req.body.city,
            street: req.body.street,
            postcode: req.body.postcode,
            contactNumber: req.body.contactNumber,
            password: req.body.password,
            role: req.body.role,
            streetnumber: req.body.streetnumber,
            organizationName: req.body.companyName,
            emailToken: crypto.randomBytes(64).toString('hex'),
            billingemail: req.body.billingemail,
            personalizedNumber: req.body.taxidNumber,
            customerSituation: req.body.customerSituation,
        })

        try {
            //sending email to the new registered user
            //later on the verify link will be added with the email
            let mailOptions = {
                from: `"Customer APP " <${process.env.sendingEmail}>`,
                to: customer.email,
                subject: "Bestätigen Sie Ihre E-Mail!",
                template: "verifyemai",
                context:{
                    lastName: customer.firstName +" "+ customer.lastName,
                    token: customer.emailToken
    
                }
            }
            transporter.sendMail(mailOptions, (error, details) => {
                if (error) {
                    console.log(error)
                }
                else {
                    console.log("Mail gesendet!")
                }
            })
            const newCustomer = await customer.save()
            return res.send('ok')
        }
        //if anything went wrong
        catch (err) {
            res.send('Etwas ist schief gelaufen, bitte versuchen Sie es erneut!')
            console.log(err)
        }
    }
} 

router.get('/ok', (req, res)=>{
    res.send('ok')
})


//verification and boolean change
router.post('/bla', async (req,res)=>{
    try{
        const token = req.body.token
        const customer = await Customer.findOne({emailToken: token})

        if(customer){
            await customer.update({$set: {emailToken : null,isActive : true}})

            res.status(200).send('Email Confirmed! Please log in to your account.')
        }
        else{
            res.status(400).send('Link Expired!!!')
        }
    }
    catch(err){
        console.log(err)
        
    }
})

})

router.post('/verifications', async (req, res)=>{
    try{
        const token = req.body.token
        const customer = await Customer.findOne({emailToken: token})

        if(customer){
            await customer.update({$set: {emailToken : null,isActive : true}})

            res.status(200).send('Email Confirmed! Please log in to your account.')
        }
        else{
            res.send('Link Expired!!!')
        }
    }
    catch(err){
        console.log(err)
        
    }
})

///login API with validation and credentials and to set the new token for every login
router.post('/login', async (req, res) => {
    const existCustomer = await Customer.findOne({ email: req.body.customerID })
    if (!existCustomer) {
        return res.status(400).send('Benutzer nicht gefunden!')
    }
    else {

        /**** Need to be updated from abdul's model
         * 
         * 
         * 
         * 
         * 
         * important ****/
        //validPassword is from the customer schema to match the passwords
        const isMatched = await existCustomer.validPassword(req.body.password)

        ///const isMatched = existCustomer.password
        if (!isMatched) {
            res.status(400).send("Falsches Passwort!")
        }
        else if(!existCustomer.isActive){
            return res.status(400).send("Bitte bestätigen Sie Ihre E-Mail!")
        }
        else if(existCustomer.deactiveByAdmin){
            return res.status(400).send("Aufgrund von Inaktivität wurde der Account vorübergehend deaktiviert. Bitte kontaktieren Sie uns.")
        }
        //generating a new new token for individual login session

        else {
            let Secret_Token = 'strongpasdgdsgfdsfdssword'
            const token = jwt.sign({ _id: existCustomer._id }, Secret_Token)
            console.log(token)
           await existCustomer.updateOne({ $push: { session:{token: token , browser: req.body.fingerprint} }})
           
            res.status(200).header('auth-token', token).send(token)
        }
    }

})

//checking each session
router.post('/sessionCheck', async (req, res) => {

    const existCustomer = await Customer.findOne({session:{$elemMatch:{ token: req.body.token}} })
    //let valid = false
    if(existCustomer){
        // for(let i=0;i<existCustomer.session.length;i++){
            
        //     if(existCustomer.session[i].token === req.body.token && existCustomer.session[i].browser === req.body.fingerprint){
        //         console.log('valid') 
        //         valid = true      
        //     }
           
        // }
        //if(valid){
            res.status(200).send('valid')
        // }
        // else{
        //     res.status(400).send('invalid')
        // }
    }
    else{
        res.status(400).send('invalid')
        console.log('not exist')
    }

})

///take the token of the logged in customer as a prameter to display his data
router.get('/user', (req, res) => {
    let token = req.headers.token
    let Secret_Token = 'strongpasdgdsgfdsfdssword'
    jwt.verify(token, Secret_Token, (error, granted) => {
        if (error) return res.status(400).send(error)

        Customer.findOne({ _id: granted._id }, (err, user) => {
            if (error) return res.send(error)
            return res.status(200).json({
                user
            })
        })
    })
})
///display the machines
router.get('/machines', async (req, res) => {
    let machines = await Machine.find().limit(3)
    res.send(machines)
})
///total list of machines
router.get('/machinelist', async (req, res) => {
    let machines = await Machine.find({publicMachine: true})
    res.send(machines)
})
router.post('/getownerMachine', async (req, res)=>{
    const findMachine = await Machine.find({currentOwnerID: req.body.ownerID})
    const publicMachines = await Machine.find({publicMachine: true})
    let allMachines = findMachine.concat(publicMachines)
    res.send(allMachines)
})
///take the token of the logged in customer as a prameter to display his data(Mounted with the profile page)
router.get('/customerprofile',  async (req, res) => {
    let token = req.headers.token
    let Secret_Token = 'strongpasdgdsgfdsfdssword'
    jwt.verify(token, Secret_Token, (error, granted) => {
        if (error) return res.send(error)
       Customer.findOne({ _id: granted._id }, (err, user) => {
            if (error) return res.send(error)
            return res.status(200).json({
                user
            })
            
        })
       
    })
})
///This api will add a new license with the condotions 
router.post('/addlicense', async (req, res, next) => {
    console.log(req.body)
    const existCustomer = await Customer.findOne({ customerID: req.body.customerID }) //searching the logged in customer
    
    if (existCustomer) {
        //checking customer's licenses
        const existLicense =  await Customer.findOne({licenses:{$elemMatch:{licenseNumber: req.body.licenseNumber}}})
        if (existLicense) {
            res.status(400).send("Lizenz bereits registriert!")
        }
        else {
            //pushing new license in the license array of the customer
            await existCustomer.updateOne({ $push: 
                {
                licenses: {
                licenseNumber: req.body.licenseNumber,
                trailerDesignation: req.body.trailerDesignation,
                trailerModel: req.body.trailerModel,
                constractedYear: req.body.constractedYear
            } } })
            await existCustomer.updateOne({ $push:{
                backupLicenseNumber: {
                    licenseNumber: req.body.backupLicenseNumber,
                    trailerDesignation: req.body.trailerDesignation,
                    trailerModel: req.body.trailerModel,
                    constractedYear: req.body.constractedYear
                }
            }})
            res.status(200).send("Neues Kennzeichen hinzugefügt!")
        }

    }
    else {
        //if anything went wrong
        res.status(400).send("Es ist ein Fehler aufgetreten, bitte versuchen Sie es später noch einmal!")
        next()
    }
})
///to delete an lecense
router.post('/deleteLicense', async (req, res) => {
    //searching the logged in customer and pulling the license number from the array
    const existCustomer = await Customer.findOneAndUpdate({ customerID: req.body.customerID }, {
        $pull: {
            licenses:{licenseNumber: req.body.licenseNumber}
        },
    })   
    res.sendStatus(200)

})

///reset password
router.post('/resetpassword', async (req, res) => {
    //searching customer by the email address
    const existCustomer = await Customer.findOne({ email: req.body.email })
    if (existCustomer) {
        res.status(200).send('ok')
        //generating a new token for reseting password
        let Secret_Token = 'strongpasdgdsgfdsfdssword'
        const token = jwt.sign({ _id: existCustomer._id }, Secret_Token)
        //saving token temporarily to reset password

        //existCustomer.resetToken = token
        //saving the token temporarily just for resetting the password
        await existCustomer.update({$set: {resetToken : token}})


        //send email with the token
        let mailOptions = {
            from: `"Passwort zurücksetzen" <${process.env.sendingEmail}>`,
            to: existCustomer.email,
            subject: "Setze dein Passwort zurück!",
            template: "resetPassword",
            context:{
                lastName: existCustomer.firstName+" "+existCustomer.lastName,
                token: token

            }
        }
        transporter.sendMail(mailOptions, (error, details) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log("Mail Sent!")
            }
        })
    }
    else {
        res.status(400).send('not Ok')
    }
})

//setnewpassword
router.post('/setnewpassword', async (req, res) => {
    ///checking the reset token for resetting the password
    const existCustomer = await Customer.findOne({ resetToken: req.body.token })
    if (existCustomer) {
        existCustomer.password = req.body.password
        existCustomer.resetToken = null
        //updating the new password and removing the temporary token
       await existCustomer.save()
        
      
            //sending email to the new registered user
            //later on the verify link will be added with the email
            let curretntime = new Date()
            let date = curretntime.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' });
            let time = curretntime.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin' });
            //add one hour to the current time
           //time = curretntime.setHours(curretntime.getHours() + 1)
           //handling if the time is 12:00 AM
              if (time == 0) {
                time = curretntime.setHours(1)
            }
    
    
            let mailOptions = {
                from: `"Aktualisiertes Passwort" <${process.env.sendingEmail}>`,
                to: existCustomer.email,
                subject: "Passwort aktualisiert!",
                template: "passwordupdate",
                context:{
                    lastName: existCustomer.firstName+" "+ existCustomer.lastName,
                    currentTime: time,
                    currentDate: date
                }
            }
            transporter.sendMail(mailOptions, (error, details) => {
                if (error) {
                    console.log(error)
                }
                else {
                    console.log("Mail Sent!")
                }
            })
        

        res.status(200).send('Ok')
    }
    else{
        res.send("notOk")
    }
    
})

const SECRET_TOKEN = 'strongpasdgdsgfdsfdssword';
//showing customer certificate list 
router.get('/customercertificates', async (req, res) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        jwt.verify(token, SECRET_TOKEN, async (error, granted) => {
            if (error) {
                console.error('JWT verification failed:', error);
                return res.status(401).json({ error: 'Unauthorized access' });
            }

            try {
                const user = await Customer.findOne({ _id: granted._id });
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                const customerId = user.customerID;
                const certificates = await Certificate.find({ customerID: customerId });
                
                const formattedCertificates = certificates
                    .sort((a, b) => b.CreatedAttimeStamp - a.CreatedAttimeStamp)
                    .map(cert => {
                        const timestamp = parseInt(cert.CreatedAttimeStamp, 10);
                        if (isNaN(timestamp)) {
                            console.error(`Invalid timestamp: ${cert.CreatedAttimeStamp}`);
                            return cert;
                        }

                        const dateObj = new Date(timestamp);
                           //create date and time for the certificate manually
                            let day = dateObj.getDate()
                            let month = dateObj.getMonth() + 1
                            let year = dateObj.getFullYear()
                            if(day < 10){
                                day = '0'+day
                            }
                            if(month < 10){
                                month = '0'+month
                            }
                            let date = day + '.' + month + '.' + year
                            //get minutes and hours
                            let min = dateObj.getMinutes()
                            let hour = dateObj.getHours()
                            if(min < 10){
                                min = '0'+min
                            }
                            if(hour < 10){
                                hour = '0'+hour
                            }
                            let time = hour + ':' + min

                        return {
                            ...cert.toObject(),
                            
                            date: date,
                            time: time
                        };
                    });

                res.json(formattedCertificates);
            } catch (err) {
                console.error('Error fetching user or certificates:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Unexpected server error' });
    }
});
router.post('/certificatefilterbyOwnerID', async (req, res) => {
    console.log(req.body);

    try {
        // Fetch customer using the correct query format
        const customer = await Customer.findOne({ "session.token": req.body.token });

        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        // Check if customer is an owner
        if (!customer.ownerCustomer) {
            return res.status(403).json({ error: "Not an owner customer" });
        }

        // Fetch the owner using ownerID from the customer
        const owner = await owners.findOne({ ownerID: customer.ownerID });

        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }

        let machines = owner.machines;

        // Fetch all machines in parallel
        const machineDocs = await Machine.find({ machineID: { $in: machines } });

        if (!machineDocs.length) {
            return res.status(404).json({ error: "No machines found for this owner" });
        }

        // Fetch all certificates and non-registered certificates in parallel
        const allCertificatesPromises = machineDocs.map(async (machine) => {
            const certificates = await Certificate.find({ machineID: machine.machineID });
            const nonRegCert = await onSpot.find({ machineID: machine.machineID });
            return certificates.concat(nonRegCert);
        });

        // Wait for all certificate data to be retrieved
        const allCertificatesArray = await Promise.all(allCertificatesPromises);

        // Flatten array (if needed)
        const allCertificates = [].concat(...allCertificatesArray);

        console.log(`Total Certificates: ${allCertificates.length}`);
        let response = organizeCertificate(allCertificates)
        console.log(response[0])
        return res.status(200).json(response);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
function organizeCertificate(certiifcates){
    const formattedCertificates = certiifcates
                    .sort((a, b) => b.CreatedAttimeStamp - a.CreatedAttimeStamp)
                    .map(cert => {
                        const timestamp = parseInt(cert.CreatedAttimeStamp, 10);
                        if (isNaN(timestamp)) {
                            console.error(`Invalid timestamp: ${cert.CreatedAttimeStamp}`);
                            return cert;
                        }
                        const iso = DateTime.fromMillis(parseInt(cert.CreatedAttimeStamp), { zone: 'Europe/Berlin' });
                        //console.log(iso.toISO())
                        //extract the date from the ISO string in format dd.mm.yyyy
                        const date = iso.toFormat('dd.MM.yyyy'); // Extract date part in dd.MM.yyyy format
                        
                        //const date = iso.toISO().split('T')[0]; // Extract date part
                        const time = iso.toFormat('HH:mm'); // Extract time part in HH:mm format

                        // const dateObj = new Date(timestamp);
                        //    //create date and time for the certificate manually
                        //     let day = dateObj.getDate()
                        //     let month = dateObj.getMonth() + 1
                        //     let year = dateObj.getFullYear()
                        //     if(day < 10){
                        //         day = '0'+day
                        //     }
                        //     if(month < 10){
                        //         month = '0'+month
                        //     }
                        //     let date = day + '.' + month + '.' + year
                        //     //get minutes and hours
                        //     let min = dateObj.getMinutes()
                        //     let hour = dateObj.getHours()+2
                        //     if(min < 10){
                        //         min = '0'+min
                        //     }
                        //     if(hour < 10){
                        //         hour = '0'+hour
                        //     }
                        //     let time = hour + ':' + min

                        return {
                            ...cert.toObject(),
                            
                            date: date,
                            time: time
                        };
                    });

    return formattedCertificates
}
//sharing the certificate details for the certificate pdf
router.post('/certificatedetails', async (req, res) => {
    console.log(req.body)
    const existCertificate = await Certificate.findOne({ certificateID: req.body.certificateID })
    const existInonSpot = await onSpot.findOne({certificateID: req.body.certificateID})
    if (existCertificate) {
        console.log("AB")
        const existCustomer = await Customer.findOne({ customerID: existCertificate.customerID })
        const currentmachine = await Machine.findOne({ machineID: existCertificate.machineID })
        const owner = await owners.findOne({ ownerID: currentmachine.currentOwnerID })
        let trailerType = existInonSpot.trailerType ? existInonSpot.trailerType : ''
        //getting data from the customer and the certificate collection
        let certificateDetails = {
            
            customerFirstname: existCustomer.firstName,
            customerLastname: existCustomer.lastName,
            customerID: existCustomer.customerID,
            machineID: existCertificate.machineID,
            license: existCertificate.licenseNumber,
            issuedDate: existCertificate.CreatedAttimeStamp,
            certificateID: existCertificate.certificateID,
            washType: existCertificate.washType,
            organizationName: owner.organization,
            trailerType: trailerType
        }
        res.send(certificateDetails)
    }
    if(existInonSpot){
      console.log(existInonSpot)
      const currentmachine = await Machine.findOne({ machineID: existInonSpot.machineID })
      const owner = await owners.findOne({ ownerID: currentmachine.currentOwnerID })
      let trailerType = existInonSpot.trailerType ? existInonSpot.trailerType : ''
        let certificateDetails = {
            machineID: existInonSpot.machineID,
            license: existInonSpot.licenseNumber,
            issuedDate: existInonSpot.CreatedAttimeStamp,
            certificateID: existInonSpot.certificateID,
            washType: existInonSpot.washType,
            organizationName: owner.organization,
            trailerType: trailerType
        }
        res.send(certificateDetails)
    }
    if(!existCertificate && !existInonSpot){
        res.sendStatus(404)
    }
})
//This api will update the logged in customer's password
router.post('/updatepassword', async (req, res) => {
    //searching the customer from the customer collection
    const existCustomer = await Customer.findOne({ customerID: req.body.customerID })
    if (existCustomer) {
        //matching the old password
        const isMatched = await existCustomer.validPassword(req.body.oldPassword)
        if (isMatched) {
            //checking the new password if it's same as the old password
            const isNewMatched = await existCustomer.validPassword(req.body.newPassword)
            if (isNewMatched) {
                res.send('Altes und neues Passwort können nicht identisch sein!')
            }
            else {
                //updating new password
                existCustomer.password = req.body.newPassword

                await existCustomer.save()
                //the new password will be saved as a hashed password 
                
               
                    //sending email to the new registered user
                    //later on the verify link will be added with the email
                    let curretntime = new Date()
                    // let date = curretntime.toLocaleDateString('en-GB')
                    // let time = curretntime.toLocaleTimeString('en-GB')
                    let date = curretntime.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' });
                    let time = curretntime.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin' });
            
                    let mailOptions = {
                        from: `"Aktualisiertes Passwort" <${process.env.sendingEmail}>`,
                        to: existCustomer.email,
                        subject: "Passwort aktualisiert!",
                        template: "passwordupdate",
                        context:{
                            lastName: existCustomer.lastName,
                            currentTime: time,
                            currentDate: date
                        }
                    }
                    transporter.sendMail(mailOptions, (error, details) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            console.log("Mail Sent!")
                        }
                    })
                
               
                res.send('Passwort aktualisiert!')
            }
            

        }
        //if old password is not matched
        else {
            res.send('Das alte Passwort ist falsch!')
        }

    }
})

router.post('/searchmachinebypostcode', async (req, res)=>{
    console.log(req.body)
    const existMachine = await Machine.find({"currentAddress.0.postcode":{$regex:req.body.postcode}})
    console.log(existMachine)
    res.send(existMachine)
})


router.get('/image', async (req, res)=>{

    const image = await Image.find()

    
    res.send(image[0].images)
    //res.send(base64)
    
})

router.post('/updateProfilepicture', async (req, res)=>{
    const existCustomer = await Customer.findOne({customerID: req.body.customerId})

    if(existCustomer){
   
        await existCustomer.update({$set:{profilePicture:req.body.image}})
        res.sendStatus(200)
    }
    else{
        res.send('Something went wrong!')
    }
})


router.post('/logout', async (req, res) => {
    const currentCustomer = await Customer.findOne({ session:{$elemMatch:{token: req.body.sessionToken, browser: req.body.fingerprint }}})
    if (currentCustomer) {
        await currentCustomer.update({ $pull: { session: { token: req.body.sessionToken } } })
        res.status(200).send("Logged Out")
    }
    else {
        res.status(200).send("Already Logged Out")
    }
})

router.post('/suntainability', async (req, res)=>{
    const currentCustomer = await Customer.findOne({ session:{$elemMatch:{token: req.body.sessionToken }}})
    if(currentCustomer){
        res.json({total: currentCustomer.certificated.length})
    }
})

router.post('/getownercustomersustainability', async (req, res)=>{
    const currentCustomer = await Customer.findOne({ session:{$elemMatch:{token: req.body.sessionToken }}})
    if(currentCustomer){
        if(currentCustomer.ownerCustomer){
            const owner = await owners.findOne({ownerID: currentCustomer.ownerID})
            if(owner){
                const machines = owner.machines
                let total = 0
                for(let i = 0; i<machines.length; i++){
                    const certificates = await Certificate.find({machineID: machines[i]})
                    total = total + certificates.length
                }
                for(let i = 0; i<machines.length; i++){
                    const certificates = await onSpot.find({machineID: machines[i]})
                    total = total + certificates.length
                }
                res.json({total: total})
            }
        }
    }

})

router.post('/locationSuggestion', async (req, res)=>{
    const input = req.body.location; // Get the input query from the client
    const apiKey = 'AIzaSyCy-407Yrt-tBtL_bVZZtpHJVJFnnQZuRY'
    const country =  'DE';
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&components=country:${country}&key=${apiKey}`;
  
    try {
      const response = await axios.get(apiUrl);
      console.log(response.data)
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
})


//API -get custoemer's certificate 
//Fileter buy licenseNumber and year
router.post('/certificatefilterbyLicenseNumber', async (req, res)=>{
    console.log(req.body)
    const certificates = await Certificate.find({licenseNumber: req.body.licenseNumber,customerID: req.body.customerID})
    let total = []
    for(let i = 0; i<certificates.length; i++){
        let date = new Date(parseInt(certificates[i].CreatedAttimeStamp))
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        if(day < 10){
            day = '0'+day
        }
        if(month < 10){
            month = '0'+month
        }
        let date2 = day + '.' + month + '.' + year
        certificates[i].date = date2
        let min = date.getMinutes()
        let hour = date.getHours()
        if(min < 10){
            min = '0'+min
        }
        if(hour < 10){
            hour = '0'+hour
        }
        let time = hour + ':' + min
        certificates[i].time = time
        let customeObject = {
            customerID: certificates[i].customerID,
            licenseNumber: certificates[i].licenseNumber,
            machineID: certificates[i].machineID,
            certificateID: certificates[i].certificateID,
            CreatedAttimeStamp: certificates[i].CreatedAttimeStamp,
            date: date2,
            time: time
        }
        total.push(customeObject)

    }

    console.log(total)
    res.send(total)
})

router.post('/yearlysuntainability', async (req,res)=>{
    console.log(req.body)
    const currentCustomer = await Customer.findOne({ session:{$elemMatch:{token: req.body.sessionToken }}})
    const customerID = currentCustomer.customerID
    console.log(customerID)
    const certificates = await Certificate.find({customerID: customerID})
    let total = []
    if(certificates){
        for(let i = 0; i<certificates.length; i++){
            console.log(new Date(parseInt(certificates[i].CreatedAttimeStamp)).getFullYear())
        if(!req.body.month){
            if(new Date(parseInt(certificates[i].CreatedAttimeStamp)).getFullYear() == req.body.year){
                console.log("A")
                total.push(certificates[i])
            }
        }
        else{
            if(new Date(parseInt(certificates[i].CreatedAttimeStamp)).getFullYear() == req.body.year && new Date(parseInt(certificates[i].CreatedAttimeStamp)).getMonth()+1 == req.body.month){
                console.log("B")
                total.push(certificates[i])
            }
        }
        }
    }
    res.json({total: total.length})

})
router.post('/yearlysuntainabilityownercustomer', async (req,res)=>{
    try{
        console.log(req.body)
        const currentCustomer = await Customer.findOne({ session:{$elemMatch:{token: req.body.sessionToken }}})
        if(currentCustomer){
            if(currentCustomer.ownerCustomer){
            const owner = await owners.findOne({ownerID: currentCustomer.ownerID})
            const machines = owner.machines
            let total = 0
            for(let i = 0; i<machines.length; i++){
                const certificates = await Certificate.find({machineID: machines[i]})
                for(let j = 0; j<certificates.length; j++){
                    if(!req.body.month){
                        if(new Date(parseInt(certificates[j].CreatedAttimeStamp)).getFullYear() == req.body.year){
                            total = total + 1
                        }
                    }
                    else{
                        if(new Date(parseInt(certificates[j].CreatedAttimeStamp)).getFullYear() == req.body.year && new Date(parseInt(certificates[j].CreatedAttimeStamp)).getMonth()+1 == req.body.month){
                            total = total + 1
                        }
                    }
                }
            }
            for(let i = 0; i<machines.length; i++){
                const certificates = await onSpot.find({machineID: machines[i]})
                for(let j = 0; j<certificates.length; j++){
                    if(!req.body.month){
                        if(new Date(parseInt(certificates[j].CreatedAttimeStamp)).getFullYear() == req.body.year){
                            total = total + 1
                        }
                    }
                    else{
                        if(new Date(parseInt(certificates[j].CreatedAttimeStamp)).getFullYear() == req.body.year && new Date(parseInt(certificates[j].CreatedAttimeStamp)).getMonth()+1 == req.body.month){
                            total = total + 1
                        }
                    }
                }
            }
            console.log(total)
            res.json({total: total})
            }
        }
        else{
            res.send('not found').status(404)
        }
    }
    catch(err){
        console.log(err)
        res.send('not found').status(404)
    }
   

})

router.post("/getMachineAddress", async (req, res)=>{
    console.log(req.body)
    const machine = await Machine.findOne({machineID:req.body.machineID})
    if(machine){

        let address = machine.currentAddress[0].street + ' ' + machine.currentAddress[0].streetNumber + ',  ' + machine.currentAddress[0].postcode + ' ' + machine.currentAddress[0].city
        let machineName = machine.machineName
        console.log("address", address, machineName)
        res.json({address: address, machineName: machineName})
    }
    else{
        res.send('not found')
    }
})

//get messages
router.post('/customermessages', async (req, res)=>{
    console.log(req.body)
    const currentCustomer = await Customer.findOne({customerID : req.body.customerId})
    if(currentCustomer){
        console.log(currentCustomer.customerMessages)
        res.send(currentCustomer.customerMessages)
    }
    else{

    }
})

router.post('/downloadcertificate', async (req, res)=>{
    console.log(req.body)
    let data={}
    let programName = req.body.washType
    let timeStamp = new Date(parseInt(req.body.certificateDetails.issuedDate));
    let  issuedDate= new Date(parseInt(req.body.certificateDetails.issuedDate))
    const time = issuedDate.toLocaleString('de-DE', {
        timeZone: 'Europe/Berlin', // Specify the timezone for Germany
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    let date = timeStamp.getDate();
    let month = timeStamp.getMonth() + 1;
    let year = timeStamp.getFullYear();
    if(date < 10){
        date = '0'+date
    }
    if(month < 10){
        month = '0'+month
    }
    let date2 = date + '.' + month + '.' + year
    const encodedURL = encodeURIComponent(`https://${process.env.VUE_APP_HOST}/#/certificate/pdf/?certificate=${req.body.certificateDetails.certificateID}`);
    if(req.body.certificateDetails.organizationName){
        data.name = req.body.certificateDetails.organizationName
        data.licenseNumber = req.body.certificateDetails.license
        data.createdDate = date2
        data.createdTime = time
        data.certificateId = req.body.certificateDetails.certificateID
        data.certificateId2 = req.body.certificateDetails.certificateID
        data.link = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedURL}`,
        data.programName = programName
        data.machineAddress = req.body.machineAddress
        data.machineName = req.body.machineName
        generateRegisteredCertificate(data).then(buffer => {
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="registeredCertificate.pdf"'
            });
            res.send(buffer);
        })
        .catch(err => {
            console.error('Error generating PDF:', err);
            res.status(500).send('Error generating PDF');
        });
    }
    else{
        data.licenseNumber = req.body.certificateDetails.license
        data.createdDate = date2
        data.createdTime = time
        data.certificateId = req.body.certificateDetails.certificateID
        data.certificateId2 = req.body.certificateDetails.certificateID
        data.link = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedURL}`
        data.programName = programName
        data.machineAddress = req.body.machineAddress
        data.machineName = req.body.machineName
        nongenerateRegisteredCertificate(data).then(buffer => {
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="registeredCertificate.pdf"'
            });
            res.send(buffer);
        })
        .catch(err => {
            console.error('Error generating PDF:', err);
            res.status(500).send('Error generating PDF');
        });
    }
    //console.log(data)
})
router.get("/companycertificate", async (req, res)=>{
    console.log(req.query)
    let certificateID = req.query.certificate
    console.log(certificateID)
    let nonReg = await onSpot.findOne({certificateID: certificateID})
    console.log(nonReg)
    if(!nonReg){
        res.status(404).send('Certificate not found')
        return
    }
    const currentMachine = await Machine.findOne({machineID: nonReg.machineID})
    if(!currentMachine){
        res.status(404).send('Machine not found')
        return
    }
    const currentOwner = await owners.findOne({ownerID: currentMachine.currentOwnerID})
    const encodedURL = encodeURIComponent(`https://${process.env.VUE_APP_HOST}/#/certificate/pdf/?certificate=${certificateID}`);
    let data = {}
    data.name = currentOwner.organization
    data.licenseNumber = nonReg.licenseNumber
    data.certificateId = nonReg.certificateID
    data.certificateId2 = nonReg.certificateID
    data.link = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedURL}`
    if(nonReg.trailerType){
        data.programName = nonReg.washType + ' - ' + nonReg.trailerType + ' - ' + "Company"
    }
    else{
        data.programName = nonReg.washType + ' - ' + "Company"
    }
    data.machineAddress = currentMachine.currentAddress[0].street + ' ' + currentMachine.currentAddress[0].streetNumber + ',  ' + currentMachine.currentAddress[0].postcode + ' ' + currentMachine.currentAddress[0].city
    data.machineName = currentMachine.machineID
    let timeStamp = new Date(parseInt(nonReg.CreatedAttimeStamp));
    let  issuedDate= new Date(parseInt(nonReg.CreatedAttimeStamp))
    const time = issuedDate.toLocaleString('de-DE', {
        timeZone: 'Europe/Berlin', // Specify the timezone for Germany
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    let date = timeStamp.getDate();
    let month = timeStamp.getMonth() + 1;
    let year = timeStamp.getFullYear();
    if(date < 10){
        date = '0'+date
    }
    if(month < 10){
        month = '0'+month
    }
    let date2 = date + '.' + month + '.' + year
    data.createdDate = date2
    data.createdTime = time
    generateRegisteredCertificate(data).then(buffer => {
        const filename = `REINIGUNGSNACHWEIS_${nonReg.washType}_${nonReg.licenseNumber}_${certificateID}.pdf`;

                    res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="${filename}"`
                    });

        res.send(buffer);
    })
    .catch(err => {
        console.error('Error generating PDF:', err);
        res.status(500).send('Error generating PDF');
    });

})
function generateRegisteredCertificate(data) {
    // Read the HTML file
    console.log("P",data.programName)
    let htmlTemplatePath;
    if( data.programName == 'Doppelstockbalken - Professional'){
     htmlTemplatePath = path.join(__dirname, '../pdfFiles/professional.html');
    }
    else if(data.programName == 'Fleischhängebahn - Professional'){
        htmlTemplatePath = path.join(__dirname, '../pdfFiles/professional.html');
    }
    else if(data.programName == 'Fleischhängebahn - Basic' || data.programName == 'Doppelstockbalken - Basic'){
        htmlTemplatePath = path.join(__dirname, '../pdfFiles/basic.html');
    }
    else if(data.programName == 'Doppelstockbalken - Professional +1'){
        htmlTemplatePath = path.join(__dirname, '../pdfFiles/professionalplus.html');
    }
    else if(data.programName == 'Fleischhängebahn - Professional +1'){
        htmlTemplatePath = path.join(__dirname, '../pdfFiles/f_professionalplus.html');
    }
    else if(data.programName == 'Dachser Bodennassreinigung - Company'){
        htmlTemplatePath = path.join(__dirname, '../pdfFiles/basic_600.html');
    }
    else{
       // print("C")
        htmlTemplatePath = path.join(__dirname, '../pdfFiles/basic.html');
    }
    console.log("htmlTemplatePath",htmlTemplatePath)
    
    const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');
    //console.log(htmlTemplate)
  
    // Inject values into the HTML template
    const htmlContent = htmlTemplate
      .replace('{{name}}', data.name)
      .replace('{{licenseNumber}}', data.licenseNumber)
        .replace('{{createdDate}}', data.createdDate)
        .replace('{{createdTime}}', data.createdTime)
        .replace('{{certificateId}}', data.certificateId)
        .replace('{{certificateId2}}', data.certificateId2)
        .replace('{{link}}', data.link)
        .replace('{{programName}}', data.programName)
        .replace('{{machineAddress}}', data.machineAddress)
        .replace('{{machineName}}', data.machineName);
        
  
  
    // Options for PDF generation
    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0'
      },
      margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0'
      }
    };
    const childProcessOptions = {
        env: {
          OPENSSL_CONF: '/dev/null'
        }
      };
  
    // Generate PDF as a Buffer
    return new Promise((resolve, reject) => {
        pdf.create(htmlContent, { ...options, childProcessOptions }).toBuffer((err, buffer) => {
            if (err) {
                console.error('Error generating PDF:', err);
                reject(err);
            } else {
                console.log('PDF generated successfully', buffer);
                resolve(buffer);
            }
        });
    });
    
  }
  function nongenerateRegisteredCertificate(data) {
    // Read the HTML file
    console.log("P",data.programName)
    let htmlTemplatePath;
    if( data.programName == 'Doppelstockbalken - Professional'){
     htmlTemplatePath = path.join(__dirname, '../pdfFiles/nonregpro.html');
    }
    else if(data.programName == 'Fleischhängebahn - Professional'){
        htmlTemplatePath = path.join(__dirname, '../pdfFiles/f_nonregpro.html');
    }
    else if(data.programName == 'Fleischhängebahn - Basic' || data.programName == 'Doppelstockbalken - Basic'){
        htmlTemplatePath = path.join(__dirname, '../pdfFiles/nonregbasic.html');
    }
    else if(data.programName == 'Doppelstockbalken - Professional +1'){
        htmlTemplatePath = path.join(__dirname, '../pdfFiles/nonregproplus.html');
    }
    else if(data.programName == 'Fleischhängebahn - Professional +1'){
        htmlTemplatePath = path.join(__dirname, '../pdfFiles/f_nonregproplus.html');
    }
    else if(data.programName == 'Dachser Bodennassreinigung - Company'){
        data.name = 'DACHSER SE'
        htmlTemplatePath = path.join(__dirname, '../pdfFiles/basic_600.html');
    }
    else{
        console.log("C")
        htmlTemplatePath = path.join(__dirname, '../pdfFiles/nonregbasic.html');
    }
    console.log("htmlTemplatePath",htmlTemplatePath)
    
    const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');
    //console.log(htmlTemplate)
    let time = data.createdTime
  
    // Inject values into the HTML template
    const htmlContent = htmlTemplate
      .replace('{{name}}', data.name)
      .replace('{{licenseNumber}}', data.licenseNumber)
        .replace('{{createdDate}}', data.createdDate)
        .replace('{{createdTime}}', data.createdTime)
        .replace('{{certificateId}}', data.certificateId)
        .replace('{{certificateId2}}', data.certificateId2)
        .replace('{{link}}', data.link)
        .replace('{{programName}}', data.programName)
        .replace('{{machineAddress}}', data.machineAddress).
        replace('{{machineName}}', data.machineName);
        
  
  
    // Options for PDF generation
    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0'
      },
      margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0'
      }
    };
    const childProcessOptions = {
        env: {
          OPENSSL_CONF: '/dev/null'
        }
      };
  
    // Generate PDF as a Buffer
    return new Promise((resolve, reject) => {
        pdf.create(htmlContent, { ...options, childProcessOptions }).toBuffer((err, buffer) => {
            if (err) {
                console.error('Error generating PDF:', err);
                reject(err);
            } else {
                console.log('PDF generated successfully', buffer);
                resolve(buffer);
            }
        });
    });
    
  }

  //marking messages as seen

  router.post('/readmessage', async (req, res) => {
    try {
        console.log(req.body);
        
        const { customerID, messageID } = req.body;

        // Find the customer and ensure the message exists
        const currentCustomer = await Customer.findOne({ customerID });
        if (!currentCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Find the message within the customerMessages array
        const message = currentCustomer.customerMessages.find(message => message.date === messageID);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Update the specific message in the customerMessages array
        const updateResult = await Customer.updateOne(
            { 
                customerID,
                'customerMessages.date': messageID  // Find the specific message by date
            },
            { 
                $set: { 'customerMessages.$.isRead': true }  // Update the isRead field of the matched message
            }
        );

        console.log('Update result:', updateResult);

        if (updateResult.modifiedCount > 0) {
            res.status(200).json({ message: 'Message marked as read' });
        } else {
            res.status(400).json({ message: 'No message was updated' });
        }
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//agreeonconsent

router.post('/agreeonconsent', async (req, res)=>{
    console.log(req.body)
    const businessName = req.body.messageID.split('from ')[1]
    console.log(businessName)
    const inCustomer = await Customer.findOne({customerID: req.body.customerID})
    //const message = currentCustomer.customerMessages.find(message => message.date === messageID);

    const inAgreed = inCustomer.agreedOnApis.find(consent => consent.organizationName === businessName)
    console.log("AGREED:",inAgreed)
    if(inAgreed){
        const update = await Customer.updateOne(
            { 
                customerID: req.body.customerID,
                'agreedOnApis.organizationName': businessName
            },
            { 
                $set: { 'agreedOnApis.$.isAgreed': true }
            }
        );
        console.log(update)
        if(update.modifiedCount > 0){
          
            const updateResult = await Customer.updateOne(
                { 
                    customerID: req.body.customerID,
                    'customerMessages.date': req.body.currentID  // Find the specific message by date
                },
                { 
                    $set: { 'customerMessages.$.isAgreed': true, 'customerMessages.$.agreedTime': Date.now() }  // Update the isRead field of the matched message
                }
            );
            const apiUser = await apiDB.findOne({organizationName: businessName})
            console.log(apiUser.email)
            let mailOptions = {
                from: `"API SERVICE" <${process.env.sendingEmail}>`,
                to: apiUser.email,
                subject: `Consent Agree by ${inCustomer.organizationName}!`,
                template: "consentagreed",
                context:{
                    lastName: inCustomer.firstName+" "+ inCustomer.lastName,
                    businessName: inCustomer.organizationName,
                    currentTime: new Date().toLocaleTimeString(),
                    currentDate: new Date().toLocaleDateString(),
                    customerID: inCustomer.customerID,
                    email: inCustomer.email,
                    apiUser: apiUser.organization,
                    apiuserName: apiUser.firstName + " " + apiUser.lastName,
                }
            }
            transporter.sendMail(mailOptions, (error, details) => {
                if (error) {
                    console.log(error)
                }
                else {
                    console.log("Mail Sent!")
                }
            })
            res.status(200).send('ok')
        }
    }





})


//getting certificates as owner customer

router.post('/getCertificatesasowner', async (req, res)=>{
    const findOwnerCustomer = await owners.findOne({ownerID: req.body.customerId})
    console.log(findOwnerCustomer.machines)
    if(findOwnerCustomer){
        const machines = findOwnerCustomer.machines
        let total = []
        let regCertificates = []
        let nonRegCertificates = []

        for(let i = 0; i< machines.length; i++){
            const certificates = await Certificate.find({machineID: machines[i]})
            const nonRegisterCertificates = await onSpot.find({machineID: machines[i]})
            regCertificates = regCertificates.concat(certificates)
            nonRegCertificates = nonRegCertificates.concat(nonRegisterCertificates)
        }
        total = regCertificates.concat(nonRegCertificates)
        console.log(total.length)
        res.send(total.length.toString())
    }
})

router.post('/getusersituation', async (req, res)=>{
    console.log(req.body)
    try{
        const user = await Customer.findOne({session:{$elemMatch:{token: req.body.token}}})
        console.log(user)
        if(user){
            if(user.ownerCustomer){
                res.json({userSituation:user.ownerCustomer, ownerID: user.ownerID})
            }
            else{
                res.json({userSituation: false})
            }
        }
    }
    catch(err){
        console.log(err)
        res.sendStatus(404)
    }
})
//predefiendCustomer
router.post('/verifypredefiendcustomer', async (req, res)=>{
    //console.log(req.body)
    const findCustomer = await predefiendCustomer.findOne({ predefiendCode: req.body.token })
    //console.log(findCustomer)
    //const a = await predefiendCustomer.find()
    //console.log(a)
    if(findCustomer){
        res.json({customer: findCustomer}).status(200)
    }
    else{
        res.sendStatus(404)
    }
})
router.post('/customerregistrationpredefiend', async (req, res)=>{
    try{
        console.log(req.body)
        const customer = await Customer.findOne({email: req.body.email})
        if(customer){
            res.send('E-Mail bereits verwendet. Bitte melden Sie sich an!')
        }
        else{
            const newCustomer = new Customer({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                customerID: req.body.customerID,
                organizationName: req.body.companyName,
                ownerCustomer: true,
                ownerID: req.body.ownerID,
                profilePicture: req.body.profilePicture,
                city: req.body.city,
                street: req.body.street,
                streetnumber: req.body.streetnumber,
                postcode: req.body.postcode,
                contactNumber: req.body.contactNumber,
                situation: req.body.customerSituation,
                role: "Customer",
                customerSituation: req.body.customerSituation,
                billingemail: req.body.email,
                isActive: true,
                customerPosition: req.body.customerPosition,
            })
            let saving = await newCustomer.save()
            if(saving){
                return res.send('ok')
            }
            else{
                return res.send('Etwas ist schief gelaufen, bitte versuchen Sie es erneut!')
            }
        }
    }
    catch(err){
        console.log(err)
        res.sendStatus(404)
    }
})
module.exports = router