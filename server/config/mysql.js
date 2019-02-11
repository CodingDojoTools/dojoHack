const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DBHOST,
  port: process.env.PORT,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true,
});

function pQuery(query, data) {
  return new Promise(function(resolve, reject) {
    connection.query(query, data, function(error, data) {
      if (error) {
        return reject(error);
      }
      resolve(data);
    });
  });
}

module.exports = {
  db: connection,
  connection,
  pQuery,
};
