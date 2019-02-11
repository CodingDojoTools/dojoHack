const router = require('express').Router();
const { serveIndex } = require('./middleware');
// =============================================================
//                      Angular
// =============================================================

module.exports = router.all('*', (req, res) => {
  serveIndex(res);
});
