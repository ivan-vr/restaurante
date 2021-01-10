var path = require('path')
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

      let sql = `insert into saboroso.tb_menus
      (title, description, price, photo)
      values
      (?,?,?, ?)`

      nomeArq = path.parse(files.photo.path).base
      fields.photo =  `images/${nomeArq}`

      conn.query(sql, 
      [fields.title, fields.description, fields.price, fields.photo],
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
