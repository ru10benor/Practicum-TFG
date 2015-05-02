//MODULOS
var express = require('express'),
    ipfilter = require('ipfilter'),//
    //http = require('http'),//
    // mongooe= require('mongoose');//bbdd 
    mysql= require('mysql');
    //modelos=require('./models');

    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var jadephp = require('jade-php');
var bodyParser = require('body-parser');//

var app = express();

var client=mysql.createConnection({
  user: 'root',
  pasword: 'root',
  database : 'myapp',
  host: 'localhost',
  port: '3306', //07 xampp y 06 mysql
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//filtro de ips
// var ips = ['192.168.1.37']; //'138.100.12.23','138.100.12.53','138.100.12.24'
// app.use(ipfilter(ips, {mode: 'allow'}));

//funciones aux
function toStringQuest(question){
  question=question.replace('text',"");
  question=question.replace(':',"");
  question=question.replace('[{',"");
  question=question.replace('}]',"");
  question=question.replace('help',""); //para la ayuda 
  question=question.replace('nextyes',""); //para nextyes  
  question=question.replace('nextno',""); //para nextno
  question=question.replace('id',""); //para id
 

  var myFinal=false;
  for (var i = 0; i < question.length; i++) {     
    if(question[i]=='"'){
      question=question.replace(question[i],"");
    }
    if(question[i]=='?'){
      i=i+1;
      myFinal=true;
    }
    if(myFinal){
      question=question.replace(question[i],"");
    }
  };
  question=question.replace('rnt',"");
  question=question.replace('"',"");
  return question;
}

function toStringClauses(clauses){
  for (var j = 0; j < clauses.length; j++) {
    if(clauses[j]==':' || clauses[j]=='"' || clauses[j]=='[' || clauses[j]==']' 
      || clauses[j]=='{' || clauses[j]=='}'){
      clauses=clauses.replace(clauses[j],"");
  }
};
  clauses=clauses.replace('id:',"");
  clauses=clauses.replace('tittle:',"");
  clauses=clauses.replace('"',"");
  clauses=clauses.replace('}',"");
  clauses=clauses.replace(',',"  ");
  clauses=clauses.replace('idClause',""); //para idClause
  clauses=clauses.replace(':',""); //para idClause
  clauses=clauses.replace('{',""); //para idClause
  return clauses;
}


//variables globales
var actualQuest='Q01';
var myClauses = new Array();
var newClauses = new Array();
var idClauses = new Array();
var render= new Array();
var tittleApp='MyApp';
var nameProj;
var nextQuest;
var idProj=0;
var idAns=1;
var myHistoric = new Array(); //Array providedAns
var myQuestion;


insertProject = function(idProj, name, description,callback) {
    client.query('INSERT INTO projects(id,name,description) VALUES(?,?,?)',[idProj,name,description],function(err,results,fields){
        callback(err, results);
    });
};
insertAnswers = function(idAns, idQuest, idProj, answer,callback) {
  client.query('INSERT INTO answers(id,idQuest,idProj,answer) VALUES(?,?,?,?)',[idAns,actualQuest,idProj,answer],function(err,results,fields){
        callback(err, results);
    });
};
getQuestion = function(actualQuest, callback) {
    client.query('SELECT text FROM questions WHERE id='+'"'+actualQuest+'"',function(err,results,fields){ 
        callback(err, results);
    });
};
getHelp = function(actualQuest, callback) {
    client.query('SELECT help FROM questions WHERE id='+'"'+actualQuest+'"',function(err,results,fields){
        callback(err, results);
    });
}; 
getQuestionAns = function(nextAns,actualQuest, callback) {
    client.query('SELECT '+nextAns+' FROM questions WHERE id='+'"'+actualQuest+'"',function(err,results,fields){ 
        callback(err, results);
    });
};
//load home
app.get('/', function(req, res){
  res.render('page1', {title: 'MyApp'});
});

app.post('/',function(req,res){
  var name=req.body.name;
  nameProj=name;
  var description=req.body.description;

  idProj=idProj+1;
  actualQuest='Q01';

  insertProject(idProj, name, description, function(err, results){});

  var myHelp;

  getQuestion(actualQuest, function(err, results){
    myQuestion = JSON.stringify(results);
    myQuestion = toStringQuest(myQuestion);
    //console.log('LA PREGUNTA ES: '+myQuestion);
  });
  getHelp(actualQuest, function(err, results){
    myHelp = JSON.stringify(results);
    myHelp=toStringQuest(myHelp);
    //console.log('LA PREGUNTA ES: '+myHelp);
  });

  client.query('SELECT id, tittle FROM clauses WHERE id="05.2" or id="05.3" or id="05.4" or id="05.7" or id="05.8" or id="05.9"',function(err,results,fields){
    if(err){
      throw err;
    }
    //Array de strings con results var myClauses = new Array();
    for (var i = 0; i < results.length; i++) {
      myClauses[i] = JSON.stringify(results[i]);
      myClauses[i]= toStringClauses(myClauses[i]); //Poner clauses formato adecuado
    };
    render=[tittleApp,name,myQuestion,myHelp,myClauses];
    res.render('page2', {title:render[0],h3:'Evaluation Project: '+render[1],currentQuestion:render[2],help:render[3],clauses:render[4].join('\n')});
    });   
});

app.post('/next',function(req,res){
  var answer=req.body.answer;
  var nextAns;
  var historic;
  var myHelp2;
   if(answer=='No'){

    insertAnswers(idAns, actualQuest, idProj,answer, function(err, results){});
    idAns=idAns+1;

    historic = '['+answer+'] -> '+myQuestion;
    myHistoric = myHistoric.concat(historic);
    
    nextAns='nextno';
    getQuestionAns(nextAns,actualQuest, function(err, results){
      //Poner pregunta formato adecuado
      nextQuest = JSON.stringify(results);
      nextQuest=toStringQuest(nextQuest);
      nextQuest=nextQuest.replace('"',"");

      actualQuest=nextQuest;      //console.log('LA PREGUNTA ES: '+myQuestion);
      if(nextQuest!=''){
        getQuestion(actualQuest, function(err, results){
          myQuestion = JSON.stringify(results);
          myQuestion = toStringQuest(myQuestion);
          //console.log('LA PREGUNTA SIGUIENTE A MOSTRAR ES111111111: '+myQuestion);
          getHelp(actualQuest, function(err, results){
            myHelp2 = JSON.stringify(results);
            myHelp2 = toStringQuest(myHelp2);
            //console.log('LA PREGUNTA ES: '+myHelp);
            render=[myQuestion,myHelp2,myClauses,myHistoric];
            res.send(render);
          });
        });
      }else{
        //res.send('F');
        res.redirect('/results');   
      }
    });  

   }else{ //el usuario responde si y si no responde se considera si
    answer='Yes';

    insertAnswers(idAns, actualQuest, idProj,answer, function(err, results){});
    idAns=idAns+1;
    historic = '['+answer+'] -> '+myQuestion;
    myHistoric = myHistoric.concat(historic);
    client.query('SELECT idClause FROM clauses_question WHERE idQuest='+'"'+actualQuest+'"',function(err,results,fields){ 
      if(err){
        throw err;
      }
          for (var i = 0; i < results.length; i++) {
            idClauses[i] = JSON.stringify(results[i]);
            idClauses[i]= toStringClauses(idClauses[i]); //Poner id de clauses formato adecuado
            client.query('SELECT id, tittle FROM clauses WHERE id='+'"'+idClauses[i]+'"',function(err,results,fields){ 
              if(err){
                throw err;
              }
              newClauses = JSON.stringify(results);
              newClauses = toStringClauses(newClauses); //Poner clauses formato adecuado 
              myClauses=myClauses.concat(newClauses); 
            });         
          };
    });
    nextAns='nextno';
    getQuestionAns(nextAns,actualQuest, function(err, results){
      //Poner pregunta formato adecuado
      nextQuest = JSON.stringify(results);
      nextQuest=toStringQuest(nextQuest);
      nextQuest=nextQuest.replace('"',"");

      actualQuest=nextQuest;      //console.log('LA PREGUNTA ES: '+myQuestion);
      if(nextQuest!=''){
        getQuestion(actualQuest, function(err, results){
          myQuestion = JSON.stringify(results);
          myQuestion = toStringQuest(myQuestion);
          //console.log('LA PREGUNTA SIGUIENTE A MOSTRAR ES111111111: '+myQuestion);
          getHelp(actualQuest, function(err, results){
            myHelp2 = JSON.stringify(results);
            myHelp2 = toStringQuest(myHelp2);
            //console.log('LA PREGUNTA ES: '+myHelp);
            render=[myQuestion,myHelp2,myClauses,myHistoric];
            res.send(render);
          });
        });
      }else{
        //res.send('F');
        res.redirect('/results');   
      }
    });  
   }  
});

//load results
  app.get('/results', function(req, res){
    res.render('page3', {title: 'MyApp'});
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

app.listen(8000);

console.log('Server is running');//138.100.12.23:8000 //192.168.1.37:8000


module.exports = app;




