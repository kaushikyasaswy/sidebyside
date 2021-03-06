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
				var divey_restaurants = 0;
				var classy_restaurants = 0;
				var touristy_restaurants = 0;
				var hipster_restaurants = 0;
				var trendy_restaurants = 0;
				var intimate_restaurants = 0;
				var casual_restaurants = 0;
				var romance_restaurants = 0;
				var upscale_restaurants = 0;
				connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.State = '"+state+"' and Categories.category REGEXP "+str+" and (Attributes.ambience_divey = '1' or Attributes.ambience_classy = '1' or Attributes.ambience_touristy = '1' or Attributes.ambience_hipster = '1' or Attributes.ambience_trendy = '1' or Attributes.ambience_intimate = '1' or Attributes.ambience_casual = '1' or Attributes.ambience_romance = '1' or Attributes.ambience_upscale = '1')", function(err, results, fields) {
					if (!err) {
						total_restaurants = results.length;
						connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.State = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.ambience_divey = '1'", function(err, results1, fields) {
							if (!err) {
								divey_restaurants = results1.length;
								connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.State = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.ambience_classy = '1'", function(err, results2, fields) {
									if (!err) {
										classy_restaurants = results2.length;
										connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.State = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.ambience_touristy = '1'", function(err, results3, fields) {
											if (!err) {
												touristy_restaurants = results3.length;
												connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.State = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.ambience_hipster = '1'", function(err, results4, fields) {
													if (!err) {
														hipster_restaurants = results4.length;
														connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.State = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.ambience_trendy = '1'", function(err, results5, fields) {
															if (!err) {
																trendy_restaurants = results5.length;
																connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.State = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.ambience_intimate = '1'", function(err, results6, fields) {
																	if (!err) {
																		intimate_restaurants = results6.length;
																		connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.State = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.ambience_casual = '1'", function(err, results7, fields) {
																			if (!err) {
																				casual_restaurants = results7.length;
																				connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.State = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.ambience_romance = '1'", function(err, results8, fields) {
																					if (!err) {
																						romance_restaurants = results8.length;
																						connection.query("select distinct business.business_id from business inner join Categories on business.business_id = Categories.business_id inner join Attributes on business.business_id = Attributes.business_id where business.city = '"+city+"' and business.State = '"+state+"' and Categories.category REGEXP "+str+" and Attributes.ambience_upscale = '1'", function(err, results9, fields) {
																							if (!err) {
																								upscale_restaurants = results9.length;
																								var divey_r = divey_restaurants/total_restaurants;
																								var classy_r = classy_restaurants/total_restaurants;
																								var touristy_r = touristy_restaurants/total_restaurants;
																								var hipster_r = hipster_restaurants/total_restaurants;
																								var trendy_r = trendy_restaurants/total_restaurants;
																								var intimate_r = intimate_restaurants/total_restaurants;
																								var casual_r = casual_restaurants/total_restaurants;
																								var romance_r = romance_restaurants/total_restaurants;
																								var upscale_r = upscale_restaurants/total_restaurants;
																								yelp.search({sort: "2", limit: "5", location: "Philadelphia", category_filter: "interiordesign"}, function(error, data) {
																								    var businesses = [];
																									for (var i=0; i < 5; i++) {
																										var name = data.businesses[i].name;
																										var phone = data.businesses[i].display_phone;
																										var url = data.businesses[i].url;
																										var business = [name, phone, url];
																										businesses.push(business);
																									}
																									res.render('ambiencePage.ejs', {name: req.session.name, plan: plan, bardata: [divey_r, classy_r, touristy_r, hipster_r, trendy_r, intimate_r, casual_r, romance_r, upscale_r], businesses: businesses});
																									return;
																								});
																							}
																							else {
																								console.error('[ambience.js] : Error querying table : ' + err.stack);
																								res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
																								return;
																							}
																						});
																					}
																					else {
																						console.error('[ambience.js] : Error querying table : ' + err.stack);
																						res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
																						return;
																					}
																				});
																			}
																			else {
																				console.error('[ambience.js] : Error querying table : ' + err.stack);
																				res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
																				return;
																			}
																		});
																	}
																	else {
																		console.error('[ambience.js] : Error querying table : ' + err.stack);
																		res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
																		return;
																	}
																});
															}
															else {
																console.error('[ambience.js] : Error querying table : ' + err.stack);
																res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
																return;
															}
														});
													}
													else {
														console.error('[ambience.js] : Error querying table : ' + err.stack);
														res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
														return;
													}
												});
											}
											else {
												console.error('[ambience.js] : Error querying table : ' + err.stack);
												res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
												return;
											}
										});
									}
									else {
										console.error('[ambience.js] : Error querying table : ' + err.stack);
										res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
										return;
									}
								});
							}
							else {
								console.error('[ambience.js] : Error querying table : ' + err.stack);
								res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
								return;
							}
						});
					}
					else {
						console.error('[ambience.js] : Error querying table : ' + err.stack);
						res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
						return;
					}
				});
			}
			else {
				console.error('[ambience.js] : Error querying table : ' + err.stack);
				res.render('errorPage.ejs', {message: 'Unable to query database at this time'});
				return;
			}
		});
		connection.release();
	});
}

function save(req, res, email, plan_name, index) {
	var time = new Date();
	index = parseInt(index, 10);
	console.log('Index is '+index);
	var query = "";
	if (index == 0) {
		query = "update Customer_plans set ambience_divey = '1', last_modified = '"+ time +"' where email='" + email + "' and plan_name = '"+ plan_name +"'";
	}
	else if (index == 1) {
		query = "update Customer_plans set ambience_classy = '1', last_modified = '"+ time +"' where email='" + email + "' and plan_name = '"+ plan_name +"'";
	}
	else if (index == 2) {
		query = "update Customer_plans set ambience_touristy = '1', last_modified = '"+ time +"' where email='" + email + "' and plan_name = '"+ plan_name +"'";
	}
	else if (index == 3) {
		query = "update Customer_plans set ambience_hipster = '1', last_modified = '"+ time +"' where email='" + email + "' and plan_name = '"+ plan_name +"'";
	}
	else if (index == 4) {
		query = "update Customer_plans set ambience_trendy = '1', last_modified = '"+ time +"' where email='" + email + "' and plan_name = '"+ plan_name +"'";
	}
	else if (index == 5) {
		query = "update Customer_plans set ambience_intimate = '1', last_modified = '"+ time +"' where email='" + email + "' and plan_name = '"+ plan_name +"'";
	}
	else if (index == 6) {
		query = "update Customer_plans set ambience_casual = '1', last_modified = '"+ time +"' where email='" + email + "' and plan_name = '"+ plan_name +"'";
	}
	else if (index == 7) {
		query = "update Customer_plans set ambience_romance = '1', last_modified = '"+ time +"' where email='" + email + "' and plan_name = '"+ plan_name +"'";
	}
	else if (index == 8) {
		query = "update Customer_plans set ambience_upscale = '1', last_modified = '"+ time +"' where email='" + email + "' and plan_name = '"+ plan_name +"'";
	}
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[ambience.js] : Error connecting to database : ' + err.stack);
			res.render('errorPage.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		else {
			connection.query(query, function(err, rows, fields) {
				if (!err) {
					res.redirect('/wifi');
					return;
				}
				else {
					console.error('[ambience.js] : Error connecting to database : ' + err.stack);
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
	console.log('SAVE');
	save(req, res, req.session.email, req.session.plan, req.query.choice);
};
