const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'ivan',
  database: 'saboroso',
  password: 'ivanam', //'ivan01$1',
  multipleStatements: true
});

module.exports = connection
