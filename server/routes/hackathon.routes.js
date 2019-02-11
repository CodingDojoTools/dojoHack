const router = require('express').Router();
const { hackathonController } = require('../controllers');

module.exports = router
  // =============================================================
  //                       Hackathons
  // =============================================================

  .get('/all', hackathonController.all)
  .get('/joined', hackathonController.joined)
  .get('/any/:hackId', hackathonController.anyHack)
  .get('/joined/:hackId', hackathonController.oneJoined)
  .get('/current', hackathonController.current)
  .get('/past', hackathonController.past)
  .get('/:hackId', hackathonController.info)
  .get('/:hackId/submissions', hackathonController.submissions)
  .get('/:hackId/join', hackathonController.join)
  .get('/:hackId/closeJudging', hackathonController.closeJudging)
  .post('/:hackId/addproject', hackathonController.addProject)
  .get('/:hackId/allprojects', hackathonController.getAllProjects);
