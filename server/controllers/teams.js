const db = require('../config/mysql.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

function sendServerError(error, res){
	console.log('[SQL error]', error);
	res.json({'error': 'Server Error'});
}

module.exports = {

    get: (req, res) => {
        let query = `
            SELECT teams.name, l.name as location FROM teams 
            JOIN locations AS l on l.id = teams.location
            WHERE teams.id = ?
        `;
        db.query(query, req.session.userId, (err, data) => {
            res.json({'team': data[0]});
        })
    },
    
    addMember: (req, res) => {
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;

        if (firstName == "" || lastName == "") {
            return res.status(409).send("First and last name must be entered");
        }

        let query = "INSERT INTO members (firstName, lastName, team) VALUES (?, ?, ?)";
        let data = [firstName, lastName, req.session.userId];
        db.query(query, data, (err, packet) => {
            res.status(200);
        });
    },

    isValidMember: (req, res) => {
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;

        if (firstName != "" || lastName != "") res.status(200);
        else res.status(409);
    },

    members: (req, res) => {
        let query = "SELECT * FROM members WHERE team = ?";
        db.query(query, req.session.userId, (err, members) => {
            console.log("asdfa");
            res.json({"members": members});
        })
    }

}