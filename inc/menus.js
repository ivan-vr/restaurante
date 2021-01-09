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
  }

}
