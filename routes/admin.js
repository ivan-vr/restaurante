var express = require("express")
var router = express.Router()
var moment = require('moment')
var users = require("./../inc/users")
var admin = require("./../inc/admin")
var menus = require("./../inc/menus")
var reservations = require("./../inc/reservations")
var contacts = require("./../inc/contacts")
var emails = require("./../inc/emails")




module.exports = function(io) {

  moment.locale('pt-br');

  // Inicio Middlewares
  
  router.use(function (req, res, next) {
  
    let naoPrecisaTerSessionUser = ['/login']
  
    // Se pagina precisa ter session user e nao esta logado
    if (naoPrecisaTerSessionUser.indexOf(req.url) === -1 && !req.session.user) {
  
      res.redirect('/admin/login')
  
    } else {
  
      next()
    }
  
  })
  
  
  router.use(function (req, res, next) {
  
    // Eu que incluí esse IF porque nao faz sentido carregar menus se nao 
    // estah autenticado
  
    let naoPrecisaTerSessionUser = ['/login']
  
    if (naoPrecisaTerSessionUser.indexOf(req.url) === 0 && !req.session.user) {
  
      next()
  
    } else {
  
      req.menus = admin.getMenus(req)
  
      next()
  
    }
  })
  
  // Fim Middlewares
  
  
  router.get('/logout', (req, res, next) => {
  
    delete req.session.user
  
    res.redirect('/admin/login')
  })
  
  
  router.get('/', (req, res, next) => {
  
    admin.dashboard().then((data) => {
  
      res.render('admin/index', admin.getParams(req, {
        data
      }))
  
    }).catch((err) => {
      console.log(err);
    })
  
  })
  
  
  
  
  
  router.get('/dashboard', function (req, res, next) {
  
    reservations.dashboard().then((data) => {
  
      res.send(data)
  
    })
  
  })
  
  
  
  
  router.post('/login', (req, res, next) => {
  
    if (!req.body.email) {
      users.render(req, res, 'Preencha o campo o email')
    } else if (!req.body.password) {
      users.render(req, res, 'Preencha a sua senha')
    } else {
  
      users.login(req.body.email, req.body.password)
        .then((user) => {
  
          req.session.user = user
  
          res.redirect("/admin")
  
        })
        .catch((err) => {
  
          users.render(req, res, err.message || err)
        })
    }
  
  
  })
  
  router.get('/login', (req, res, next) => {
  
    users.render(req, res, null)
  
  })
  
  
  router.get('/contacts', (req, res, next) => {
  
    contacts.getContacts().then(data => {
  
      res.render('admin/contacts', admin.getParams(req, {
        data
      }))
  
    })
  
  })
  
  
  router.delete('/contacts/:codigo', function (req, res, next) {
  
    contacts.delete(req.params.codigo)
      .then((results) => {

        io.emit('dashboard update')
  
        res.send(results)
  
      })
      .catch((err) => {
  
        res.send(err)
      })
  
  })
  
  router.get('/emails', (req, res, next) => {
  
    emails.getEmails().then(data => {
  
      res.render('admin/emails', admin.getParams(req, {
        data
      }))
  
    })
  
  })
  
  
  router.delete('/emails/:id', function (req, res, next) {
  
    emails.delete(req.params.id)
      .then((results) => {
  
        io.emit('dashboard update')
        res.send(results)

      })
      .catch((err) => {
  
        res.send(err)
      })
  
  })
  
  
  router.get('/menus', (req, res, next) => {
  
    menus.getMenus().then(data => {
  
      res.render('admin/menus', admin.getParams(req, {
        data
      }))
  
    })
  
  })
  
  
  router.post('/menus', function (req, res, next) {
  
    menus.save(req.fields, req.files)
      .then((results) => {
  
        io.emit('dashboard update')

        res.send(results)
  
      })
      .catch((err) => {
  
        res.send(err)
      })
  
  })
  
  router.delete('/menus/:id', function (req, res, next) {
  
    menus.delete(req.params.id)
      .then((results) => {
  
        io.emit('dashboard update')
        res.send(results)

  
      })
      .catch((err) => {
  
        res.send(err)
      })
  
  })
  
  
  
  router.get('/reservations', (req, res, next) => {
  
    // req.query  -- > Retorna a query string
  
    let start = req.query.start
    let end = req.query.end
    if (!req.query.start) {
      start = moment().subtract(10, 'year').format('YYYY-MM-DD')
    }
    if (!req.query.end) {
      end = moment().format('YYYY-MM-DD')
    }
  
    req.query.start = start
    req.query.end = end
  
    reservations.getReservations(req).then(pag => {
  
      res.render('admin/reservations', admin.getParams(req, {
        date: { start, end },
        data: pag.data,
        moment,
        links: pag.links
      }))
  
    })
  
  })
  
  
  router.get('/reservations/chart', (req, res, next) => {
  
    if (!req.query.start) {
      req.query.start = moment().subtract(10, 'year').format('YYYY-MM-DD')
    }
    if (!req.query.end) {
      req.query.end = moment().format('YYYY-MM-DD')
    }
  
    reservations.chart(req).then((chartData) => {
  
      res.send(chartData)
  
    })
  })
  
  
  
  
  router.post('/reservations', function (req, res, next) {
  
    reservations.save(req.fields)
      .then((results) => {
  
        io.emit('dashboard update')

        res.send(results)
  
      })
      .catch((err) => {
  
        res.send(err)
      })
  
  })
  
  router.delete('/reservations/:id', function (req, res, next) {
  
    reservations.delete(req.params.id)
      .then((results) => {
  
        io.emit('dashboard update')

        res.send(results)
  
      })
      .catch((err) => {
  
        res.send(err)
      })
  
  })
  
  
  
  
  router.get('/users', (req, res, next) => {
  
    users.getUsers().then(data => {
  
      res.render('admin/users', admin.getParams(req, {
        data
      }))
  
    })
  
  })
  
  
  router.post('/users', function (req, res, next) {
  
    users.save(req.fields)
      .then((results) => {
  
        io.emit('dashboard update')
        res.send(results)
  
      })
      .catch((err) => {
  
        res.send(err)
      })
  
  })
  
  router.delete('/users/:codigo', function (req, res, next) {
  
    users.delete(req.params.codigo)
      .then((results) => {
  
        io.emit('dashboard update')
        res.send(results)
  
      })
      .catch((err) => {
  
        res.send(err)
      })
  
  })
  
  
  router.post('/users/password-change', function (req, res, next) {
  
    users.changePassword(req.fields)
      .then((results) => {
  
        res.send(results)
  
      })
      .catch((err) => {
  
        res.send({
          error: err
        })
      })
  
  })
  

  return router
}
