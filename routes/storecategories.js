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

function store_categories(req, res, categories) {
	var email = req.session.email;
	var plan_name = req.session.plan_name;
	var time = new Date();
	categories = categories.substring(0, categories.length - 1);
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[storecategories.js] : Error connecting to database : ' + err.stack);
			res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		connection.query("update Customer_plans set categories = '"+ categories +"', last_modified = '"+ time +"' where email = '"+ email +"' and plan_name = '"+ plan_name +"'", function(err, rows, fields) {
			if (!err) {
				res.redirect('/locationpage');
				return;
			}
			else {
				res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
				return;
			}
		});
		connection.release();
	});
}

exports.store = function(req, res){
	store_categories(req, res, req.query.categories);
};