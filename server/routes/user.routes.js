const router = require('express').Router();
const { userController } = require('../controllers');

module.exports = router
  // =============================================================
  //                      Users / Teams
  // =============================================================

  .get('/logout', userController.logout)
  .get('/isLoggedIn', userController.isLoggedIn);
