var mysql = require('mysql');
var session = require('client-sessions');
var config = require('./../configuration/config');
var config = require('./../configuration/config');

//Connection data
var connection_data = {
host     : config.db_host,
user     : config.db_user,
password : config.db_password,
database : config.db_database
};

//Function to authenticate the email and password provided by the user
function authenticate(req, res, email, password) {
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[Authentication.js] : Error connecting to database : ' + err.stack);
			res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		connection.query("select * from Customers where email='" + email + "'", function(err, rows, fields) {
			if (!err) {
				if (rows.length == 0) {
					res.render('welcomePage.ejs', {message: 'username does not exist'});
					return;
				}
				var password_from_db = rows[0].password;
				var verified = rows[0].verified;
				var name = rows[0].firstname;
				if (password == password_from_db) {
					req.session.email = email;
					req.session.name = name;
					if (verified == 'true') {
						res.redirect('homepage');
						return;
					}
					else {
						res.render('mobileVerification.ejs', {message: 'verification pending'});
						return;
					}
				}
				else {
					res.render('welcomePage.ejs', {message: 'wrong password'});
					return;
				}
			}
			else {
				console.error('[Authentication.js] : Error querying Customers table : ' + err.stack);
				res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
				return;
			}
		});
		connection.release();
	});
}

exports.authenticate = function(req, res){
	authenticate(req, res, req.body.email, req.body.password); //Variables for email and password field from UI
};