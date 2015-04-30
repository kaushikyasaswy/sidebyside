var mysql = require('mysql');
var session = require('client-sessions');
var config = require('./../configuration/config');

//Connection data
var connection_data = {
host     : config.db_host,
user     : config.db_user,
password : config.db_password,
database : config.db_database
};

function verify(req, res, code) {
	//Get username from the login session
	var email = req.session.email;
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[mobileVerification.js] : Error connecting to database : ' + err.stack);
			res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		connection.query("select * from Customers where email='" + email + "'", function(err, rows, fields) {
			if (!err) {
				var code_from_db = rows[0].verification_code;
				var email = rows[0].email;
				var firstname = rows[0].firstname;
				if (code == code_from_db) {
					connection.query("update Customers set verified='true' where email='" + email + "'", function(err, rows, fields) {
						if (err) {
							console.log(err);
							res.render('mobileVerification.ejs', {message: 'something went wrong'});
							return;
						}
						else {
							req.session.email = email;
							req.session.name = firstname;
							res.redirect('homepage');
							return;
						}
					});
				}
				else {
					res.render('mobileVerification.ejs', {message: 'wrong code'});
					return;
				}
			}
			else {
				res.render('mobileVerification.ejs', {message: 'something went wrong'});
				return;
			}
		});
		connection.release();
	});
}


exports.verify = function(req, res){
	verify(req, res, req.query.code);
};