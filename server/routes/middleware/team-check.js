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
  if (req.session.team) {
    console.log('user ' + req.session.userId + ' is a team');
    return next();
  }
  console.log('user ' + req.session.userId + ' is not a team');
  res.status(401).send('Not a team');
}

module.exports = teamCheck;
