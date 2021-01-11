var express = require("express")
var router = express.Router()
var users = require("./../inc/users")
var admin = require("./../inc/admin")
var menus = require("./../inc/menus")


// Middleware

router.use(function(req, res, next) {

  let semAutenticacao = ['/login']

  // Se pagina precisa de login e nao esta logado
  if (semAutenticacao.indexOf(req.url) === -1 && !req.session.user) {

     res.redirect('/admin/login')
   } else {
    
     next()
   }
  
})


router.use(function(req, res, next) {

  req.menus = admin.getMenus(req)

  next() 

})


router.get('/logout', (req, res, next) => {

  delete req.session.user

  res.redirect('/admin/login')  
})


router.get('/', (req, res, next) => {

  admin.dashboard().then ((data) => {

    res.render('admin/index', admin.getParams (req, {
      data
    }))

  }).catch ((err) =>  {
    console.log(err);
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

  res.render('admin/contacts', admin.getParams (req))

})

router.get('/emails', (req, res, next) => {

  res.render('admin/emails', admin.getParams (req))

})

router.get('/menus', (req, res, next) => {

  menus.getMenus().then(data => {

    res.render('admin/menus', admin.getParams (req, {
      data
    }))

  })

})

router.post('/menus', function (req, res, next) {

  menus.save(req.fields, req.files)
  .then((results) => {

    res.send(results)

  })
  .catch((err) => {

    res.send(err)
  })

})

router.get('/reservations', (req, res, next) => {

  res.render('admin/reservations', admin.getParams (req, { 
    date: {}
  }))

})

router.get('/users', (req, res, next) => {

  res.render('admin/users', admin.getParams (req))

})


module.exports = router;
