const db = require('../config/mysql.js');
const GIT_REGEX = /https:\/\/github\.com\/[\w\\-]+\/[\w\\-]+$/;
const YT_REGEX = /https:\/\/youtu\.be\/\w+$/;

function sendServerError(error, res){
	console.log('[SQL error]', error);
	res.status(500).send(error);
}

// Codes
//==============================
// 409 : Conflict
// 500 : Internal Server Error
// 200 : OK


module.exports = {

    joined: (req, res) => {
        let query = `
            SELECT * FROM hackathons AS h 
            JOIN submissions AS ha ON h.id = ha.hackathonId
            WHERE deadline > NOW()
            AND ha.teamId = ?
            ORDER BY deadline
        `;
        db.query(query, req.session.userId, (err, hackathons) => {
            if (err) sendServerError(err, res);
            else res.json({'hackathons': hackathons});
        });
    },

    oneJoined: (req, res)=> {
        let query = `
            SELECT * FROM hackathons LEFT JOIN submissions on hackathons.id = submissions.hackathonId WHERE hackathons.id = ? AND deadline > NOW() AND submissions.teamId = ?
        `;
        data = [req.params.hackId, req.session.userId]
        db.query(query, data, (err, hackathon) => {
            if(err){
                res.status(500).json(err)
            }
            else if(hackathon.length < 1) {
                res.status(404).send({message: "You haven't joined this hackathon yet!"})
            }
            else {

                res.status(200).send({hackathon: hackathon[0]})
            }
        })
    },

    info: (req, res) => {
        let query = `
            SELECT * FROM hackathons
            WHERE id = ?
        `;
        let data = [req.params.hackId];
        db.query(query, data, (err, hackathon) => {
            if(err) {
                sendServerError(err, res);
            }
            else if(hackathon.length < 1) {
                res.status(404).send({message: "This hackathon does not exist"})
            }
            else if(hackathon[0].deadline < new Date()){
                res.status(409).send({message: "This hackathon is over"})
            }
            else {
                res.status(200).json({hackathon: hackathon[0]});
            }
        })
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
            if (err) sendServerError(err, res);
            else res.json({'hackathons': hackathons});
        });
    },
    
    past: (req, res) => {
        let query = 'SELECT * FROM hackathons WHERE deadline < NOW()';
        db.query(query, (err, hackathons) => {
            if (err) sendServerError(err, res);
            else res.json({'hackathons': hackathons});
        });
    },
    
    create: (req, res) => {
        let name = req.body['name'];
        let deadline = new Date(req.body['deadline']);

        if (deadline < new Date()) res.status(409).send('Deadline must be in the future');
        else {
            let query = `
                INSERT INTO hackathons (name, deadline)
                VALUES (?, ?)
            `;
            let data = [name, deadline];
            db.query(query, data, (err, packet) => {
                if (err) sendServerError(err, res);
                else res.json({'hackathonId': packet.insertId});
            });
        }
    },

    join: (req, res) => {
        let exist = 'SELECT * FROM submissions WHERE teamID = ? AND hackathonId = ?';
        let query = 'INSERT INTO submissions (teamId, hackathonId) VALUES (?, ?)';
        let data = [req.session.userId, req.params.hackId]
        db.query(exist, data, (err, subs) => {
            if(err) sendServerError(err, res);
            else if(subs.length > 0){
                res.status(409).send("You've already joined this hackathon")
            }
            else {
                db.query(query, data, (err, packet) => {
                    if (err) {
                        sendServerError(err, res);
                    }
                    else {
                        res.status(200).json({hackathonId: req.params.hackId});
                    }
                });
            }
        })
        
    },

    getProject: (req, res) => {
        let query = `SELECT * FROM projects WHERE id = ? AND teamID = ?`;
        let data = [req.params.projectId, req.session.userId];
        db.query(query, data, (err, project) => {
            if(err) {
                sendServerError(err, res);
            }
            else {
                res.status(200).json({project: project});
            }
        })

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
                if (err) sendServerError(err, res);
                else {
                    let data = [packet.insertId, team, hackathon];
                    updateSubmition(data);
                }
            });
        } else res.status(409).json({'errors': errors});
        
        function updateSubmition(data){
            let query = "UPDATE submissions SET projectId = ? WHERE (teamId = ? AND hackathonId = ?)";
            db.query(query, data, (err, packet) => {
                if (err) sendServerError(err, res);
                else res.json({'projectId': data[0]});
            });
        }
    },

    submissions: (req, res) => {
        let query = `
            SELECT sub.teamId, hackathons.name as hackName, teams.name as teamName, locations.name as teamLocation, projectId, projects.title AS projectTitle 
            FROM submissions AS sub 
            LEFT JOIN hackathons ON sub.hackathonId = hackathons.id
            LEFT JOIN teams ON sub.teamId = teams.id
            LEFT JOIN locations ON teams.location = locations.id
            LEFT JOIN projects ON sub.projectId = projects.id
            WHERE sub.hackathonId = ?;
        `;
        db.query(query, req.params.hackId, (err, submissions) => {
            if (err) sendServerError(err, res);
            else {
                console.log("Sending back these submissions", submissions)
                res.json({'submissions': submissions});
            }
        });
    },

    score: (req, res) => {
        let userId = req.session.userId;
        let projectId = req.body.projectId;
        let uiux = req.body.uiux;
        let pres = req.body.pres;
        let idea = req.body.idea;
        let impl = req.body.impl;
        let extra = req.body.extra;
        let comment = req.body.comment;
    
        let query = 'SELECT id FROM scores WHERE userId = ? AND projectId = ?'
        let data = [userId, projectId];
        db.query(query, data, (err, scores) => {
            if (err) sendServerError(err, res);
            else if (scores.length) updateScore()
            else addScore()
        });

        function addScore(){
            let query = `
                INSERT INTO scores (userId, projectId, uiux, pres, idea, impl, extra, comment)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            let data = [userId, projectId, uiux, pres, idea, impl, extra, comment];
            db.query(query, data, (err, packet) => {
                if (err) sendServerError(err, res);
                else res.status(200).send();
            });
        }

        function updateScore(){
            let query = `
                UPDATE scores SET uiux = ?, pres = ?, idea = ?, impl = ?, extra = ?, comment = ?
                WHERE userId = ? AND projectId = ?
            `;
            let data = [uiux, pres, idea, impl, extra, comment, userId, projectId];
            db.query(query, data, (err, packet) => {
                if (err) sendServerError(err, res);
                else res.status(200).send();
            });
        }
        
    }
}