const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('./auth');

// MODELS 
let Event = require('../models/event');
let Invite = require('../models/invite');
let Ticket = require('../models/ticket');

// ROUTES

// SHOW ALL TICKETS
router.get('/', auth.optional, (req, res) => {

    const { payload: { id } } = req;

    Ticket.find({ author: id }, (err, tickets) => {
        if (err) { console.log(err); return res.status(500).json({ errors: "Unknown" }); }

        return res.json(tickets);
    }).sort({ created_on: -1 });
});

// CREATE NEW TICKET
router.post('/', [
    auth.required,
    check('ticket.client.fullname').not().isEmpty(),
    check('ticket.product').not().isEmpty(),
    check('ticket.client.email').isEmail(),

], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { body: { ticket } } = req;
    const { payload: { id } } = req;

    Event.findOne({ 'products._id': ticket.product }, (err, event) => {
        if (err) { console.log(err); return res.status(401).json({ errors: "Not Authorized" }); }
        if (event == null) { return res.status(404).json({ errors: "Product Not Found" }); }

        // Puxa o Produto
        //const product = event.products.find(product => product._id == ticket.product);
       

        var product = event.products.id( ticket.product );

        // Verifica se ele está disponível para venda
        if (product.quantity > 0) {

            const newTicket = new Ticket(ticket);

            newTicket.author = id;
            newTicket.price = product.price;
            newTicket.curency = product.currency;
            newTicket.info = {
                name: product.name,
                description: product.description,
                date: product.date,
                event: {
                    title: event.title,
                    id: event._id,
                }
            };

            // CRIAR TICKET
            newTicket.save((err) => {
                if (err) { console.log(err) } else {

                    //CRIOU TICKET - PRECISA EDITAR O PRODUCT
                    product.quantity--;
                    product.sold++;

                    event.save((err) => {
                        if (err) { console.log(err) } else {
                            console.log(event);
                            res.json(newTicket);
                        }
                    });
                }
            });
        } else {
            return res.status(401).json({ errors: "Ticket Not Avaiable" });
        }


    })

});


module.exports = router;