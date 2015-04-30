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

function get_homepage(req, res, email, name) {
	var plans = [];
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[homePage.js] : Error connecting to database : ' + err.stack);
			res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		connection.query("select * from Customer_plans where email='" + email + "'", function(err, rows, fields) {
			if (!err) {
				if (rows.length == 0) {
					res.render('homePage.ejs', {message: 'registration success', name: name});
					return;
				}
				else {
					for(var i = 0; i < rows.length;i++) {
        				plans.push(rows[i]);
	  				}
	  				res.render('homePage.ejs', {message: 'display homepage', name: name, plans: plans});
					return;
				}
			}
			else {
				res.render('errorPage.ejs', {message: 'something went wrong'});
				return;
			}
		});
		connection.release();
	});
}

exports.home = function(req, res){
	get_homepage(req, res, req.session.email, req.session.name);
};