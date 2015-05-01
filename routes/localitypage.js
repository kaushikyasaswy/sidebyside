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

function getdata(req, res, email, plan, city) {
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[localitypage.js] : Error connecting to database : ' + err.stack);
			res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		connection.query("update Customer_plans set city='"+ city +"' where email='" + email + "' and plan_name='" + plan + "'", function(err, rows, fields) {
			if (!err) {
				connection.query("select * from Customer_plans where email='" + email + "' and plan_name='" + plan + "'", function(err, rows, fields) {
					if (!err) {
						console.log("select * from Customer_plans where email='" + email + "' and plan_name='" + plan + "'");
						var city = rows[0].city;
						var state = rows[0].State;
						var categories = rows[0].categories;
						var categories_array = categories.split(";");
						var str = "";
						for (var i = 0, len = categories_array.length; i < len; i++) {
							if (i == len-1) {
								str += categories_array[i];
							}
		  					else {
		  						str += categories_array[i] + ",";
		  					}
						}
						res.redirect('/newlocalitypage?city='+city+'&state='+state+'&categories_list='+str);
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

exports.showlocations = function(req, res){
	getdata(req, res, req.session.email, req.session.plan, req.query.city);
};