var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var session = require('client-sessions');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./configuration/config');

var routes = require('./routes/index');
var authentication = require('./routes/authentication');
var register = require('./routes/register');
var verification = require('./routes/mobileVerification');
var homepage = require('./routes/homePage');
var pricerange = require('./routes/priceRange');
var ambience = require('./routes/ambience');
var goodfor = require('./routes/goodfor');
var wifi = require('./routes/wifi');
var alcohol = require('./routes/alcohol');
var delivery = require('./routes/delivery');
var parking = require('./routes/parking');
var categories = require('./routes/categories');
var storecategories = require('./routes/storecategories');
var saveplan = require('./routes/saveplan');

var app = express();

// Passport session setup
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
// Use the FacebookStrategy within Passport.
passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret: config.facebook_api_secret,
    callbackURL: config.callback_url,
    profileFields: ['id', 'displayName', 'emails']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  cookieName: 'session',
  secret: 'startmeup',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

var authenticate = function (req, res, next) {
  var isAuthenticated = true;
  if (req.session.name == undefined) {
    isAuthenticated = false;
  }
  if (isAuthenticated) {
    next();
  }
  else {
    res.redirect('/');
  }
}

var yelp = require("yelp").createClient({
  consumer_key: "wMfCFcqTj2FLaybsGPzytQ", 
  consumer_secret: "7U5KhSvKp0evucyb5-ltXtwEW68",
  token: "Hu_4wJgfcjPrhrObMvqYyddAlQkJ-yD2",
  token_secret: "t_S08LdIEw5v6-Yw-dJXQiZXUh4"
});

yelp.search({sort: "2", limit: "2", location: "Philadelphia", category_filter: "isps"}, function(error, data) {
  //console.log(data.businesses);
});


app.use('/', routes);
app.post('/authentication', authentication.authenticate);
app.post('/register', register.register);
app.get('/mobileVerification', authenticate, verification.verify);
app.get('/homepage', authenticate, homepage.home);
app.get('/saveplan', authenticate, saveplan.save);
app.get('/pricerange', authenticate, pricerange.show);
app.get('/savepricerange', authenticate, pricerange.save);
app.get('/ambience', authenticate, ambience.show);
app.get('/saveambience', authenticate, ambience.save);
app.get('/goodfor', authenticate, goodfor.show);
app.get('/wifi', authenticate, wifi.show);
app.get('/alcohol', authenticate, alcohol.show);
app.get('/delivery', authenticate, delivery.show);
app.get('/parking', authenticate, parking.show);
app.post('/pricerange', pricerange.save);
app.post('/ambience', ambience.save);
app.post('/goodfor', goodfor.save);
app.post('/wifi', wifi.save);
app.post('/alcohol', alcohol.save);
app.post('/delivery', delivery.save);
app.post('/parking', parking.save);
app.get('/showcategories', authenticate, categories.show);
app.get('/storecategories', authenticate, storecategories.store);

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: 'error' }), function(req, res) {
    req.session.name = req.user.displayName;
    req.session.email = req.user.id + '@fb.com';
    res.redirect('/homepage');
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;