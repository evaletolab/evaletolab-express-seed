#!/bin/env node
//
// check links
// https://github.com/madhums/node-express-mongoose-demo
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
// mongo/express sample 
// https://gist.github.com/1025038
// dynamic helpers
// http://stackoverflow.com/questions/6331776/accessing-express-js-req-or-session-from-jade-template
// http://stackoverflow.com/questions/11580796/migrating-express-js-2-to-3-specifically-app-dynamichelpers-to-app-locals-use

//
// start newrelic logs here
//require('newrelic');

if(process.env.NODETIME_KEY){
  var nodetime=require('nodetime').profile({
      accountKey:process.env.NODETIME_KEY, 
      appName: process.env.NODETIME_APP
  });
}


//
// load env
var express = require('express')
  , fs = require('fs')
  , passport = require('passport')

  , env = process.env.NODE_ENV || 'development'
  , config = require('./app/config')
  , mongoose = require('mongoose')
  , _ = require('underscore');


//
// open database
mongoose.connect(config.mongo.name,{server:{safe:true, auto_reconnect:true}},function(e){  
    //double check for database drop
    console.log("boot[",new Date(),"] :",mongoose.connection.db.databaseName, config.mongo.name)

    if(process.env.NODE_ENV!=='test'){
      console.time("running db maintain")
      require('./app/db.maintain').update(mongoose.connection.db,function(err,log){
        if(err){
          console.log("ERROR",err)
        }
        console.timeEnd("running db maintain")
      });            
    }

    if(config.dropdb && process.env.NODE_ENV==='test'){
      mongoose.connection.db.dropDatabase(function(err,done){
      });
    }
});


// load models
files = require("fs").readdirSync( './models' );
for(var i in files) {
  if(/\.js$/.test(files[i])) require('./models/'+files[i]);
}

// extend config right after db is ready
mongoose.model('Config').getMain(function(err,c){
  if(err){
    console.log('Ooops error when reading stored config',err)
    process.exit(1)    
  }
  _.extend(config.shared,c)
})

var app = express()


// utils 
require('./app/utils')(app);

// Events Bus
var bus=require('./app/bus');require('./app/bus.routes');

// mailer
require('./app/mail')(app,bus);
  


// express settings
require('./app/express')(app, config, passport)

// bootstrap passport config
require('./app/passport')(app, config, passport)

// Bootstrap routes
require('./app/routes')(app, config, passport)


console.log("generate random key:",require('crypto').randomBytes(32).toString('base64'))

//
// maintain db
//
//
//
// start the server
var host = (process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || config.express.host || 'localhost');


//
// manage unmanaged exception
process.on('uncaughtException', function(err) {

  if(process.env.NODE_ENV==='production'){
    var msg=(err.stack)?err.stack:JSON.stringify(err,null,2);
    bus.emit('sendmail',"evaleto@gmail.com",
         "[evaletolab-seed] uncaughtException "+err.toString(), {content:msg}, "simple",
    function (err,status) {
      console.log(err,status)
      process.exit(1)
    });

  }
  console.log("uncaughtException",err.stack);
});


app.listen(app.get('port'),host).on('connection', function(socket) {
})

// expose app
exports = module.exports = app





