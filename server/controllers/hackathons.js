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

    all: (req, res) => {
        let query = `
            SELECT hackathons.name AS hackathon, hackathons.id, hackathons.deadline, projects.title, teams.name AS team
            FROM hackathons
            LEFT JOIN projects ON hackathons.winner = projects.id
            LEFT JOIN teams ON projects.teamId = teams.id
            ORDER BY hackathons.deadline DESC;
        `
        db.query(query, (err, data) => {
            if(err){
                res.status(500).json(err);
            }
            else if(data.length < 1){
                res.status(404).json({error: "No hackathons found"});
            }
            else {
                res.status(200).json({hackathons: data});
            }
        })
    },

    anyHack: (req, res) => {
        let query = `
            SELECT * FROM hackathons WHERE id = ?
        `;
        data = [req.params.hackId];
        db.query(query, data, (err, hackathon) => {
            if(err) {
                res.status(500).json(err)
            }
            else if(hackathon.length < 1) {
                res.status(404).send({message: "We could not find this hackathon in our database"});
            }
            else {
                res.status(200).send({hackathon: hackathon[0]})
            }
        })
    },

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
        let theme = req.body['theme'];
        let info = req.body['info'];
        let errors = {};

        if (name.length < 7 || name.length > 32) errors.name ='Name must be 7 to 32 characters';
        if (deadline < new Date()) errors.deadline = 'Deadline must be in the future';
        if (theme.length < 3 || theme.length > 32) errors.theme = 'Theme must be 3 to 32 characters';

        if (Object.keys(errors).length) res.status(409).json({errors:errors});
        else {
            let query = `
                INSERT INTO hackathons (name, deadline, theme, info)
                VALUES (?, ?, ?, ?)
            `;
            let data = [name, deadline, theme, info];
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

    getAllProjects: (req, res) => {
        let query = `
            SELECT 
                tm.id as teamId, tm.name as teamName, loc.name as location, 
                prj.id, prj.title, prj.gitUrl, prj.vidUrl, prj.description
            FROM submissions AS sub 
            JOIN hackathons AS hack on hack.id = sub.hackathonId
            JOIN projects AS prj on prj.id = sub.projectId
            JOIN teams AS tm on prj.teamId = tm.id
            JOIN locations AS loc on loc.id = tm.location
            WHERE hack.id = ?
        `;
        db.query(query, req.params.hackId, (err, projects) => {
            if(err) sendServerError(err, res);
            else {
                res.status(200).json({projects: projects});
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
                    updateSubmission(data);
                }
            });
        } else res.status(409).json({'errors': errors});
        
        function updateSubmission(data){
            let query = "UPDATE submissions SET projectId = ? WHERE (teamId = ? AND hackathonId = ?)";
            db.query(query, data, (err, packet) => {
                if (err) sendServerError(err, res);
                else res.json({'projectId': data[0]});
            });
        }
    },

    submissions: (req, res) => {
        let query = `
            SELECT sub.teamId as teamId, teams.name as teamName, 
                locations.name as location, projects.id, projects.title,
                SUM(s.uiux + s.pres + s.idea + s.impl + s.extra) as total,
                COUNT(s.id) as judgedBy
            FROM submissions AS sub 
            LEFT JOIN hackathons AS hack ON hack.id = sub.hackathonId
            LEFT JOIN teams ON sub.teamId = teams.id
            LEFT JOIN locations ON teams.location = locations.id
            LEFT JOIN projects ON sub.projectId = projects.id
            LEFT JOIN scores AS s ON projects.id = s.projectId
            WHERE sub.hackathonId = ?
            GROUP BY teams.id;
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
        let scores = req.body.scores;
        req.body.scored = 0;
        for (let score in scores){
            scoreOne(req, res, score);
        }
    },

    scoreResponse: (req, res) => {
        req.body.scored++;
        if (req.body.scored == req.body.scores.length){
            res.status(200).send();
        }
    },

    scoreOne: (req, res, score) => {
        let userId = req.session.userId;
        let projectId = score.projectId;
        let uiux = score.ui;
        let pres = score.presentation;
        let idea = score.idea;
        let impl = score.implementation;
        let extra = score.extra;
        let comment = score.comment;
    
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
                else scoreResponse(req, res);
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
                else scoreResponse(req, res);
            });
        }
        
    }
}