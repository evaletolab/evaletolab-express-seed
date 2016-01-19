// Use a different DB for tests
// Use a different DB for tests
var app = require("../app");

var db = require("mongoose");

var dbtools = require("./fixtures/dbtools");
var should = require("should");
var data = dbtools.fixtures(["Users.js","Categories.js"]);
var Users=db.model('Users');

describe("users.likes", function(){
  var async= require("async");
  var _ = require("underscore");

  // common befor/after
  before(function(done){
    dbtools.clean(function(e){
      dbtools.load(["../fixtures/Users.js","../fixtures/Categories.js"],db,function(err){
        should.not.exist(err);
        done();
      });
    });      
  });


  it("Customer likes a product ", function(done){
    var like_slug="test1";
    async.waterfall([
      function(cb){
        Users.findOne({"email.address":"evaleto@gluck.com"},function(err,user){
          should.not.exist(err);
          cb(err,user)
        });
      },
      function(user,cb){
        user.addLikes(like_slug,function(err){
          cb(err);
        });
      }
      ,
      function(cb){
        Users.findOne({"email.address":"evaleto@gluck.com"}).exec(function(err,user){
          should.exist(user.likes.length);
          //console.log(user);
          cb(null,user);
        });
      }]
      ,    
      function(err,user){
        should.not.exist(err);
        //FIXME once likes was NULL ??? check this if it repeats
        user.likes[0].should.equal(like_slug);
        done();
      });
  });

  it("Customer unlikes a product ", function(done){
    var like_slug="test1";
    Users.findOne({"email.address":"evaleto@gluck.com"},function(err,user){
        should.exist(user);
        user.removeLikes(like_slug, function(err){
          should.not.exist(err)
          Users.findOne({"email.address":"evaleto@gluck.com"}).exec(function(err2,user){
            user.likes.length.should.equal(0);
            done();
          });
        });
    });
  });




});

