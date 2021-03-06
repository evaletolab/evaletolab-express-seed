// Use a different DB for tests
var app = require("../app");


var db = require('mongoose');
var dbtools = require("./fixtures/dbtools");
var should = require("should");
var data = dbtools.fixtures(["Users.js","Categories.js"]);

var Categories = db.model('Categories');



describe("Categories", function(){
  var _ = require('underscore');
  var category=[];


  before(function(done){
    dbtools.clean(function(e){
      dbtools.load(["../fixtures/Users.js"],db,function(err){
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
  
  
  it("Create catalog ", function(done){
    Categories.create({
      name:"Olivier",
      description:"Ebike makers",
      type:"Catalog"
    },function(err,m){
      m.name.should.equal("Olivier");
      m.description.should.equal("Ebike makers");
      m.type.should.equal("Catalog");
      should.not.exist(err)
      done();
    });

  });

  it("Create category with a wrong type", function(done){
    Categories.create({
      name:"Olivier",
      description:"Ebike makers",
      type:"Pouet"
    },function(err,m){
      should.exist(err);
      err.message.should.equal("Categories validation failed")
      done();
    });

  });

  it("Create categories from array of strings", function(done){
    Categories.create(["Fruits", "Légumes", "Poissons"],function(err,cats){
      should.not.exist(err)
      cats.length.should.equal(3);
      category=cats;  
      //console.log(cats)
      done();
    });
  });

  it("Add duplicate categories structure", function(done){
    Categories.create("Fruits",function(err,cat){
      //console.log(cat)
      should.exist(err);
      done();
    });
  });

  it("Find by name", function(done){
    Categories.findByName("Fruits",function(err,cat){
      should.not.exist(err);
      cat.name.should.equal("Fruits");
      done();
    });
  });

  it("Find inexistant name", function(done){
    Categories.findByName("prfk",function(err,cat){
      should.not.exist(err);
      should.not.exist(cat)
      done();
    });
  });

  it("Maps string array to category", function(done){
    var on=_.map(category,function(v,k){return v._id;});
    Categories.map(on,function(err,cats){
      cats.length.should.equal(3);
      done();
    });      
  });


  it("Maps name array to category", function(done){
    var on=_.map(category,function(v,k){return {name:v.name};});
    Categories.map(on,function(err,cats){
      cats.length.should.equal(3);
      done();
    });      
  });

  it("Maps _id array to category", function(done){
    var oid=_.map(category,function(v,k){return {_id:v._id};});
    Categories.map(oid,function(err,cats){
      cats.length.should.equal(3);
      done();
    });      
  });

  it("Bad element for string array should generate an error", function(done){
    var on=_.map(["FFruits", "Légumes", "Poissons"],function(v,k){return {name:v};});
    Categories.map(on,function(err,cats){
      should.exist(err);
      done();
    });      
  });

  it("Bad format for string array should generate an error", function(done){
    Categories.map(["Fruits", "Légumes", "Poissons"],function(err,cats){
      //console.log("ERROR",err);
      //console.log("RESULT",cats);
      should.exist(err);
      done();
    });      
  });

  it.skip("Products-to-categories structure", function(done){
  });
  
  it.skip("Categories-to-categories structure", function(done){
  });
  
  it.skip("Add/Edit/Remove categories, products, manufacturers, customers, and reviews", function(done){
  });

});

