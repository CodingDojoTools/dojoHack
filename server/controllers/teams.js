const bcrypt = require('bcrypt');

const { responder, sendServerError } = require('./concerns');
const { db, pQuery } = require('../config/mysql.js');
const { isEmpty } = require('../utils');

module.exports = {
  get: (req, res) => {
    const query = `
            SELECT teams.name, l.name as location FROM teams
            JOIN locations AS l on l.id = teams.location
            WHERE teams.id = ?
        `;
    db.query(query, req.session.userId, (err, data) => {
      if (err) sendServerError(err, res);
      else res.json({ team: data[0] });
    });
  },

  addMember: (req, res) => {
    const { firstName, lastName } = req.body;

    if (isEmpty(firstName) || isEmpty(lastName)) {
      console.log('first nand last name required', firstName, lastName);
      return res
        .status(409)
        .json({ error: 'First and Last name are required' });
    }

    const query =
      'INSERT INTO members (firstName, lastName, team) VALUES (?, ?, ?)';
    const data = [firstName, lastName, req.session.userId];
    db.query(query, data, responder(res, 'member'));
  },

  isValidMember: (req, res) => {
    const { firstName, lastName } = req.body;

    if (!isEmpty(firstName) && !isEmpty(lastName)) {
      return res.json();
    }

    res.status(409).json();
  },

  membersById: (req, res) => {
    const query = 'SELECT * FROM members WHERE team = ?';
    db.query(query, req.params.teamId, responder(res, 'members'));
  },

  members: (req, res) => {
    const query = 'SELECT * FROM members WHERE team = ?';
    db.query(query, req.session.userId, responder(res, 'members'));
  },
  update: (req, res) => {
    const query = 'UPDATE teams SET name = ?, location = ? WHERE id = ?';
    const data = [req.body.teamName, req.body.location, req.session.userId];

    pQuery(query, data)
      .then(update => res.json({ update }))
      .catch(() => res.status(500).json({ message: 'We could not update' }));
  },

  updateMembers: (req, res) => {
    console.log('In the updateMembers');
    const { members } = req.body;
    const { userId: teamID } = req.session;
    const query =
      'UPDATE members SET firstName = ?, lastName = ? WHERE id = ? AND team = ?';
    const promises = members.map(member =>
      pQuery(query, [member.firstName, member.lastName, member.id, teamID])
    );

    Promise.all(promises)
      .then(() => res.json({ update: true }))
      .catch(error => {
        console.log(`Error Updating Members::`, error);
        res.status(500).json({ update: false });
      });
  },
};
