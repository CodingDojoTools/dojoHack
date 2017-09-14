var mysql = require('mysql');

var connection = mysql.createConnection({
	host: process.env.DBHOST,
	port: process.env.PORT,
	user: process.env.DBUSER,
	password: process.env.DBPASSWORD,
	database: process.env.DATABASE,
	multipleStatements: true
});

module.exports = connection;

