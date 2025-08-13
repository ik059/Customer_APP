const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
   images:{
    type:[String]
   }
})

module.exports = mongoose.model('image', imageSchema)