//MODULOS
var express = require('express'),
    ipfilter = require('ipfilter');
    http = require('http');  
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');//
var ejs = require('ejs');//

//var routes = require('./routes/index'); //
//var users = require('./routes/users');

var app = express();


var server=http.createServer(app);

//crear servidor y sockets

//var sock=require('socket.io')(server); 

// view engine setup
app.set('views', path.join(__dirname, 'views')); //con esto funcionan los jades
app.set('view engine', 'jade');


// app.set('view engine', 'html');  
// app.set('views', path.join(__dirname, 'views')); 
// app.engine('html', ejs.renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //con esto funciona los JavaScripts
//app.use(express.static(path.join(__dirname, '/')));


app.get('/', function(req, res){
  res.render('page1', {title: 'MyApp'});
});

//cargo el jade (PARTE SERVIDORA)
//app.get('/', function(req, res){
//  res.render('page2', {title: 'MyApp'});
//});

//REDIRIGIR DE PAGE1 A PAGE2
app.post('/next', function(req,res){
   console.log(req.body.name);
   res.render('page2');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//Desarrollo de la app
server.listen(8000);
console.log('Server is running');

module.exports = app; //extraer el modulo app








