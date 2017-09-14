const db = require('../config/mysql.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

function sendServerError(error, res){
	console.log('[SQL error]', error);
	res.json({'error': 'Server Error'});
}

function setSessionRole(req, role, userId){
    req.session.userId = userId;
    switch (role){
        case "users": req.session.admin = true; break;
        case "teams": req.session.team = true; break;
    } 
}

module.exports = {

    register: (req, res, role="users") => {
        let errors = {};
        let name = req.body['name'];
        let password = req.body['password'];
        let confirmPassword = req.body['confirmPassword'];

        if (name.length < 5 || name.length > 32) errors.name = 'User name must be 5 to 32 characters.'
        if (password.length < 8) errors.password = 'Password must be at least 8 characters'
        else if (password != confirmPassword) errors.password = 'Passwords do not match'

        let query = 'SELECT id FROM '+ role +' WHERE name = ?';
        db.query(query, req.body.name, (err, users) => {
            if(err) return sendServerError(err, response);
            if (users.length) errors.name = 'User name in already taken';
            
            if (Object.keys(errors).length == 0) createUser(req.body);
            else res.json({'status': false, 'errors': errors});
        });
        

        function createUser(user){
            bcrypt.hash(user.password, saltRounds, (err, hash) => {
                let query = 'INSERT INTO '+ role +' (name, password, location) VALUES (?, ?, ?)';
                let userData = [user.name, hash, user.location];
                db.query(query, userData, (err, packet) => {
                    setSessionRole(req, role, packet.insertId);
                    res.json({'status': true, 'userId': packet.insertId});
                });
            });                
        }
    },

    login: (req, res, role="users") => {
        let query = 'SELECT * FROM '+ role +' WHERE name = ?';
		db.query(query, req.body.name, (err, users) => {
			if(err) return sendServerError(err, res);
            if (users.length) validateUser(req, users[0]);
            else res.json({'status': false});
        });

        function validateUser(req, user){
            bcrypt.compare(req.body.password, user.password, (err, status) => {
                setSessionRole(req, role, user.id);
                res.json({'status': status});
            });
        }
    },
    
    logout: (req, res) => {
        req.session.userId = null;
        req.session.admin = null;
        req.session.team = null;
        res.json({'status': true});
    },

    locations: (req, res) => {
        let query = 'SELECT * FROM locations';
		db.query(query, (err, locations) => {
            res.json({'locations': locations});
        });
    }
    
}