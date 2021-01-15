var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var redis = require("redis")
var session = require('express-session')
var RedisStore = require('connect-redis')(session)

var formidable = require('formidable')

var http = require ('http')
var socket = require ('socket.io')


var app = express();

var http = http.Server(app)
var io = socket(http)

io.on('connection', (socket) => {

  console.log('novo usuario conectado')

  // io.emit     - para todos os que estão conectados
  // socket.emit - avisa apenas ao usuario que acabou de se conectar

  // io.emit('reservations update', {   
  //   date: new Date()
  // })

})

var indexRouter = require('./routes/index')(io)
var adminRouter = require('./routes/admin')(io)


app.use(function (req, res, next) {

  req.body = {}

  let contentType = req.headers["content-type"];

  if (req.method == 'POST' && contentType.indexOf('multipart/form-data;') > -1) {

    var form = formidable.IncomingForm({
      uploadDir: path.join(__dirname, '/public/images'),
      keepExtensions: true
    })

     form.parse(req, function (err, fields, files) {
      
      req.body = fields
      req.fields = fields
      req.files = files

       next()
     })

  } else {

    next()

  }

})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var redisClient = redis.createClient()

app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  secret: 'passw0rd',
  resave: true,
  saveUninitialized: true
}))

app.use(logger('dev'));
app.use(express.json());
 app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.listen(3000, function() {

  console.log('servidor em execucao')

})

// module.exports = app;
