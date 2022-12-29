const express = require('express')
const compression = require('compression')
const mongoose = require('mongoose')
const session = require('express-session')
const dotenv = require('dotenv')
const Cors = require('cors')
const morgan = require('morgan')
const app = express()
const authRoute = require('./routes/auth')
const signalsRoute = require('./routes/signals')
const sseRoute = require('./routes/sse.routes')
// const { Db } = require('mongodb')
const bodyParser = require('body-parser');
const helmet = require('helmet');

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))
const port = process.env.PORT || 3006



const corsOption = {
  origin: '*',
  optionsSuccessStatus: 200
}

// middleware
app.use(Cors(corsOption))
app.use(express.json())
app.use(compression())

// Use the express-session middleware
// app.use(session({
//   secret: process.env.PASS_ENC_SECT,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24 * 30,
//    }
// })); 0610785211

// app.use(cors({ origin:true, credentials:true }));

//     // prevent CORS problems
//     app.use(function (req, res, next) {
//         res.header('Access-Control-Allow-Origin', '*');
//         res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
//         res.header('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
//         res.header('Access-Control-Allow-Credentials', true);
//         next();
//     })


// adding morgan to log HTTP requests
app.use(morgan('combined'));
// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
app.use('/auth', authRoute);
app.use('/signals', signalsRoute);
app.use("/", sseRoute);


// root route
app.get('/', (req,res) => res.status(200).json('Welcome to my api home'))

// listener
app.listen(port, () => {
  console.log('Backend server is running @ localhost: ' +port)
})