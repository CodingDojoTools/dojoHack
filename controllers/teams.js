const db = require('../config/mysql.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

function sendServerError(error, res){
	console.log('[SQL error]', error);
	res.json({'error': 'Server Error'});
}

module.exports = {

    register: (req, res) => {
        let errors = {};
        let name = req.body['name'];
        let password = req.body['password'];
        let confirmPassword = req.body['confirmPassword'];

        if (name.length < 5 || name.length > 32) errors.name = 'Team name must be 5 to 32 characters.'
        if (password.length < 8) errors.password = 'Password must be at least 8 characters'
        else if (password != confirmPassword) errors.password = 'Passwords do not match'

        let query = 'SELECT id FROM teams WHERE name = ?';
        db.query(query, req.body.name, (err, teams) => {
            if(err) return sendServerError(err, response);
            if (teams.length) errors.name = 'Team name in already takes';
            
            if (Object.keys(errors).length == 0) createTeam(req.body);
            else res.json({'status': false, 'errors': errors});
        });
        

        function createTeam(team){
            bcrypt.hash(team.password, saltRounds, (err, hash) => {
                let query = 'INSERT INTO teams (name, password, location) VALUES (?, ?, ?)';
                let teamData = [team.name, hash, team.location];
                db.query(query, teamData, (err, packet) => {
                    req.session.userId = packet.insertId
                    res.json({'status': true, 'userId': packet.insertId});
                });
            });                
        }
    },

    login: (req, res) => {
        let query = 'SELECT * FROM teams WHERE name = ?';
		db.query(query, req.body.name, (err, teams) => {
			if(err) return sendServerError(err, res);
            if (teams.length) validateTesm(req, teams[0]);
            else res.json({'status': false});
        });

        function validateTesm(req, team){
            bcrypt.compare(req.body.password, team.password, (err, status) => {
                req.session.userId = team.id;
                res.json({'status': status});
            });
        }
    },
    
    logout: (req, res) => {
        req.session.userId = null;
        res.json({'status': true});
    },
    
}