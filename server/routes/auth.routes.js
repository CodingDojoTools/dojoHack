const router = require('express').Router();
const { userController } = require('../controllers/');

module.exports = router
  .post('/login', (req, res, next) => {
    userController.login(req, res, next, 'teams');
  })
  .post('/register', userController.registerTeam);
