// Use a different DB for tests
var app = require("../app");

var db = require('mongoose');
var dbtools = require("./fixtures/dbtools");
var should = require("should");require("should-http");
var data = dbtools.fixtures(["Users.js","Categories.js"]);


describe("api.users", function(){
  var request= require('supertest');

  var _=require('underscore');

  var cookie;

  before(function(done){
    dbtools.clean(function(e){
      dbtools.load(["../fixtures/Users.js","../fixtures/Categories.js"],db,function(err){
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
  

  var user;

  it('POST /login should return 200',function(done){  
    request(app)
      .post('/login')
      .send({ email:"evaleto@gluck.com", provider:'local', password:'password' })
      .end(function(err,res){
        res.should.have.status(200);
        res.body.email.address.should.equal("evaleto@gluck.com");
        should.not.exist(res.body.hash)
        should.not.exist(res.body.salt)
        cookie = res.headers['set-cookie'];
        user=res.body;
        //res.headers.location.should.equal('/');
        done();        
      });
  });
   
  it('GET /v1/users/me should return 200',function(done){
    request(app)
      .get('/v1/users/me')
      .set('cookie', cookie)
      .end(function(err,res){
        res.should.have.status(200);
        res.body.id.should.equal(user.id)
        done()
      });

  });

  it('POST update user with empty data {} return 400',function(done){
    request(app)
      .post('/v1/users/'+user.id)      
      .set('cookie', cookie)
      .end(function (err,res) {
        res.should.have.status(400);
        done();
      })
  });

  it('POST update other user without admin role, should return 401',function(done){
    var u=data.Users[0];
    request(app)
      .post('/v1/users/'+data.Users[1].id)      
      .send(u)
      .set('cookie', cookie)
      .end(function (err,res) {
        res.should.have.status(401);
        done();
      })
  });

  it('POST update user, with different user.id silently avoid it',function(done){
    var u=data.Users[0];
    request(app)
      .post('/v1/users/'+user.id)      
      .send(_.extend({},u,{id:0987654}))
      .set('cookie', cookie)
      .end(function (err,res) {
        res.should.have.status(200);
        res.body.id.should.equal(user.id)
        done();
      })
  });

  it('POST update user, with different user.status silently avoid it',function(done){
    var u=data.Users[0];
    request(app)
      .post('/v1/users/'+user.id)      
      .send(_.extend({},u,{status:false}))
      .set('cookie', cookie)
      .end(function (err,res) {
        res.should.have.status(200);
        res.body.status.should.equal(user.status)
        done();
      })
  });

  it('POST update user, with empty user.email.address silently avoid it',function(done){
    var u=data.Users[0];
    request(app)
      .post('/v1/users/'+user.id)      
      .send(_.extend({},u,{email:{status:false}}))
      .set('cookie', cookie)
      .end(function (err,res) {
        res.should.have.status(200);
        res.body.email.address.should.equal(user.email.address)
        done();
      })
  });

  it('POST update user, with different user.email.status silently avoid it',function(done){
    var u=data.Users[0];
    request(app)
      .post('/v1/users/'+user.id)      
      .send(_.extend({},u,{email:{status:false,address:user.email.address}}))
      .set('cookie', cookie)
      .end(function (err,res) {
        res.should.have.status(200);
        res.body.email.status.should.equal(user.email.status)
        res.body.email.address.should.equal(user.email.address)
        done();
      })
  });


     
});

