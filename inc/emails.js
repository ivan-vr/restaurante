var conn = require('./db');

module.exports = {

    getEmails() {
  
      return new Promise((resolve, reject) => {
  
        let sql = 'select * from saboroso.tb_emails order by register desc'
  
        conn.query(sql, (err, results) => {
  
          if (err) {
  
            reject(err)
  
          } else {
  
            resolve(results)
  
          }
  
        })
  
      })
    },
  
    delete(id) {
      return new Promise((resolve, reject) => {
  
        sql = `delete from saboroso.tb_emails where id = ?`
  
        conn.query(sql, [id], (err, results) => {
  
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
  
        })
  
      })
    },



  save (req) {

    return new Promise ((resolve, reject) => {

        let sql = `insert into saboroso.tb_emails
        (email)
        values
        (?)`

        conn.query(sql, [req.fields.email],(err, results) => {
          if (err) {
            reject (err.message)
          } else {
            resolve(results)
          }
        })

    })

  }
  

}
  