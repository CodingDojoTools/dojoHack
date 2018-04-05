// app.all(/^/, (req, res, next) => {
//   console.log(req.originalUrl);
//   next();
// });

function logger(request, response, next) {
  console.log(request.originalUrl);
  next();
}

module.exports = logger;
