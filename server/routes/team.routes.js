const router = require('express').Router();

const { teamController, userController } = require('../controllers');

module.exports = router

  // =============================================================
  //                          Teams
  // =============================================================

  .get('/logged', teamController.get)
  .get('/members', teamController.members)
  .post('/update', teamController.update)
  .post('/addmember', teamController.addMember)
  .post('/isValidMember', teamController.isValidMember)
  .post('/updateMembers', teamController.updateMembers)
  .get('/:teamId/members', teamController.membersById);
