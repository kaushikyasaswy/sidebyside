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
	var yelp = require("yelp").createClient({
  	consumer_key: config.yelp_consumer_key, 
  	consumer_secret: config.yelp_consumer_secret,
  	token: config.yelp_token,
  	token_secret: config.yelp_token_secret
	});
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[alcohol.js] : Error connecting to database : ' + err.stack);
			res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		connection.query("select * from Customer_plans where email='" + email + "' and plan_name='" + plan + "'", function(err, rows, fields) {
			if (!err) {
				if (rows.length == 0) {
					res.render('errorPage.ejs', {message: 'user not logged in'});
					return;
				}
				var city = rows[0].city;
				var state = rows[0].State;
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
				connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.State = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.alcohol REGEXP 'none|full_bar'", function(err, results, fields) {
					if (!err) {
						total_restaurants = results.length;
						connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.alcohol REGEXP 'none'", function(err, results1, fields) {
							if (!err) {
								non_alcohol_restaurants = results1.length;
								connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.alcohol REGEXP 'full_bar'", function(err, results2, fields) {
									if (!err) {
										alcohol_restaurants = results2.length;
										var alc = alcohol_restaurants/total_restaurants;
										var non_alc = non_alcohol_restaurants/total_restaurants;
														yelp.search({sort: "2", limit: "5", location: "Philadelphia", category_filter: "beer_and_wine"}, function(error, data) {
														    var businesses = [];
															for (var i=0; i < 5; i++) {
																var name = data.businesses[i].name;
																var phone = data.businesses[i].display_phone;
																var url = data.businesses[i].url;
																var business = [name, phone, url];
																businesses.push(business);
															}
															res.render('alcoholPage.ejs', {name: req.session.name, plan: plan, bardata: [non_alc, alc], businesses: businesses});
															return;
														});
									}
									else {
										console.error('[alcohol.js] : Error querying table : ' + err.stack);
										res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
										return;
									}
								});
							}
							else {
								console.error('[alcohol.js] : Error querying table : ' + err.stack);
								res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
								return;
							}
						});
						
					}
					else {
						console.error('[alcohol.js] : Error querying table : ' + err.stack);
						res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
						return;
					}
				});
			}
			else {
				console.error('[alcohol.js] : Error querying table : ' + err.stack);
				res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
				return;
			}
		});
		connection.release();
	});
}

function save(req, res, email, plan_name, alcohol) {
	var time = new Date();
	alcohol = parseInt(alcohol, 10);
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[alcohol.js] : Error connecting to database : ' + err.stack);
			res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		else {
			var query = "";
			if (alcohol == 0) {
				query = "update Customer_plans set alcohol = '0', last_modified = '"+ time +"' where email='" + email + "' and plan_name = '"+ plan_name +"'";
			}
			else {
				query = "update Customer_plans set alcohol = '1', last_modified = '"+ time +"' where email='" + email + "' and plan_name = '"+ plan_name +"'";
			}
			connection.query(query, function(err, rows, fields) {
				if (!err) {
					res.redirect('/delivery');
					return;
				}
				else {
					console.error('[alcohol.js] : Error connecting to database : ' + err.stack);
					res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
					return;
				}
			});
		}
	});
}

exports.show = function(req, res){
	show(req, res, req.session.email, req.session.plan);
};

exports.save = function(req, res){
	save(req, res, req.session.email, req.session.plan, req.query.choice);
};
