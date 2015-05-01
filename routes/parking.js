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
				var with_parking = 0; 
				var without_parking = 0; 
				connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str, function(err, results, fields) {
					if (!err) {
						total_restaurants = results.length;
						connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.price_range = '1'", function(err, results1, fields) {
							if (!err) {
								with_parking = results1.length;
								connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.state = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.price_range = '2'", function(err, results2, fields) {
									if (!err) {
										pr2_restaurants = results2.length;
										var withparking = with_parking/total_restaurants;
										var withoutparking = without_parking/total_restaurants;
										yelp.search({sort: "2", limit: "5", location: "Philadelphia", category_filter: "interiordesign"}, function(error, data) {
																								    var businesses = [];
																									for (var i=0; i < 5; i++) {
																										var name = data.businesses[i].name;
																										var phone = data.businesses[i].display_phone;
																										var url = data.businesses[i].url;
																										var business = [name, phone, url];
																										businesses.push(business);
																									}
																									res.render('parkingPage.ejs', {name: req.session.name, plan: plan, bardata: [withoutparking, withparking], businesses: businesses});
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
		connection.release();
	});
}

function save(req, res, email, plan_name, parking) {
	var time = new Date();
	parking = parseInt(parking, 10);
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[parking.js] : Error connecting to database : ' + err.stack);
			res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		else {
			var query = "";
			if (parking == 0) {
				query = "update Customer_plans set parking_lot = '0', parking_valet = '0', parking_garage = '0', parking_street = '1', last_modified = '"+ time +"' where email='" + email + "' and plan_name = '"+ plan_name +"'";
			}
			else {
				query = "update Customer_plans set parking_lot = '1', parking_valet = '1', parking_garage = '1', parking_street = '0', last_modified = '"+ time +"' where email='" + email + "' and plan_name = '"+ plan_name +"'";
			}
			connection.query(query, function(err, rows, fields) {
				if (!err) {
					res.redirect('/finalpage');
					return;
				}
				else {
					console.error('[parking.js] : Error connecting to database : ' + err.stack);
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