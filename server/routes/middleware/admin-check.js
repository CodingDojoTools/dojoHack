// admin check
// app.all(/^\/admin(\/.*)?/, (req, res, next) => {
//   if (req.session.admin) {
//     console.log('user ' + req.session.userId + ' is admin');
//     next();
//   } else {
//     console.log('user ' + req.session.userId + ' is not admin');
//     res.status(401).send('Not an admin');
//   }
// }),

function adminCheck(request, response, next) {
  if (req.session.admin) {
    console.log('user ' + req.session.userId + ' is admin');
    return next();
  }
  console.log('user ' + req.session.userId + ' is not admin');
  res.status(401).send('Not an admin');
}

module.exports = adminCheck;
