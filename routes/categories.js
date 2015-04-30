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

function show_page(req, res, name) {
	res.render('categoriesPage.ejs', {name: name});
}

exports.show = function(req, res){
	show_page(req, res, req.session.name);
};