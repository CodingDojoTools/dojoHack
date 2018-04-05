const serveIndex = require('./concerns/send-index');
// session check for all routes but /login, /register & /
// app.all(
//   /^\/(?!login|register|teams\/isValidMember|locations|$).*$/,
//   (req, res, next) => {
//     if (req.session.userId) {
//       console.log('user ' + req.session.userId + ' is logged in');
//       next();
//     } else {
//       console.log('user ' + req.session.userId + ' is not logged in');
//       res.status(401).sendFile(path.resolve('./public/dist/index.html'));
//       // res.status(401).send("Not logged in");
//     }
//   }
// ),

function sessionCheck(request, response, next) {
  if (request.session.userId) {
    console.log('user ' + request.session.userId + ' is logged in');
    return next();
  }
  console.log('user ' + request.session.userId + ' is not logged in');
  // res.status(401).sendFile(path.resolve('./public/dist/index.html'));
  serveIndex(response, 401);
  // res.status(401).send("Not logged in");
}

module.exports = sessionCheck;
