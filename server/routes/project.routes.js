const router = require('express').Router();
const { hackathonController } = require('../controllers');

module.exports = router
  .get('/:projectId', hackathonController.getProject)
  .get('/:projectId/scores', hackathonController.getProjectScores);
