const path = require('path');

function sendIndex(response, status = 200) {
  response.status(status).sendFile(path.resolve('public/dist/index.html'));
}

module.exports = sendIndex;
