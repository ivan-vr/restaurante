const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'ivan',
  database: 'saboroso',
  password: 'ivan01$1'
  //, insecureAuth : true
});

module.exports = connection
