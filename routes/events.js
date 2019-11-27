const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('./auth');

// MODELS 
let Event = require('../models/event');
let Company = require('../models/company');

// ROUTES

//GET ALL EVENTS
router.get('/', auth.required, (req, res) => {

    const { payload: { id } } = req;

    Event.find({ 'permissions.user': id }, (err, events) => {
        if (err) { console.log(err) } else {
            res.json(events);
        }
    }).sort({ created_on: -1 });

});

// GET SINGLE EVENT
router.get('/:slug', auth.optional, (req, res) => {

    let slug = req.params.slug;

    Event.findOne({ slug: slug }, async (err, event) => {
        //Checa por erros
        if (err) { console.log(err); return res.status(404).json({ errors: "Not Found" }); }
        if (!event) { return res.status(404).json({ errors: "Not Found" }); }
        Company.find({event: event._id}, (err, companies) => {
            console.log(companies);
            event.companies = companies;
            return res.json({event, companies});
        });

    });
});


// CREATE EVENT
router.post('/', [
    auth.required,
    check('event.title').isLength({ min: 5 }),
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let { body: { event } } = req;
    let { payload: { id } } = req;

    console.log(id);

    const newEvent = new Event(event);

    newEvent.author = id;
    newEvent.permissions = [{ user: id, role: 'owner' }];

    newEvent.save((err) => {
        if (err) { console.log(err) } else {
            res.json(newEvent);
        }
    });

});

//CREATE PRODUCT
router.post('/product', [
    auth.required,
    check('product.name').not().isEmpty(),
    check('product.event').not().isEmpty(),
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { body: { product } } = req;
    const { payload: { id } } = req;
    product.author = id;

    Event.findOne( {'_id': product.event, 'permissions.user': id } , (err, event) => {
        //Checa por erros
        if (err) { console.log(err);  return res.status(401).json({ errors: "Not Authorized" }); }
        
        //Verifica se o invite existe
        if (event == undefined) { return res.status(401).json({ errors: "Not Authorized" }); }

        // create a comment
        event.products.push( product );

        event.save(function (err) {
            if (err) { console.log(err) } else {
                res.json(product);
            }
        });

    });

});


//GET PRODUCT
router.get('/product/:id', [
    auth.optional
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    Event.findOne( {'products._id': req.params.id } , (err, event) => {
        //Checa por erros
        if (err) { console.log(err);  return res.status(401).json({ errors: "Not Authorized" }); }
        
        //Verifica se o invite existe
        if (event == undefined) { return res.status(401).json({ errors: "Not Authorized" }); }

        const product = event.products.find(product => product._id == req.params.id);

        return res.json(product);
    }).sort({ created_on: -1 });

});

// MODELS 
let Invite = require('../models/invite');

// ROUTES

// SHOW ALL INVITES
router.get('/:id/invites', auth.required, (req, res) => {
    
    
    Invite.find({ 'event' : req.params.id }, (err, invites) => {
        if (err) { console.log(err) } else {
            res.json(invites);
        }
    }).sort({ created_on: -1 });
});


module.exports = router;