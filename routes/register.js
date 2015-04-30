var mysql = require('mysql');
var twilio = require('twilio');
var session = require('client-sessions');
var config = require('./../configuration/config');
var nodemailer = require("nodemailer");

//Connection data
var connection_data = {
host     : config.db_host,
user     : config.db_user,
password : config.db_password,
database : config.db_database
};

//Function to authenticate the username and password provided by the user
function register(req, res, email, firstname, lastname, password, phone) {
	var smtpTransport = nodemailer.createTransport("SMTP",{
   		service: "Gmail",
   		auth: {
       		user: config.gmail_uname,
       		pass: config.gmail_pwd
   		}
	});
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[Register.js] : Error connecting to database : ' + err.stack);
			res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		connection.query("select * from Customers where email='" + email + "'", function(err, rows, fields) {
			if (!err) {
				if (rows.length == 0) {
					var code = random(10000,100000);
					send_sms(code, phone);
					smtpTransport.sendMail({
					   from: "Side by Side",
					   to: email,
					   subject: "Verification for your account",
					   html: "<h1>Howdy!\n\nThank you for choosing SidebySide</h1>. Please enter the following verification code to verify your identity.\n<b>Your verification code is "+code+"</b>\n\nWe hope to stay by your side always!\nBest,\nSidebySide Customer Service Team"
					}, function(error, response){
   						if(error){
					       console.log(error);
					   }else{
					       console.log("Message sent: " + response.message);
					   }
					});
					var row = {email:email, password:password, firstname:firstname, lastname:lastname, email:email, phone:phone, verified:'false', verification_code:code};
					connection.query('insert into Customers set ?', row, function(err, rows, fields) {
						if (!err) {
							req.session.email = email;
							req.session.name = firstname;
							res.render('mobileVerification.ejs', {message: 'welcome'});
							return;
						}
						else {
							console.error('[Register.js] : Error querying login table : ' + err.stack);
							res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
							return;
						}
					});
				}
				else {
					res.render('registerPage.ejs', {message: 'username already exists'});
					return;
				}
			}
			else {
				res.render('registerPage.ejs', {message: 'something went wrong'});
				return;
			}
		});
		connection.release();
	});
}

function random(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function send_sms(code, phone) {
 	var client = new twilio.RestClient('AC997603cf5760391f8e39ce90192a3acf', '628746f7ce96f53fa50bc232d5e59d62');
 	client.sms.messages.create({
    	to:'+1'+phone,
    	from:'3017106565',
    	body:'Verification Code for SidebySide: ' + code + '. Please enter this in the website to verify your account'
	}, function(error, message) {
    if (!error) {
    	
    } 
    else {
        console.log('[Register.js] : Twilio Error');
    }
	});
}

exports.register = function(req, res){
	console.log('Registering user');
	register(req, res, req.body.email, req.body.firstname, req.body.lastname, req.body.password, req.body.phone);
};