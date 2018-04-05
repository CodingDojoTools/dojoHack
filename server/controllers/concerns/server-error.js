function sendServerError(error, res) {
  console.log('[SQL error]', error);
  res.status(500).send(error);
}

module.exports = sendServerError;
