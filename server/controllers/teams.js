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
            if(err) sendServerError(err, res);
            else res.json({'team': data[0]});
        })
    },
    
    addMember: (req, res) => {
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;

        if (firstName == '' || lastName == '') {
            return res.status(409).json({'error':"First and Last name are required"});
        }

        let query = 'INSERT INTO members (firstName, lastName, team) VALUES (?, ?, ?)';
        let data = [firstName, lastName, req.session.userId];
        db.query(query, data, (err, packet) => {
            if(err) sendServerError(err, res);
            res.status(200).json({'member': packet});
        });
    },

    isValidMember: (req, res) => {
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        if (firstName != '' && lastName != '') res.status(200).send();
        else res.status(409).send();
    },

    membersById: (req, res) => {
        let query = 'SELECT * FROM members WHERE team = ?';
        db.query(query, req.params.teamId, (err, members) => {
            if(err) sendServerError(err, res);
            else res.status(200).json({'members': members})
        })
    },

    members: (req, res) => {
        let query = 'SELECT * FROM members WHERE team = ?';
        db.query(query, req.session.userId, (err, members) => {
            if(err) sendServerError(err, res);
            else res.status(200).json({'members': members})
        })
    },
    update: (req, res) => {
        let query = 'UPDATE teams SET name = ?, location = ? WHERE id = ?';
        data = [req.body.teamName, req.body.location, req.session.userId];
        db.query(query, data, (err, update) => {
            if(err) res.status(500).json({'message': 'We could not update'});
            else res.status(200).json({'update': update});
        })
    },

    updateMembers: (req, res) => {
        console.log('In the updateMembers');
        var success = true;
        for(let member of req.body.members){
            let query = 'UPDATE members SET firstName = ?, lastName = ? WHERE id = ? AND team = ?';
            let data = [member.firstName, member.lastName, member.id, req.session.userId];
            db.query(query, data, (err, update) => {
                if(err) success = false;
            })
        }
        // TODO: make async
        if(success) res.status(200).json({'update': true})
        else res.status(500).json({'update': false})
    }


}