const router = require('express').Router();
const { userController, hackathonController } = require('../controllers');

module.exports = router

  // =============================================================
  //                          Admin
  // =============================================================
  .post('/login/admin', userController.login)
  .post('/register/admin', userController.registerAdmin)
  .post('/admin/hackathons', hackathonController.create)
  .post('/admin/score', hackathonController.score);
