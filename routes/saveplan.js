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

function save_plan(req, res, planname) {
	//Get username from the login session
	var email = req.session.email;
	req.session.plan_name = planname;
	var time = new Date();
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[saveplan.js] : Error connecting to database : ' + err.stack);
			res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		connection.query("insert into Customer_plans(email, plan_name, last_modfified) values ('"+ email +"','"+ planname +"','"+ time +"')", function(err, rows, fields) {
			if (!err) {
				res.redirect('/showcategories?plan_name='+encodeURIComponent(planname));
			}
			else {
				res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
				return;
			}
		});
		connection.release();
	});
}


exports.save = function(req, res){
	save_plan(req, res, req.query.planname);
};