const router = require('express').Router();
const { userController } = require('../controllers');

module.exports = router

  // =============================================================
  //                          Locations
  // =============================================================
  .get('/locations', userController.locations);
