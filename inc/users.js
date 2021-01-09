var conn = require('./db');

module.exports = {

    render(req, res, error) {

        console.log('users.js - erro --> ', error)

        console.log('users.js - req.body --> ', req.body)


        res.render('admin/login', { 
          body: req.body, 
          error
        })
    
    },

      
    login(email, password) {

        return new Promise((resolve, reject) => {

console.log('email: ',email)

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
    }
}

