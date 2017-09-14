var db = require('../config/mysql.js');

module.exports = {

    joined: (req, res) => {
        let query = `
            SELECT * FROM hackathons AS h 
            JOIN hackathon_attendees AS ha ON h.id = ha.hackathonId
            WHERE deadline > NOW()
            AND ha.teamId = ?
        `;
        db.query(query, req.session.userId, (err, hackathons) => {
            res.json({'hackathons': hackathons});
        });
    },
    
    current: (req, res) => {
        let query = `
            SELECT h.id, h.name, h.deadline FROM hackathons AS h 
            LEFT JOIN hackathon_attendees AS ha 
            ON (h.id = ha.hackathonId and ha.teamId = ?)
            WHERE deadline > NOW()
            AND (ha.teamId <> ? OR ha.teamId is null)
            GROUP BY h.id
        `;
        let data = [req.session.userId, req.session.userId];
        db.query(query, data, (err, hackathons) => {
            res.json({'hackathons': hackathons});
        });
    },
    
    past: (req, res) => {
        let query = 'SELECT * FROM hackathons WHERE deadline < NOW()';
        db.query(query, req.body.name, (err, hackathons) => {
            res.json({'hackathons': hackathons});
        });
    },
    
    create: (req, res) => {
        let name = req.body.name;
        let deadline = new Date(req.body.deadline);

        if (deadline < new Date()) res.json({'status': false, 'error': 'Deadline must be in the future'});
        else {
            let query = `
                INSERT INTO hackathons (name, deadline)
                VALUES (?, ?)
            `;
            let data = [name, deadline];
            db.query(query, data, (err, packet) => {
                res.json({'status': true, 'hackathonId': packet.insertId});
            });
        }  
    },

    join: (req, res) => {
        let query = 'INSERT INTO hackathon_attendees (teamId, hackathonId) VALUES (?, ?)';
        let data = [req.session.userId, req.params.hackId]
        db.query(query, data, (err, packet) => {
            res.json({'status': true});
        });
    },
}