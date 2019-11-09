const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// MODELS 
let Event = require('../models/event');

// ROUTES
router.get('/', (req, res) => {
    Event.find({}, (err, events) => {
        if (err) { console.log(err) } else {
            res.json(events);
        }
    });
});

router.post('/', [
    check('title').isLength({ min: 5 })
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let event = new Event();
    event.title = req.body.title;

    console.log('A')

    event.save((err) => {
        if (err) { console.log(err) } else {
            res.json({ status: 'success' });

            console.log('B')
        }
    });

});


module.exports = router;