const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const engines = require('consolidate');


// DATABASE INIT
mongoose.connect('mongodb://localhost/potto');
mongoose.set('debug', true);
let db = mongoose.connection;

db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', (err) => console.log(err));

// APP INIT
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('hbs', engines.handlebars)
app.set( 'views', path.join(__dirname, 'views') )
app.set('view engine', 'hbs')



// SESSION MIDDLEWARE
app.use(session({
    secret: 'potto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 60000 }
}));

// ROUTES
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
 
  next();
});


require('./config/passport');

let users   = require('./routes/users');
let events  = require('./routes/events');
let invites  = require('./routes/invites');
let companies  = require('./routes/companies');
let devices  = require('./routes/devices');
let checkins  = require('./routes/checkins');
let tickets  = require('./routes/tickets');
app.use('/api/tickets', tickets);
app.use('/api/checkins', checkins);
app.use('/api/devices', devices);
app.use('/api/companies', companies);
app.use('/api/events', events);
app.use('/api/invites', invites);
app.use('/api/users', users);

let routes  = require('./routes');
app.use('/', routes);

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
}

app.listen(3000, () => {
    console.log('Server started on port http://localhost:3000');
})