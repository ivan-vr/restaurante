//const { query } = require('./db');
var conn = require('./db');
var moment = require('moment');
const  Pagination  = require('./pagination');

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

//  getReservations(page, dtStart, dtEnd) { //req) {


  getReservations(req) {

    return new Promise ((resolve, reject) => {
      
       let page = req.query.page
       let dtStart = req.query.start
       let dtEnd = req.query.end

      if (!page) page = 1

      req.query.page = page

      
      let params = []
      
      if (dtStart && dtEnd) {
  
        params.push(dtStart, dtEnd)
      }
  
  
      let sql = `select sql_calc_found_rows * 
                  from saboroso.tb_reservations 
                  ${(dtStart && dtEnd) ? ' where date between ? and ? ' : ''}
                  order by name 
                  limit ?, ?`
  
      let pag = new Pagination(sql, params) 
  
      pag.getPage(page).then((data) => {
        resolve ({
          data,
          links: pag.getNavigation( req.query) //page, dtStart, dtEnd)  
        })
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
  },


  chart(req) {

    return new Promise ((resolve, request) => {

      sql = `select 
            concat(year(date), '-', month(date)) as date,
            count(*) as total,
            sum(people) / count(*) as avg_people
            from 
            saboroso.tb_reservations
            where 
            date between ? and ?
            group by concat(year(date), '-', month(date)) 
            order by date desc
            `

      conn.query(sql, [req.query.start, req.query.end], (err, results) => {

        if (err) {
          reject(err)
        } else {

          let months = []
          let values = []

          results.forEach(row => {

            months.push(moment(row.date).format('MMM YYYY'))

            values.push(row.total)
            
          })

          resolve({
            months,
            values
          })
          
        }

     })


    })

  },

  dashboard () {
    return new Promise ((resolve, reject) => {

        let sql = `SELECT
                (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
                (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
                (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
                (SELECT COUNT(*) FROM tb_users) AS nrusers;
                `
        conn.query(sql, (err, results) => {

            if (err) {

                reject(err)
            } else {

                resolve(results[0]) 
            }

        })
    })
},



}