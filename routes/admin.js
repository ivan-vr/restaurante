var express = require("express")
var router = express.Router()
var users = require("./../inc/users")

router.get('/', (req, res, next) => {

  res.render('admin/index')

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

        console.log('admin.js - erro --> ', err)

        users.render(req, res, err.message || err)
      })
  }


})

router.get('/login', (req, res, next) => {

  console.log('users: ', users)

  users.render(req, res, null)

  //  res.render('admin/login')

})

router.get('/contacts', (req, res, next) => {

  res.render('admin/contacts')

})

router.get('/emails', (req, res, next) => {

  res.render('admin/emails')

})

router.get('/menus', (req, res, next) => {

  res.render('admin/menus')

})

router.get('/reservations', (req, res, next) => {

  res.render('admin/reservations', {
    date: {}
  })

})

router.get('/users', (req, res, next) => {

  res.render('admin/users')

})


module.exports = router;
