const express = require('express');
const passport = require('passport');
const request = require('request');
const Account = require('../models/account');

const router = express.Router();
const auth = require('./auth');

/* GET home page. */
//router.get('/', auth.ensureAuthenticated, (req, res, next) => {
router.get('/', (req, res, next) => {
  res.render('index', { user: req.user });
});

router.get('/register', (req, res) => {
  res.render('register', {});
});

router.post('/register', (req, res) => {
  console.log('Starting route POST /register');
  console.log(req.body.username);
  console.log(req.body.password);
  Account.register(new Account({ username: req.body.username }),
    req.body.password,
    (err, account) => {
      if (err) {
        console.log('Error - failed to register');
        return res.render('register', { error: err.message });
      }
      console.log('Registered');

      passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect('/');
        });
      });
    });
});

router.get('/login', (req, res) => {
  res.render('login', { user: req.user, layout: 'login' });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/ping', (req, res) => {
  res.status(200).send('pong!');
});


router.get('/test', (req, res) => {
  console.log(`url: ${req.url}`);
  res.send('Hello World');
});

/* handle request for current weather from Open Weather API */
router.post('/current', (req, res) => {
  console.log(`url: ${req.url}`);
  console.log(`body: ${req.body}`);
  const newURL = `${process.env.CURRENT_WEATHER_URL}?q=${req.body.q}&appid=${process.env.API_KEY}&units=metric`;
  console.log(`new URL is: ${newURL}`);
  request(newURL, (error, response, body) => {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body);
    res.status(response.statusCode);
    res.json(body);
  });
});


module.exports = router;
