const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('./auth');

// MODELS 
let Invite = require('../models/invite');

// ROUTES

// SHOW ALL INVITES
router.get('/', auth.required, (req, res) => {
    
    const { payload: { email } } = req;

    Invite.find({ 'invited_user': email }, (err, invites) => {
        if (err) { console.log(err) } else {
            res.json(invites);
        }
    });
});

// CREATE NEW INVITE
router.post('/', [
    auth.required,
    check('invite.invited_user').isEmail(),
    check('invite.event').not().isEmpty(),
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { body: { invite } } = req;
    const { payload: { id } } = req;

    console.log(id);

    const newInvite = new Invite(invite);

    newInvite.author = id;

    newInvite.save((err) => {
        if (err) { console.log(err) } else {
            res.json({ newInvite });
        }
    });

});


module.exports = router;