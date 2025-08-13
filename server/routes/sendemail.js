const router = require('express').Router()
const nodemailer = require('nodemailer')
const Customer = require('../models/customer')
var hbs = require('nodemailer-express-handlebars');
const path = require('path');

///Prepating transporter to send emails
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

//email sending API
//This API will send customer question to us
router.post('/sendemail', async (req, res) => {
    email = 'ibrahimmunna059@gmail.com' // this email address will receive the emails
    try {
        //send email
        let mailOptions = {
            from: `"Customer questions" <${process.env.sendingEmail}>`,
            to: email,
            subject: "Verify your Email",
            //message templates
            html: `<img src="-"
                    width="169" height="60"/>
                    <br/>
                    <br/>
                   <h2>We got questions from ${req.body.customerlastname}!<h2>
                   <br/>
                   <h2>CustomerID: ${req.body.customerID}</h3>
                   <br/>
                   <h4>Subject: ${req.body.subject}</h4>
                   <br/>
                   <h4>Message: ${req.body.message}</h4> 
                   <br/>
                   <br/>
                 
                   `
        }
        //sendig email
        transporter.sendMail(mailOptions, (error, details) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log("Mail Sent!")
                res.send('Email Sent!')
            }
        })
    }
    catch (error) {
        res.status(400).send('Something went Wrong, Please try again!')
        console.log(error)
    }
})

//this api will update the profile and send email if the customer use a new email address
router.post('/updateprofile', async (req, res) => {
    console.log(req.body)
    const existCustomer = await Customer.findOne({ customerID: req.body.customerID })
    const existEmail = await Customer.find({$$nor:{
        customerID: req.body.customerID 
    }})
    const existEmails = []
    //pushing all the emails in a new variable 
    for (mail in existEmail) {
        existEmails.push(existEmail[mail].email)
    }
    //checking emails
    if (existEmails.includes(req.body.email) && existCustomer.email !== req.body.email) {
        res.send("E-Mail wird bereits verwendet! Bitte versuchen Sie eine andere.")
    }
    //updating profile
    else {
        //if the email address is chaningig then it will send an email to the user's new email address
        if (existCustomer.email !== req.body.email) {

            let mailOptions = {
                from: `"No-reply" <${process.env.sendingEmail}>`,
                to: req.body.email,
                subject: "You changed your email address!!!",
                html: `<img src="="
                     width="169" height="60"/>
                     <br/>
                     <br/>
                     <h2>Hello ${existCustomer.lastName}!<h2>
                     <br/>
                     <h4>Greeting!</h4>
                     <h3>You just changed your email address.</h3>
                     <br/>
                     <br/>
                     <h3>Cheers</h3>
                     <h3>Company<h3>
                  
                    `
            }
            transporter.sendMail(mailOptions, (error, details) => {
                if (error) {
                    console.log(error)
                }
                else {
                    console.log("Mail Sent!")
                    //res.send('Email Sent!')
                }
            })
            try {
                await existCustomer.update({firstName:req.body.firstName,lastName:req.body.lastName,email:req.body.email,city: req.body.city,postcode: req.body.postcode,street: req.body.street,streetnumber: req.body.streetnumber,contactNumber: req.body.contactNumber})
           
                return res.send('Profil aktualisiert!')
            }
            catch (error) {
                return res.send("Entschuldigung! Da ist etwas schief gelaufen.")
            }

        }
        //updating the profile if the email address is not changed
        else {
            try {
                await existCustomer.update({firstName:req.body.firstName,lastName:req.body.lastName,email:req.body.email,city: req.body.city,postcode: req.body.postcode,street: req.body.street,streetnumber: req.body.streetnumber,contactNumber: req.body.contactNumber})
           
                return res.send('Profile Updated!')
            }
            catch (error) {
                return res.send("Sorry! Something went wrong.")
            }

        }
    }



})

//certificate support email
router.post('/certificatesupport', async (req, res) => {
    console.log(req.body)
    let receiver = process.env.receivingingEmail
    let mailOptions = {
        from: `"Certificate Support | ${req.body.name}" <${process.env.sendingEmail}>`,
        to: receiver,
        subject: "Certificate Support",
        html: `<img src=""
        width="169" height="60"/>
        <br/>
        <br/>
       <h2>Certificate support from ${req.body.name}!<h2>
       <br/>
       <br/>
       <h4>Email Address: ${req.body.email}</h4>
       <br/>
       <h4>Phone: ${req.body.phone}</h4>
       <br/>
       <h4>Message: ${req.body.message}</h4> 
       <br/>
       <br/>
       `
    }
    transporter.sendMail(mailOptions, (error, details) => {
        if (error) {
            console.log(error)
            res.status(400).send('Something went wrong, Please try again!')
        }
        else {
            console.log("Mail Sent!")
            res.send('Email Sent!').status(200)
        }
    })
})



module.exports = router