const db = require('../config/mysql.js');
const GIT_REGEX = new RegExp('((git|ssh|http(s)?)|(git@[\w\.]+))(:(//)?)([\w\.@\:/\-~]+)(\.git)?(/)?');
const YT_REGEX = new RegExp('(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*');

module.exports = {

    joined: (req, res) => {
        let query = `
            SELECT * FROM hackathons AS h 
            JOIN submissions AS ha ON h.id = ha.hackathonId
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
            LEFT JOIN submissions AS s 
            ON (h.id = s.hackathonId and s.teamId = ?)
            WHERE deadline > NOW()
            AND (s.teamId <> ? OR s.teamId is null)
            GROUP BY h.id
        `;
        let data = [req.session.userId, req.session.userId];
        db.query(query, data, (err, hackathons) => {
            res.json({'hackathons': hackathons});
        });
    },
    
    past: (req, res) => {
        let query = 'SELECT * FROM hackathons WHERE deadline < NOW()';
        db.query(query, (err, hackathons) => {
            res.json({'hackathons': hackathons});
        });
    },
    
    create: (req, res) => {
        let name = req.body['name'];
        let deadline = new Date(req.body['deadline']);

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
        let query = 'INSERT INTO submitions (teamId, hackathonId) VALUES (?, ?)';
        let data = [req.session.userId, req.params.hackId]
        db.query(query, data, (err, packet) => {
            res.json({'status': true});
        });
    },

    addProject: (req, res) => {
        let errors = {};
        let title = req.body.title;
        let gitUrl = req.body.gitUrl;
        let vidUrl = req.body.vidUrl;
        let description = req.body.description;
        let team = req.session.userId;
        let hackathon = req.params.hackId;

        console.log(GIT_REGEX.test(gitUrl));

        if (title.length < 5 || title.length > 32) errors.title = "Title must be from 5 to 32 characters";
        if (!GIT_REGEX.test(gitUrl)) errors.git = "Git url invalid";
        if (!YT_REGEX.test(vidUrl)) errors.git = "YouTube url invalid";

        if (Object.keys(errors).length == 0){
            let query = "INSERT INTO projects (title, gitUrl, vidUrl, description, teamId, hackathonId) VALUES (?, ?, ?, ?, ?, ?)";
            let data = [title, gitUrl, vidUrl, description, team, hackathon];
            db.query(query, data, (err, packet) => {
                let data = [packet.insertId, team, hackathon];
                updateSubmition(data);
            });
        } else res.json({'status': false, errors: errors});
        
        function updateSubmition(data){
            let query = "UPDATE submissions SET projectId = ? WHERE (teamId = ? AND hackathonId = ?)";
            db.query(query, data, (err, packet) => {
                res.json({'status': true, 'projectId': data[0]});
            });
        }
    },

    submissions: (req, res) => {
        let query = `
            SELECT sub.teamId, teams.name as teamName, projectId, projects.title AS projectTitle 
            FROM submissions AS sub 
            LEFT JOIN teams ON sub.teamId = teams.id
            LEFT JOIN projects ON sub.projectId = projects.id
            WHERE sub.hackathonId = ?;
        `;
        db.query(query, req.params.hackId, (err, submissions) => {
            res.json({'submissions': submissions});
        });
    }
}