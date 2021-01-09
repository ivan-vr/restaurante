const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'ivan',
  database: 'saboroso',
  password: 'ivanam'
  //, insecureAuth : true
});

module.exports = connection
