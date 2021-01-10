var conn = require('./db');

var verificacao = 'verificacao 1'

var verificacao = 'verificacao 2'

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

  }

}
