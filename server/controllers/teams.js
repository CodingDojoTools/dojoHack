const db = require('../config/mysql.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

function sendServerError(error, res){
	console.log('[SQL error]', error);
	res.json({'error': 'Server Error'});
}

module.exports = {
    
    addMember: (req, res) => {
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;

        if (firstName == "" || lastName == "") {
            errors = {"name":"First and last name must be entered"};
            return res.json({'status': false, 'errors': errors});
        }

        let query = "INSERT INTO members (firstName, lastName, team) VALUES (?, ?, ?)";
        let data = [firstName, lastName, req.session.userId];
        db.query(query, data, (err, packet) => {
            res.json({'status': true});
        });
    },

    members: (req, res) => {
        let query = "SELECT * FROM members WHERE team = ?";
        db.query(query, req.session.userId, (err, members) => {
            res.json({"members": members});
        }) 
    }

}