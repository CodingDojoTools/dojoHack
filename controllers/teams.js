const db = require('../config/mysql.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

function sendServerError(error, res){
	console.log('[SQL error]', error);
	res.json({'error': 'Server Error'});
}

module.exports = {
    
}