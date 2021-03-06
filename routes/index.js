var express = require('express');

var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations');
var contacts = require('./../inc/contacts');
var emails = require('./../inc/emails');

var router = express.Router();


module.exports = function (io) {

  /* GET home page. */
  router.get('/', function (req, res, next) {

    menus.getMenus().then(results => {

      res.render('index', {
        title: 'Restaurante Saboroso',
        menus: results,
        isHome: true
      });

    }).catch((err) => {
      res.send(err)
    })

  })

  /* GET home page. */
  router.get('/contacts', function (req, res, next) {

    contacts.render(req, res)

  })

  /* POST home page. */
  router.post('/contacts', function (req, res, next) {

    if (!req.body.name) {
      contacts.render(req, res, 'Digite o nome')

    } else if (!req.body.email) {
      contacts.render(req, res, 'Digite o email')

    } else if (!req.body.message) {
      contacts.render(req, res, 'Escreva a mensgem')

    } else {

      contacts.save(req.body).then((results) => {

        req.body = {}

        io.emit('dashboard update')

        contacts.render(req, res, null, 'Reserva com sucesso')

      }).catch(err => {

        contacts.render(req, res, err.message)

      })

    }

  })
  /* POST home page. */
  router.post('/subscribe', function (req, res, next) {

    if (!req.body.email) {

      res.send({ error: { message: 'Digite o email' } })

    } else {

      emails.save(req).then((results) => {

        res.send(results)

      }).catch((err) => {

        res.send(err)
      })

    }

  })

  /* GET home page. */
  router.get('/menus', function (req, res, next) {

    menus.getMenus().then(results => {

      res.render('menus', {
        title: 'Menus - Restaurante Saboroso',
        background: 'images/img_bg_1.jpg',
        h1: 'Saboreie nosso menu!',
        menus: results
      })

    }).catch((err) => {
      res.send(err)
    })

  })

  /* GET home page. */
  router.get('/reservations', function (req, res, next) {

    reservations.render(req, res)

  })

  /* POST home page. */
  router.post('/reservations', function (req, res, next) {
    //  res.send(req.body)

    if (!req.body.name) {
      reservations.render(req, res, 'Digite o nome')

    } else if (!req.body.email) {
      reservations.render(req, res, 'Digite o email')

    } else if (!req.body.people) {
      reservations.render(req, res, 'Digite quantas pessoas')

    } else if (!req.body.date) {
      reservations.render(req, res, 'Digite o dia')

    } else if (!req.body.time) {
      reservations.render(req, res, 'Digite a hora')
    } else {

      reservations.save(req.body).then((results) => {

        req.body = {}

        io.emit('dashboard update')

        reservations.render(req, res, null, 'Reserva com sucesso')

      }).catch(err => {

        reservations.render(req, res, err.message)

      })

    }

  })

  /* GET home page. */
  router.get('/services', function (req, res, next) {
    res.render('services',
      {
        title: 'Serviços - Restaurante Saboroso',
        background: 'images/img_bg_1.jpg',
        h1: 'É um prazer poder servir!'
      }
    )
  })


  return router
} 
