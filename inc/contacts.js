var conn = require('./db');

module.exports = {

  
  render(req, res, error, success) {

    res.render('contacts', { 
      title: 'Contatos - Restaurante Saboroso',
      background: 'images/img_bg_3.jpg',
      h1: 'Diga um oi!',
      body: req.body, 
      error,
      success 
    })
    
  },
  

  save (fields) {

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

  },


  getContacts() {

    return new Promise((resolve, reject) => {

      let sql = 'select * from saboroso.tb_contacts order by register desc'

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

      sql = `delete from saboroso.tb_contacts where id = ?`

      conn.query(sql, [id], (err, results) => {

        if (err) {
          reject(err)
        } else {
          resolve(results)
        }

      })

    })
  }


}
