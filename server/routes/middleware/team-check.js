// team check
// app.all(safeForTeams, (req, res, next) => {
//   if (req.session.team) {
//     console.log('user ' + req.session.userId + ' is a team');
//     next();
//   } else {
//     console.log('user ' + req.session.userId + ' is not a team');
//     res.status(401).send('Not a team');
//   }
// });

function teamCheck(request, response, next) {
  if (request.session.team) {
    console.log('user ' + request.session.userId + ' is a team');
    return next();
  }
  console.log('user ' + request.session.userId + ' is not a team');
  response.status(401).send('Not a team');
}

module.exports = teamCheck;
