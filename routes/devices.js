const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('./auth');

// MODELS 
let Device = require('../models/device');
let User = require('../models/user');

// ROUTES

// SHOW ALL DEVICES
router.get('/', auth.required, (req, res) => {
    
    const { payload: { id } } = req;

    User.findById(id, (err, user) => {
        if (err) {  return res.status(500).json({ errors: "Unknown" }); } 
        if (user.permissions != "master") {  return res.status(401).json({ errors: "Not Authorized" }); }
        
        Device.find({}, (err, devices) => {
            if (err) { console.log(err) } else {
                res.json(devices);
            }
        });
    });
});


// CREATE DEVICE
router.post('/', auth.required, (req, res) => {

    const { payload: { id } } = req;

    User.findById(id, (err, user) => {
        if (err) {  return res.status(500).json({ errors: "Unknown" }); } 
        if (user.permissions != "master") {  return res.status(401).json({ errors: "Not Authorized" }); }
        
        const device = new Device();

        device.author = id;
        device.permissions = [{ user: id, role: 'owner' }];

        device.save((err) => {
            if (err) { console.log(err) } else {
                res.json({ device });
            }
        });

    });


});

// EDIT DEVICE
router.put('/:device', auth.required, (req, res) => {

    const { payload: { id } } = req;
    const { body: { device } } = req;

    const info = device;

    Device.findOne({ 'permissions.user': id, '_id': req.params.device}, (err, device) => {

        console.log(device);

        if (err) {  return res.status(500).json({ errors: "Unknown" }); } 
        if (device == undefined || device.length == 0) {  return res.status(401).json({ errors: "Not Authorized" }); }
        if ( !info.event && !info.company && !info.active) { return res.status(401).json({ errors: "Not Authorized" }); }

        device.event = info.event;
        device.company = info.company;

        if ( device.event != undefined && device.company != undefined ) { device.active = true } else { device.active = false }
        if (info.active == false) { device.event = null; device.company = null; device.active = false; }

        device.save((err) => {
            if (err) { console.log(err) } else {
                res.json({ device });
            }
        });

    });

});

module.exports = router;