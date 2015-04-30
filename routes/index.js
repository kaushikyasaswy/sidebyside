var express = require('express');
var router = express.Router();
var qr = require('qr-image');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('startPage.ejs', {message: 'welcome'});
});

router.get('/home', function(req, res, next) {
  res.render('startPage.ejs', {message: 'welcome'});
});

router.get('/welcome', function(req, res, next) {
  res.render('welcomePage.ejs', {message: 'welcome'});
});

router.get('/registerpage',function(req, res, next) {
  res.render('registerPage.ejs', {message: 'regsister'});
});

router.get('/locationpage',function(req, res, next) {
  res.render('locationPage.ejs');
});

router.get('/showplan',function(req, res, next) {
  res.render('planNamePage.ejs', {name: req.session.name});
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.render('welcomePage.ejs', {message: 'logged out'});	
});

router.get('/qr/:code',function(req, res, next) {
   console.log(req.params.code);
   var code = qr.image("Your verification code is "+req.params.code, { type: 'svg' });
   res.type('svg');
   code.pipe(res);
});

module.exports = router;