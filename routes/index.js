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

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.render('welcomePage.ejs', {message: 'logged out'});	
});

router.get('/sample',function(req, res, next) {
   var code = qr.image("https://www.sidebyside-cis450.herokuapp.com", { type: 'svg' });
   res.type('svg');
   code.pipe(res);
});

module.exports = router;