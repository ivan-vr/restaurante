var path = require('path')
var conn = require('./db');

module.exports = {

  getMenus() {

    return new Promise((resolve, reject) => {

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

  save(fields, files) {

    return new Promise((resolve, reject) => {

      nomeArq = path.parse(files.photo.path).base
      fields.photo = `images/${nomeArq}`

      let sql = '', queryPhoto = ''
      
      let params = [fields.title, fields.description, fields.price]

      if (files.photo.name) {
        queryPhoto = ', photo = ? '
        params.push(fields.photo)
      }

      
      if (parseInt(fields.id) > 0) {

        params.push(fields.id)

        sql = `update saboroso.tb_menus
        set title = ?, description = ?, price = ?${queryPhoto}
        where
        id = ?`
      } else {

        if (!files.photo.name) {
          reject ('Envie a foto do prato.')
        }

        sql = `insert into saboroso.tb_menus
        (title, description, price, photo)
        values
        (?, ?, ?, ?)`
      }

      conn.query(sql, params, (err, results) => {

        if (err) {
          reject(err)
        } else {
          resolve(results)
        }

      })

    })


  }

}
