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
	  consumer_key: "wMfCFcqTj2FLaybsGPzytQ", 
	  consumer_secret: "7U5KhSvKp0evucyb5-ltXtwEW68",
	  token: "Hu_4wJgfcjPrhrObMvqYyddAlQkJ-yD2",
	  token_secret: "t_S08LdIEw5v6-Yw-dJXQiZXUh4"
	});
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[PriceRange.js] : Error connecting to database : ' + err.stack);
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
				var pr1_restaurants = 0; //Restaurants with price_range 1
				var pr2_restaurants = 0; //Restaurants with price_range 2
				var pr3_restaurants = 0; //Restaurants with price_range 3
				var pr4_restaurants = 0; //Restaurants with price_range 4
				connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str, function(err, results, fields) {
					if (!err) {
						total_restaurants = results.length;
						connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.price_range = '1'", function(err, results1, fields) {
							if (!err) {
								console.log("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.price_range = '1'");
								pr1_restaurants = results1.length;
								connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.price_range = '2'", function(err, results2, fields) {
									if (!err) {
										pr2_restaurants = results2.length;
										connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.price_range = '3'", function(err, results3, fields) {
											if (!err) {
												pr3_restaurants = results3.length;
												connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.price_range = '4'", function(err, results4, fields) {
													if (!err) {
														pr4_restaurants = results4.length;
														var pr_one = pr1_restaurants/total_restaurants;
														var pr_two = pr2_restaurants/total_restaurants;
														var pr_three = pr3_restaurants/total_restaurants;
														var pr_four = pr4_restaurants/total_restaurants;
														yelp.search({sort: "2", limit: "5", location: "Philadelphia", category_filter: "isps"}, function(error, data) {
														    var businesses = [];
															for (var i=0; i < 5; i++) {
																var name = data.businesses[i].name;
																var phone = data.businesses[i].display_phone;
																var url = data.businesses[i].url;
																var business = [name, phone, url];
																businesses.push(business);
															}
															res.render('priceRangePage.ejs', {name: req.session.name, plan: plan, bardata: [pr_one, pr_two, pr_three, pr_four], businesses: businesses});
															return;
														});
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

function save(req, res, email, plan_name, price_range) {
	var time = new Date();
	price_range = parseInt(price_range, 10) + 1;
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[PriceRange.js] : Error connecting to database : ' + err.stack);
			res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		else {
			connection.query("update Customer_plans set price_range = '"+ price_range +"', last_modified = '"+ time +"' where email='" + email + "' and plan_name = '"+ plan_name +"'", function(err, rows, fields) {
				if (!err) {
					res.redirect('/ambience');
					return;
				}
				else {
					console.error('[PriceRange.js] : Error connecting to database : ' + err.stack);
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
	save(req, res, req.session.email, req.session.plan, req.query.choice); //Get values from post request and store in the database
};