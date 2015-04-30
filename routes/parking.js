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

//Function to display the price range page
function show(req, res, email, plan) {
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[PriceRange.js] : Error connecting to database : ' + err.stack);
			res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		connection.query("select * from Customer_plans where email='" + email + "' and plan='" + plan + "'", function(err, rows, fields) {
			if (!err) {
				if (rows.length == 0) {
					res.render('errorPage.ejs', {message: 'user not logged in'});
					return;
				}
				var city = rows[0].city;
				var state = rows[0].state;
				var categories = rows[0].categories;
				var categories_array = categories.split(";");
				var str = "'";
				for (var i = 0, len = categories_array.length; i < len; i++) {
					if (i == len-1) {
						str += categories_array[i] + "'";
					}
  					else {
  						str += categories_array[i] + "|";
  					}
				}
				var total_restaurants = 0;
				var pr1_restaurants = 0; //Restaurants with price_range 1
				var pr2_restaurants = 0; //Restaurants with price_range 2
				var pr3_restaurants = 0; //Restaurants with price_range 3
				var pr4_restaurants = 0; //Restaurants with price_range 4
				connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str, function(err, results, fields) {
					if (!err) {
						total_restaurants = results.length;
						connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.price_range = '1'", function(err, results1, fields) {
							if (!err) {
								pr1_restaurants = results1.length;
							}
							else {
								console.error('[PriceRange.js] : Error querying table : ' + err.stack);
								res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
								return;
							}
						});
						connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.price_range = '2'", function(err, results2, fields) {
							if (!err) {
								pr2_restaurants = results2.length;
							}
							else {
								console.error('[PriceRange.js] : Error querying table : ' + err.stack);
								res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
								return;
							}
						});
						connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.price_range = '3'", function(err, results3, fields) {
							if (!err) {
								pr3_restaurants = results3.length;
							}
							else {
								console.error('[PriceRange.js] : Error querying table : ' + err.stack);
								res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
								return;
							}
						});
						connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.price_range = '4'", function(err, results4, fields) {
							if (!err) {
								pr4_restaurants = results4.length;
							}
							else {
								console.error('[PriceRange.js] : Error querying table : ' + err.stack);
								res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
								return;
							}
						});
						var pr_one = pr1_restaurants/total_restaurants;
						var pr_two = pr2_restaurants/total_restaurants;
						var pr_three = pr3_restaurants/total_restaurants;
						var pr_four = pr4_restaurants/total_restaurants;
						res.render('priceRangePage.ejs', {message: 'not saved', pr_one: pr1, pr_two: pr2, pr_three: pr3, pr_four: pr4});
						return;
					}
					else {
						console.error('[PriceRange.js] : Error querying table : ' + err.stack);
						res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
						return;
					}
				});
			}
			else {
				console.error('[PriceRange.js] : Error querying table : ' + err.stack);
				res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
				return;
			}
		});
		connection.release();
	});
}

exports.show = function(req, res){
	show(req, res, req.session.email, req.session.plan);
};

exports.save = function(req, res){
	save(); //Get values from post request and store in the database
};