const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('./auth');

// MODELS 
let Device = require('../models/device');
let User = require('../models/user');
let Checkin = require('../models/checkin');
let Ticket = require('../models/ticket');

// ROUTES

// SHOW ALL CHECKINS
router.get('/', auth.required, (req, res) => {
    
    const { payload: { id } } = req;

    User.findById(id, (err, user) => {
        if (err) {  return res.status(500).json({ errors: "Unknown" }); } 
        if (user.permissions != "master") {  return res.status(401).json({ errors: "Not Authorized" }); }
        
        Checkin.find({}, (err, checkins) => {
            if (err) { console.log(err) } else {
                return res.json(checkins);
            }
        }).sort({ created_on: -1 });
    });
});


// CREATE CHECKINS
router.get('/new/:device/:ticket', auth.optional, (req, res) => {

    Device.findById(req.params.device, (err, device) => {
        if (err) { console.log(err); return res.status(401).json({ errors: "Unknown" }); }
        if (device == null) { return res.status(404).json({ errors: "Device does not exist" }); }

        Ticket.findById(req.params.ticket, (err, ticket) => {
            if (err) { console.log(err); return res.status(401).json({ errors: "Unknown" }); }
            if (ticket == null) { return res.status(404).json({ errors: "Ticket does not exist" }); }
    
            let checkin = new Checkin();

            checkin.device = req.params.device;
            checkin.ticket = req.params.ticket;
            checkin.event = device.event;
            checkin.company = device.company;
            
    
            checkin.save( (err, checkin) => {
                if (err) { console.log(err); return res.status(500).json({ errors: "Unknown" }); } 

                return res.status(200).end();
            });
        });

    })
    
});


module.exports = router;