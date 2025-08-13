const mongoose = require('mongoose');


const db2URI = process.env.mongodb_url;
const db2Connection = mongoose.createConnection(db2URI, { useNewUrlParser: true, useUnifiedTopology: true });

db2Connection.on('error', console.error.bind(console, 'DB2 connection error:'));
db2Connection.once('open', () => console.log('Connected to API DB'));



module.exports = db2Connection;