var conn = require('./../inc/db');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  let sql = 'select * from saboroso.tb_users'

  conn.query(sql, (err, results) => {
    if (err) {
      res.send('ERRO !!! ===: ', err)
    } else {
      res.send(results)
    }
  })

});

module.exports = router;
