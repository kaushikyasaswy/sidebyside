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


function getdata(req, res, email, plan, state) {
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[FinalPage.js] : Error connecting to database : ' + err.stack);
			res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		connection.query("update Customer_plans set State='"+ state +"' where email='" + email + "' and plan_name='" + plan + "'", function(err, rows, fields) {
			if (!err) {
				var cities = [];
				connection.query("select distinct(city) from business where state='"+ state +"'", function(err, rows, fields) {
					if (!err) {
						for (var i=0; i<rows.length; i++) {
							cities.push(rows[i].city);
						}
						res.send(cities);
						return;
					}
					else {
						console.error('[getcities.js] : Error querying table : ' + err.stack);
						res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
						return;
					}
				});
			}
			else {
				console.error('[getcities.js] : Error querying table : ' + err.stack);
				res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
				return;
			}
		});
		connection.release();
	});
}


exports.showcities = function(req, res){
	getdata(req, res, req.session.email, req.session.plan, req.query.state);
};