const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('./auth');

// MODELS 
let Company = require('../models/company');
let Invite = require('../models/invite');

// ROUTES

// SHOW ALL INVITES
router.get('/', auth.optional, (req, res) => {
    
    const { payload: { id } } = req;

    Company.find({ 'permissions.user': id }, (err, companies) => {
        if (err) { console.log(err) } else {
            res.json(companies);
        }
    });
});

// CREATE NEW INVITE
router.post('/', [
    auth.required,
    check('company.name').not().isEmpty(),
    check('company.invite').not().isEmpty(),
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { body: { company } } = req;
    const { payload: { id, email } } = req;

    Invite.findById(company.invite, (err, invite) => {

        //Checa por erros
        if (err) { console.log(err);  return res.status(401).json({ errors: "Not Authorized" }); }
        
        //Verifica se o invite existe
        if (invite == undefined || invite.invited_user != email) { return res.status(401).json({ errors: "Not Authorized" }); }
    
        //Se existir, verifica se já foi usado
        if (invite.accepted) {  return res.status(401).json({ errors: "Invite already used" }); }

        const newCompany = new Company(company);

        newCompany.author = id;
        newCompany.event = invite.event;
        newCompany.permissions = [{ user: id, role: 'owner'}];

        newCompany.save((err) => {
            if (err) { console.log(err) } else {
                invite.accepted = true;
                invite.save();
                res.json({ newCompany });
            }
        });

        
    

    })


});


module.exports = router;