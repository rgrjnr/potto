const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

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

// SESSION MIDDLEWARE
app.use(session({
    secret: 'potto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 60000 }
}));

// ROUTES
app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport')

let users   = require('./routes/users');
let events  = require('./routes/events');
app.use('/events', events);
app.use('/users', users);

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
    console.log('Server started on port 3000');
})