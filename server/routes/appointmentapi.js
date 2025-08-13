const router = require('express').Router()
var hbs = require('nodemailer-express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer')

const Appointment1 = require('../models/appointment')//Schema for first appointment shift
const Appointment2 = require('../models/appointment2')//Schema for second appointment shift
const Appointment3 = require('../models/appointment3')//Schema for third appointment shift
const Appointment4 = require('../models/appointment4')//Schema for fourth appointment shift
const Machine = require('../models/machine')//Schema for machine
const Customer = require('../models/customer');//Schema for customer
const { only } = require('@hapi/joi/lib/base');



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
    viewPath: path.resolve( __dirname,'../emails'),
    extName: ".handlebars"
}

transporter.use('compile',hbs(handlebarOptions))


///This API is to book an new appointment in the first shift
router.post('/appointment', async (req, res) => {
    const splitedDate = req.body.date.split('T')
    const onlyDate = splitedDate[0]
    const bookedTimestamp = new Date(Date.parse(onlyDate))
    let year = bookedTimestamp.getFullYear()
    let month = bookedTimestamp.getMonth() +1
    let date = bookedTimestamp.getDate() + 1
    let emailAppointmentMonth = bookedTimestamp.getMonth()+1
    let emialAppointmentDay = bookedTimestamp.getDate()
    if(emailAppointmentMonth < 10){
        emailAppointmentMonth = "0"+month
    }
    if(emialAppointmentDay < 10){
        emialAppointmentDay = "0"+date
    }
    let emailAppointmentDate = emialAppointmentDay+"."+emailAppointmentMonth+"."+year.toString().slice(-2)
    const deleteDate = year +"-"+month+"-"+date
    
     //Taking only the date getting from request
    //searching with date and machineID
    const existDate = await Appointment1.findOne({ $and: [{ date: onlyDate }, { machineID: req.body.machineID }] })
    //searching the customer in the customer collection
    const existCustomer = await Customer.findOne({ customerID: req.body.customerID })
    const existMachine = await Machine.findOne({machineID: req.body.machineID})
    

    //appointment details for first shift
    const appointment = new Appointment1({
        date: onlyDate,
        machineID: req.body.machineID,
        time: req.body.time,
        customerID: req.body.customerID,
        program: req.body.program
    })
    // if(req.body.time == 0 || req.body.date == 0 || req.body.machineID == 0 || req.body.shift == 0 || req.body.licenseNumber == 0){
    //     res.send("All fields are required!")
    // }
   
    //console.log(appointment)
    //if the date is not in the collection the it will save a new date with the appointment details
    //and push the appointment details to that customer appointment array
    // else{
    if (!existDate) {
        try {
            
            await existCustomer.update({
                $push: {
                    appointments: {
                        time: req.body.time,
                        date: onlyDate,
                        machineID: req.body.machineID,
                        shift: req.body.shift,
                        licenseNumber: req.body.licenseNumber,
                        createdTimestamp: Date.parse(onlyDate),
                        machineAdress: existMachine.currentAddress[0].street+ " "+ existMachine.currentAddress[0].streetNumber+"," + existMachine.currentAddress[0].city+","+existMachine.currentAddress[0].postcode,
                        deleteTimeStamp: Date.parse(deleteDate),
                        program: req.body.program
                    }
                }
            })
              let mailOptions = {
            from: ` "Termin" <${process.env.sendingEmail}>`,
            to: existCustomer.email,
            subject: "Ein neuer Termin gebucht!",
            template: "bookedAppointment",
            context:{
                lastName:existCustomer.firstName +" "+ existCustomer.lastName,
                date: emailAppointmentDate,
                machine:req.body.machineID,
                time:req.body.time,
                street: existMachine.currentAddress[0].street,
                streetNumber: existMachine.currentAddress[0].streetNumber,
                city: existMachine.currentAddress[0].city,
                postCode:existMachine.currentAddress[0].postcode,
                cancelLink: `https://${process.env.VUE_APP_HOST}/#/bookedappointment`,
                program: req.body.program
            }
        }
        console.log(mailOptions)
        transporter.sendMail(mailOptions, (error, details) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log("Mail Sent!")
            }
        })
        //informing fleix and Patrick
        let mailOptions2 = {
            from: ` "Appointment Booked " <${process.env.sendingEmail}>`,
            to: 'ibrahimmunna059@gmail.com',
            subject: `New Appointment booked by ${existCustomer.lastName}`,
            template: "inform",
            context:{
                lastName: existCustomer.lastName,
                date: emailAppointmentDate,
                machine:req.body.machineID,
                time:req.body.time,
                street: existMachine.currentAddress[0].street,
                streetNumber: existMachine.currentAddress[0].streetNumber,
                city: existMachine.currentAddress[0].city,
                postCode:existMachine.currentAddress[0].postcode,
                email:existCustomer.email,
                organization:existCustomer.organizationName,
                program: req.body.program
            }
        }
        transporter.sendMail(mailOptions2, (error, details) => {
            if (error) {
                console.log("ERROR:",error)
            }
            else {
                console.log("Mail Informed!")
            }
        })
        const newAppointment = await appointment.save()
            res.sendStatus(200)
        }
        catch (error) {
            console.log(error)
        }

    }
    //if the date is in the collecting then it will psuh the appointment details in the appointment and customer array 
    else {
        console.log(req.body.licenseNumber)
        await existCustomer.update({
            $push: {
                appointments: {
                    time: req.body.time,
                        date: onlyDate,
                        machineID: req.body.machineID,
                        shift: req.body.shift,
                        licenseNumber: req.body.licenseNumber,
                        createdTimestamp: Date.parse(onlyDate),
                        machineAdress: existMachine.currentAddress[0].street+","+existMachine.currentAddress[0].city+","+existMachine.currentAddress[0].postcode,
                        deleteTimeStamp: Date.parse(deleteDate),
                        program: req.body.program
                }
            }
            
        })

        await existDate.update({ $push: { time: req.body.time } })
        await existDate.update({ $push: { customerID: req.body.customerID } })
        await existDate.update({ $push: { program: req.body.program } })
   
        

        let mailOptions = {
            from: `"Termin | KATMA CleanControl" <${process.env.sendingEmail}`,
            to: existCustomer.email,
            subject: "Ein neuer Termin gebucht!",
            template: "bookedAppointment",
            context:{
                lastName: existCustomer.lastName,
                date: emailAppointmentDate,
                machine:req.body.machineID,
                time:req.body.time,
                street: existMachine.currentAddress[0].street,
                streetNumber: existMachine.currentAddress[0].streetNumber,
                city: existMachine.currentAddress[0].city,
                postCode:existMachine.currentAddress[0].postcode,
                cancelLink: `https://${process.env.VUE_APP_HOST}/#/bookedappointment`,
                program: req.body.program
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
         //informing fleix and Patrick
         let mailOptions2 = {
            from: `"Appointment Booked | KATMA CleanControl" <${process.env.sendingEmail}>`,
            to: 'ibrahimmunna059@gmail.com',
            subject: `New Appointment booked by ${existCustomer.lastName}`,
            template: "inform",
            context:{
                lastName: existCustomer.lastName,
                date: emailAppointmentDate,
                machine:req.body.machineID,
                time:req.body.time,
                street: existMachine.currentAddress[0].street,
                streetNumber: existMachine.currentAddress[0].streetNumber,
                city: existMachine.currentAddress[0].city,
                postCode:existMachine.currentAddress[0].postcode,
                email:existCustomer.email,
                organization:existCustomer.organizationName,
                program: req.body.program
            }
        }

        transporter.sendMail(mailOptions2, (error, details) => {
            if (error) {
                console.log("ERROR:",error)
            }
            else {
                console.log("Mail Informed!")
            }
        })
        return res.sendStatus(200)

    }
//}
})


///To send the exist date's values in the first shift 
router.post('/appointmentbookedslots1', async (req, res) => {
    console.log(req.body)
    const splitedDate = req.body.date.split('T')
    const onlyDate = splitedDate[0]
    //checking the date and send the appointment deatils of that date and machine
    const existDate = await Appointment1.find({ $and: [{ date: onlyDate }, { machineID: req.body.machineID }] })
    if (existDate) {
        console.log(existDate)
        res.json(existDate)
    }

})


///To sned the machines in the front end for displaying and choosing in the appointment
router.get('/machinelist', async (req, res) => {
    let machines = await Machine.find()
    res.send(machines)
})
///This api will be updated when we are done with the location and mapping
///For now it's jus a simple API with greater than and less than value
router.post('/postcodesearch', async (req, res) => {
    console.log(req.body.postcode)
    const existPostcode = await Machine.find({ 'currentAddress.postcode': { $gte: req.body.postcode } }).limit(2)
    if (existPostcode) {
        console.log(existPostcode)
        res.send(existPostcode)
    }
    else {
        console.log('Not Ok')
    }
})
//This API will delete an appointment from the customer database then it will go to the
///Appointment database by chossing the shift and machine. Then it will delete the selected appointment
///and make the appointment as a free slot
///This will work with the four shifts at the same time

router.post('/deleteappointment', async (req, res, next) => {
    const existCustomer = await Customer.findOne({ customerID: req.body.customerID })
    //console.log(existCustomer)
    console.log(req.body)
    //deleting the appointment from the customer collection
    if(existCustomer){
        await existCustomer.update({ $pull: { appointments: { $and: [{ date: req.body.all.date }, { time: req.body.all.time }] } } })

        try{
            const dateString = req.body.all.date.split('T')[0]
            const time = req.body.all.time
    
            //checking the date with time 
            const existDate = await Appointment1.findOne({ date: dateString, time: time })
    
            const timeArray = existDate.time
    
            //getting the index of time
            const timeindex = timeArray.indexOf(time)
    
            const newTimeaArray = await existDate.time
            newTimeaArray.splice(timeindex, 1)//deleting the time slot that the customer want to delete
            //console.log(newTimeaArray)
            //setting new array with daleted time slot
            await existDate.update({ $set: { time: newTimeaArray } })
    
            const newCustomerArray = await existDate.customerID
            //setting new array with daleted time customerID
            newCustomerArray.splice(timeindex, 1)
            await existDate.update({ $set: { customerID: newCustomerArray } })

            const newProgramArray = await existDate.program
            //setting new array with daleted time customerID
            newProgramArray.splice(timeindex, 1)
            await existDate.update({ $set: { program: newProgramArray } })
    
             return res.sendStatus(200)
        }
        catch(error){
            console.log(error)
            next()
        }

    
}

})

router.post('/accendingappointments', async(req, res)=>{
    const existCustomer = await Customer.findOne({customerID: req.body.customerId})
    // console.log(existCustomer)
    if(existCustomer){
    const appointmentArray = existCustomer.appointments
    const sortedArray= appointmentArray.sort((checkOne, checkTwo) => checkOne.createdTimestamp - checkTwo.createdTimestamp);
    res.send(sortedArray)
    }
})
router.post('/decendingappointments', async(req, res)=>{
    const existCustomer = await Customer.findOne({customerID: req.body.customerId}).sort({'appointments.createdTimestamp':1})
    const appointmentArray = existCustomer.appointments
    const sortedArray= appointmentArray.sort((checkOne, checkTwo) => checkTwo.createdTimestamp - checkOne.createdTimestamp);
   
    res.send(sortedArray)
})

router.post('/updateappointments', async (req, res)=>{
    
    let currentdate = Date.now()
    const existCustomer = await Customer.findOneAndUpdate(
        {customerID: req.body.customerId},{
        $pull:{
            appointments:{deleteTimeStamp:{$lt:currentdate}}
        }})
        if(existCustomer){
            res.sendStatus(200)
        }

})

router.post('/searchappointments', async (req, res)=>{
    const existCustomer = await Customer.findOne({customerID: req.body.customerId})
    console.log(existCustomer)
    const appointments = existCustomer.appointments
    const searchedAppointments = []
    for(let i=0; i<appointments.length;i++){
        if(appointments[i].licenseNumber == req.body.license){
            searchedAppointments.push(appointments[i])

    }
    }
    res.send(searchedAppointments)

})

router.post('/searchbydate', async (req, res)=>{
    const existCustomer = await Customer.findOne({customerID: req.body.customerId})
    
    const appointments = existCustomer.appointments
    const searchedAppointments = []
    for(let i=0; i<appointments.length;i++){
        if(appointments[i].date == req.body.date){
            searchedAppointments.push(appointments[i])

    }
    }
    console.log(req.body)
    console.log(appointments)
    console.log(searchedAppointments)
    res.send(searchedAppointments)

})
router.post('/appointmentvalidations', (req, res)=>{
    if(req.body.time == 0 || req.body.date == 0 || req.body.machineID == 0 || req.body.licenseNumber == 0){
            res.send("All fields are required!")
        }
    else{
        res.send('ok')
    }
})
module.exports = router