const express = require('express');
const router = express.Router();

router.get('/', (req, res) => { res.render('index') });
router.get('/signin', (req, res) => { res.render('signin') });
router.get('/signup', (req, res) => { res.render('signup') });


router.get('/account/welcome', (req, res) => { res.render('welcome') });
router.get('/account/', (req, res) => { res.render('welcome') });
router.get('/account/events', (req, res) => { res.render('events') });
router.get('/event/:slug', (req, res) => { res.render('single_event', { slug: req.params.slug }) });
router.get('/account/events/create', (req, res) => { res.render('create_event') });
router.get('/account/events/:id/tickets', (req, res) => { res.render('event_tickets') });
router.get('/checkout/product/:id', (req, res) => { res.render('checkout') });
router.get('/account/tickets', (req, res) => { res.render('tickets') });
router.get('/account/devices', (req, res) => { res.render('devices') });
router.get('/account/checkins', (req, res) => { res.render('checkins') });
router.get('/account/invites', (req, res) => { res.render('invites') });
module.exports = router;