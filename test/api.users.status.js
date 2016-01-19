// Use a different DB for tests
var app = require("../app");

var db = require('mongoose');
var dbtools = require("./fixtures/dbtools");
var should = require("should");require("should-http");
var data = dbtools.fixtures(["Users.js","Categories.js"]);


describe("api.users.status", function(){
  var request= require('supertest');
  var _=require('underscore');

  var cookie, gluck;

  before(function(done){
    dbtools.clean(function(e){
      dbtools.load([
        "../fixtures/Categories.js",
        "../fixtures/Users.js"],db,function(err){
        should.not.exist(err);
        done();
      });
    });      
  });

  
  after(function(done){
    dbtools.clean(function(){    
      done();
    });    
  });
  

  it('user.admin /login return 200',function(done){  
    request(app)
      .post('/login')
      .send({ email: "evaleto@gmail.com", password:'password', provider:'local' })
      .end(function(err,res){        
        res.should.have.status(200);
        cookie = res.headers['set-cookie'];
        done();        
      });
  });

  it('user.user /login return 200',function(done){  
    request(app)
      .post('/login')
      .send({ email: "evaleto@gluck.com", password:'password', provider:'local' })
      .end(function(err,res){
        res.should.have.status(200);
        gluck = res.headers['set-cookie'];
        done();        
      });
  });
   
  it('users.list anonymous /v1/users should return 401',function(done){
    request(app)
      .get('/v1/users')
      .end(function(err,res){  
        res.should.have.status(401);
        done();        
      });
    });

  it('users.list admin /v1/users should return 200',function(done){
    request(app)
      .get('/v1/users')
      .set('cookie', cookie)
      .end(function(err,res){  
        res.should.have.status(200);
        done();        
      });
    });



  it('users.post status FALSE /v1/users/:id/status should return 200 ',function(done){
    request(app)
      .post('/v1/users/12345/status')
      .set('cookie', cookie)
      .send({status:false})
      .end(function(err,res){  
        res.should.have.status(200);
        res.body.status.should.not.equal(true)
        done();        
      });
  });

      
});


