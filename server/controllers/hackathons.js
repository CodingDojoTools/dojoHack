const { db } = require('../config/mysql.js');
const { isGitUrl, isYoutubeUrl } = require('../utils');
const { responder, sendServerError } = require('./concerns');

// Codes
//==============================
// 409 : Conflict
// 500 : Internal Server Error
// 200 : OK

module.exports = {
  all: (req, res) => {
    const query = `
            SELECT hackathons.name AS hackathon, hackathons.id, hackathons.deadline, projects.title, teams.name AS team
            FROM hackathons
            LEFT JOIN projects ON hackathons.winner = projects.id
            LEFT JOIN teams ON projects.teamId = teams.id
            ORDER BY hackathons.deadline DESC;
        `;
    db.query(query, (err, data) => {
      if (err) {
        res.status(500).json(err);
      } else if (data.length < 1) {
        res.status(404).json({ error: 'No hackathons found' });
      } else {
        res.status(200).json({ hackathons: data });
      }
    });
  },

  anyHack: (req, res) => {
    const query = `
            SELECT * FROM hackathons WHERE id = ?
        `;
    const data = [req.params.hackId];
    db.query(query, data, (err, hackathon) => {
      if (err) {
        res.status(500).json(err);
      } else if (hackathon.length < 1) {
        res.status(404).send({
          message: 'We could not find this hackathon in our database',
        });
      } else {
        res.status(200).send({ hackathon: hackathon[0] });
      }
    });
  },

  joined: (req, res) => {
    const query = `
            SELECT * FROM hackathons AS h
            JOIN submissions AS ha ON h.id = ha.hackathonId
            WHERE deadline > NOW()
            AND ha.teamId = ?
            ORDER BY deadline
        `;
    db.query(query, req.session.userId, responder(res, 'hackathons'));
  },

  oneJoined: (req, res) => {
    const query = `
            SELECT * FROM hackathons LEFT JOIN submissions on hackathons.id = submissions.hackathonId WHERE hackathons.id = ? AND deadline > NOW() AND submissions.teamId = ?
        `;
    const data = [req.params.hackId, req.session.userId];
    db.query(query, data, (err, hackathon) => {
      if (err) {
        res.status(500).json(err);
      } else if (hackathon.length < 1) {
        res
          .status(404)
          .send({ message: "You haven't joined this hackathon yet!" });
      } else {
        res.status(200).send({ hackathon: hackathon[0] });
      }
    });
  },

  info: (req, res) => {
    const query = `
            SELECT * FROM hackathons
            WHERE id = ?
        `;
    const data = [req.params.hackId];
    db.query(query, data, (err, hackathon) => {
      if (err) {
        sendServerError(err, res);
      } else if (hackathon.length < 1) {
        res
          .status(404)
          .json({ errors: { dne: 'This hackathon does not exist' } });
      } else if (hackathon[0].deadline < new Date()) {
        res.status(409).json({ errors: { over: 'This hackathon is over' } });
      } else {
        res.status(200).json({ hackathon: hackathon[0] });
      }
    });
  },

  current: (req, res) => {
    const query = `
            SELECT h.id, h.name, h.deadline, h.theme FROM hackathons AS h
            LEFT JOIN submissions AS s
            ON (h.id = s.hackathonId and s.teamId = ?)
            WHERE deadline > NOW()
            AND (s.teamId <> ? OR s.teamId is null)
            GROUP BY h.id
        `;
    const data = [req.session.userId, req.session.userId];
    db.query(query, data, responder(res, 'hackathons'));
  },

  past: (req, res) => {
    const query = `SELECT hackathons.id, hackathons.name, hackathons.winner, hackathons.theme, hackathons.info, projects.title AS title
        FROM hackathons
        LEFT JOIN projects ON hackathons.winner = projects.id
        WHERE deadline < NOW();`;
    db.query(query, responder(res, 'hackathons'));
  },

  closeJudging: (req, res) => {
    const query = `
            SELECT
                sub.projectId id,
                SUM(s.uiux + s.pres + s.idea + s.impl + s.extra) total
            FROM submissions sub
            JOIN scores s ON sub.projectId = s.projectId
            WHERE sub.hackathonId = ?
            GROUP BY sub.projectId;
        `;
    db.query(query, req.params.hackId, (err, projects) => {
      if (err) sendServerError(err, res);
      else {
        const winner = projects.reduce(
          (leader, challenger) =>
            leader.total < challenger.total ? challenger : leader
        );

        setWinner(res, req.params.hackId, winner.id);
      }
    });
  },

  create: (req, res) => {
    const { name, theme, info, deadline: timeframe } = req.body;
    const deadline = new Date(timeframe);

    const errors = {};
    console.log('server side deadline received', deadline);
    console.log('server thinks now is', new Date());

    if (name.length < 7 || name.length > 32)
      errors.name = 'Name must be 7 to 32 characters';
    if (deadline < new Date())
      errors.deadline = 'Deadline must be in the future';
    if (theme.length < 3 || theme.length > 32)
      errors.theme = 'Theme must be 3 to 32 characters';

    if (Object.keys(errors).length) res.status(409).json({ errors: errors });
    else {
      const query = `
                INSERT INTO hackathons (name, deadline, theme, info)
                VALUES (?, ?, ?, ?)
            `;
      const data = [name, deadline, theme, info];
      db.query(query, data, (err, packet) => {
        if (err) sendServerError(err, res);
        else res.json({ hackathonId: packet.insertId });
      });
    }
  },

  join: (req, res) => {
    const exist =
      'SELECT * FROM submissions WHERE teamID = ? AND hackathonId = ?';
    const query = 'INSERT INTO submissions (teamId, hackathonId) VALUES (?, ?)';
    const data = [req.session.userId, req.params.hackId];
    db.query(exist, data, (err, subs) => {
      if (err) sendServerError(err, res);
      else if (subs.length > 0) {
        res.status(409).send("You've already joined this hackathon");
      } else {
        db.query(query, data, (err, packet) => {
          if (err) {
            sendServerError(err, res);
          } else {
            res.status(200).json({ hackathonId: req.params.hackId });
          }
        });
      }
    });
  },

  getProject: (req, res) => {
    const query = `SELECT projects.id, projects.title, projects.gitUrl, projects.vidUrl,      projects.description, projects.hackathonId, teams.id AS teamId, teams.name AS teamName
        FROM projects
        LEFT JOIN teams ON projects.teamId = teams.id
        WHERE projects.id = ?`;
    db.query(query, req.params.projectId, responder(res, 'project'));
  },

  getProjectScores: (req, res) => {
    const query = `
            SELECT
                users.name as judge, locations.name as locations,
                uiux, pres, idea, impl, extra, comment,
                SUM(uiux + pres + idea + impl + extra) as total
            FROM projects
            LEFT JOIN scores on scores.projectId = projects.id
            LEFT JOIN users on users.id = scores.userId
            LEFT JOIN locations on users.location = locations.id
            WHERE projects.id = ?
            group by uiux, pres, idea, impl, extra, comment, users.name, locations.name;
        `;
    const data = [req.params.projectId, req.session.userId];
    db.query(query, data, responder(res, 'scores'));
  },

  getAllProjects: (req, res) => {
    const query = `
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
    db.query(query, req.params.hackId, responder(res, 'projects'));
  },

  addProject: (req, res) => {
    const { title, gitUrl, vidUrl, description } = req.body;
    const { userId: team } = req.session;
    const { hackId: hackathon } = req.params;

    const errors = {};

    console.log(isGitUrl(gitUrl));

    if (title.length < 5 || title.length > 32)
      errors.title = 'Title must be from 5 to 32 characters';
    if (!isGitUrl(gitUrl)) errors.git = 'Git url invalid';
    if (!isYoutubeUrl(vidUrl)) errors.yt = 'YouTube url invalid';
    if (description.length < 30) {
      errors.desc = 'Description must contain at least 30 characters';
    }

    if (Object.keys(errors).length) {
      return res.status(409).json({ errors: errors });
    }

    const query =
      'INSERT INTO projects (title, gitUrl, vidUrl, description, teamId, hackathonId) VALUES (?, ?, ?, ?, ?, ?)';
    const data = [title, gitUrl, vidUrl, description, team, hackathon];
    db.query(query, data, (err, packet) => {
      if (err) sendServerError(err, res);
      else {
        const data = [packet.insertId, team, hackathon];
        updateSubmission(data);
      }
    });

    function updateSubmission(data) {
      const query =
        'UPDATE submissions SET projectId = ? WHERE (teamId = ? AND hackathonId = ?)';
      db.query(query, data, (err, packet) => {
        if (err) sendServerError(err, res);
        else res.json({ projectId: data[0] });
      });
    }
  },

  submissions: (req, res) => {
    const query = `
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
            GROUP BY sub.teamId, projects.id, projects.title
            ORDER BY total DESC;
        `;
    db.query(query, req.params.hackId, responder(res, 'submissions'));
  },

  score: (req, res) => {
    const { scores } = req.body;
    req.body.scored = 0;
    for (const score of scores) {
      scoreOne(req, res, score);
    }
  },
};

function scoreOne(req, res, score) {
  console.log(score);
  const { userId } = req.session;
  const {
    projectId,
    ui: uiux,
    presentation: pres,
    idea,
    implementation: impl,
    extra,
    comment,
  } = score;

  const query = 'SELECT id FROM scores WHERE userId = ? AND projectId = ?';
  const data = [userId, projectId];
  db.query(query, data, (err, scores) => {
    const data = [uiux, pres, idea, impl, extra, comment, userId, projectId];
    if (err) sendServerError(err, res);
    else if (scores.length) updateScore(req, res, data);
    else addScore(req, res, data);
  });
}

function addScore(req, res, data) {
  const query = `
        INSERT INTO scores (uiux, pres, idea, impl, extra, comment, userId, projectId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  db.query(query, data, (err, packet) => {
    if (err) sendServerError(err, res);
    else scoreResponse(req, res);
  });
}

function updateScore(req, res, data) {
  const query = `
        UPDATE scores SET uiux = ?, pres = ?, idea = ?, impl = ?, extra = ?, comment = ?
        WHERE userId = ? AND projectId = ?
    `;
  db.query(query, data, (err, packet) => {
    if (err) sendServerError(err, res);
    else scoreResponse(req, res);
  });
}

function scoreResponse(req, res) {
  req.body.scored++;
  if (req.body.scored === req.body.scores.length) {
    res.status(200).json({});
  }
}

function setWinner(res, hackId, winnerId) {
  const query = 'UPDATE hackathons SET winner = ? WHERE id = ?';
  const data = [winnerId, hackId];
  db.query(query, data, (err, packet) => {
    if (err) sendServerError(err, res);
    else res.status(200).json({ winnerId: winnerId });
  });
}
