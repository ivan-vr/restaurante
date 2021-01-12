var conn = require('./db');

module.exports = {

  render(req, res, error, success) {

    res.render('reservations', { 
      title: 'Reservas - Restaurante Saboroso' ,
      background: 'images/img_bg_2.jpg',
      h1: 'Reserve uma Mesa!',
      body: req.body, 
      error,
      success
    })

  },

  getReservations() {

    return new Promise((resolve, reject) => {

      let sql = `select * from saboroso.tb_reservations 
                order by date desc, time desc`

      conn.query(sql, (err, results) => {

        if (err) {

          reject(err)

        } else {

          resolve(results)

        }

      })

    })
  },

  save (fields) {

    return new Promise ((resolve, reject) => {

      let sql = ''

      let params = [fields.name, fields.email, fields.people, fields.date, fields.time]

      if (parseInt(fields.id) > 0) {
        // update
        params.push(fields.id)

        sql = `update saboroso.tb_reservations
        set name = ?, email = ?, people = ? , date = ?, time = ?
        where 
        id = ?`

      } else {
        // insert

        if (fields.date.indexOf('/') > -1) {

          let date = fields.date.split('/')
          fields.date = `${date[2]}-${date[1]}-${date[0]}`
        }

        sql = `insert into saboroso.tb_reservations
        (name,email,people,date,time)
        values
        (?,?,?,?,?)`

      }
      conn.query(sql, params, (err, results) => {
        if (err) {
          reject (err)
        } else {
          resolve(results)
        }
      })

    })

  },


  delete(id) {
    return new Promise((resolve, reject) => {

      sql = `delete from saboroso.tb_reservations where id = ?`

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