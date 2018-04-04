const router = require('express').Router();

const adminRouter = require('./admin.routes');
const authRouter = require('./auth.routes');
const catchAll = require('./catch-all.routes');
const hackathonRouter = require('./hackathon.routes');
const locationRouter = require('./location.routes');
const teamRouter = require('./team.routes');
const userRouter = require('./user.routes');
const projectRouter = require('./project.routes');

const { adminCheck, logger, sessionCheck, teamCheck } = require('./middleware');

// =============================================================

//                  Postman collection link

// https://www.getpostman.com/collections/c3d1292b181c6c40672b

// =============================================================

// =============================================================
//                     Middleware routes
// =============================================================
// if you need a route to be checked for admin or team session,
// add it to the corresponding array.
// If session is not found, {status: false} will be returned

const safeForTeams = [
  '/hackathons/:hackId/join',
  '/hackathons/:hackId/addproject',
];

// =============================================================

// Code
// 401 : Unauthorized
// 409 : Validations
// 500 : Server error

module.exports = router
  .use(logger)
  .all(/^\/admin(\/.*)?/, adminCheck)
  .all(
    /^\/(?!login|register|teams\/isValidMember|locations|$).*$/,
    sessionCheck
  )
  .all(safeForTeams, teamCheck)
  .use(authRouter)
  .use(adminRouter)
  .use('/hackathons', hackathonRouter)
  .use(locationRouter)
  .use('/teams', teamRouter)
  .use('/projects', projectRouter)
  .use(userRouter)
  .use(catchAll);
