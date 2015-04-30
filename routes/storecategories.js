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
	//res.redirect('/locationpage');
	res.sendStatus(200);
	return;
}

exports.store = function(req, res){
	store_categories(req, res, req.query.categories);
};