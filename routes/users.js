const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');

const { check, validationResult } = require('express-validator');

// MODELS 
let User = require('../models/user');

// ROUTES
router.post('/authenticate', [
    check('user.email').isEmail(),
    check('user.password').isLength({ min: 4 }),
    auth.optional,
], (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
          return next(err);
        }
    
        if(passportUser) {
          const user = passportUser;
          user.token = passportUser.generateJWT();
    
          return res.json({ user: user.toAuthJSON() });
        }
    
        return res.status(400).info;
        
      })(req, res, next);

});

router.post('/register', [
    check('user.email').isEmail(),
    check('user.password').isLength({ min: 4 })
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { body: { user } } = req;

    console.log(user);

    const finalUser = new User(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
        .then(() => {
            res.json({ user: finalUser.toAuthJSON() });
        });


});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
    try {
        const { payload: { id } } = req;
  
    return Users.findById(id)
      .then((user) => {
        if(!user) {
          return res.sendStatus(400);
        }
  
        return res.json({ user: user.toAuthJSON() });
      });

    } catch(err) {
        console.log("err");
    }
  });
  

module.exports = router;