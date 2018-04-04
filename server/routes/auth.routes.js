const router = require('express').Router();
const { userController } = require('../controllers/');

module.exports = router
  .post('/login', (req, res) => {
    userController.login(req, res, 'teams');
  })
  .post('/register', userController.registerTeam);
