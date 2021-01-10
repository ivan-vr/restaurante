var conn = require('./db');

module.exports = {

  getMenus() {

    return new Promise ((resolve, reject) => {

      let sql = 'select * from saboroso.tb_menus order by title'

      conn.query(sql, (err, results) => {
    
        if (err) {
    
          reject(err)
    
        } else {
    
          resolve(results) 
                    
        }

      })
    
    }) 
  }, 

  save (fields, files) {

    return new Promise ((resolve, reject) => {

      let sql = `insert into saboroso.tb_contacts
      (name, email, message)
      values
      (?,?,?)`

      conn.query(sql, 
      [fields.name, fields.email, fields.message],
      (err, results) => {
        if (err) {
          reject (err)
        } else {
          resolve(results)
        }
      })

    })


  }

}
