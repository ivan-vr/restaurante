var conn = require('./db');

module.exports = {

    render(req, res, error) {

        res.render('admin/login', { 
          body: req.body, 
          error
        })
    
    },

      
    login(email, password) {

        return new Promise((resolve, reject) => {

            let sql = 'select * from saboroso.tb_users where email = ?'

            conn.query(sql, [email], (err, results) => {
          
              if (err) {
          
                reject(err)
          
              } else {
          
                if (results.length == 0 ) {
                    reject ('Usuário ou senha incorretos.')
                } else {
                    let row = results[0]
                    if (row.password !== password) {
                        reject ('Usuário ou senha incorretos.')
                    } else {
                        resolve(row) 
                    
                    }
                    
                }
                          
              }
      
            })
        })
    },

    save (fields) {

      return new Promise ((resolve, reject) => {
  
        let sql = ''
  
        let params = [fields.name, fields.email]
  
        if (parseInt(fields.id) > 0) {
          // update

          params.push(fields.id)
  
          sql = `update saboroso.tb_users
          set name = ?, email = ?
          where 
          id = ?`
  
        } else {
          // insert

          params.push(fields.password)
  
          sql = `insert into saboroso.tb_users
          (name, email, password)
          values
          (?, ?, ?)`
  
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
  
        sql = `delete from saboroso.tb_users where id = ?`
  
        conn.query(sql, [id], (err, results) => {
  
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
  
        })
  
      })
    },
  
    getUsers() {

      return new Promise((resolve, reject) => {
  
        let sql = `select * from saboroso.tb_users 
                  order by name`
  
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

