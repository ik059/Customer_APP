require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const serveStatic = require('serve-static')
const path = require('path')
const externalApi = require('./server/routes/externalApi')

const api = require('./server/routes/routes')
const appointmentApi = require('./server/routes/appointmentapi')
const emailApi = require('./server/routes/sendemail')




const app = express()

//for localhost the port will be 4000 and for live server it will take the free enviornment port
const port = process.env.PORT || 8000

app.use(cors()) //CORS origin policy
//defining size for changing profile pictures
app.use(express.json({limit:'5000kb'}))
app.use(express.urlencoded({limit:'5000kb'}))
app.use(bodyParser.json({limit:'5000kb'}))

app.use(api) //api connections
app.use(appointmentApi) //apoointment api connection
app.use(emailApi) //sending question
app.use('/api',externalApi) //external api connection

//joining the front end part to the backend
app.use('/', serveStatic(path.join(__dirname,'/dist')))

//serving the front end as a backend/node app
app.get('/./*',function (req, res){
res.sendFile(path.join(__dirname,'/dist/index.html'))
})
//mongodb connection
mongoose.connect(process.env.mongodb_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) console.log(err)
  else console.log("mongdb is connected");
})

//server connection
app.listen(port, () => {
  console.log('Connected @', port)
})