const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const dotenv = require('dotenv')
const Cors = require('cors')
const morgan = require('morgan')
const app = express()
const authRoute = require('./routes/auth')
const signalsRoute = require('./routes/signals')
// const sseRoute = require('./routes/sse.routes')
// const { Db } = require('mongodb')
const bodyParser = require('body-parser');
const helmet = require('helmet');

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))
const port = process.env.PORT || 3002



const corsOption = {
  origin: '*',
  optionsSuccessStatus: 200
}

// middleware
app.use(Cors(corsOption))
app.use(express.json())
// Use the express-session middleware
app.use(session({
  secret: 'THisisMzzNAY7sSWcR8Hn6theSecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 86400000)
  }
}));

// adding morgan to log HTTP requests
app.use(morgan('combined'));
// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
app.use('/auth', authRoute);
app.use('/signals', signalsRoute);
// app.use(sseRoute);


// root route
app.get('/', (req,res) => res.status(200).json('Welcome to my api home'))

// listener
app.listen(port, () => {
  console.log('Backend server is running @ localhost: ' +port)
})