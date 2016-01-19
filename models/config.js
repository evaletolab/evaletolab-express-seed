
var debug = require('debug')('config');
var assert = require("assert");

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')
  , ObjectId = Schema.ObjectId;
  


var Config = new Schema({
    // instance of config
    cid:{type:String,default:'main',required: true, unique:true, trim:true},


    //
    // display message wheb maintenance (that mean that all shipping are off)
    maintenance:{
      reason:{en:String,fr:String,de:String},
      active:{type:Boolean,default:false}
    },

    //
    // display message on front
    messages:[{
      content:{en:String,fr:String,de:String},
      active:{type: Boolean,default:false},
      updated:{type:Date, default: Date.now}
    }],


    //
    // home
    home:{
      about:{
        en:String,
        de:String,
        fr:String
      },
      siteName:{
        en:String,
        de:String,
        fr:String
      },
      tagLine:{
        en:String,
        de:String,
        fr:String
      },
      footer:{
        en:String,
        de:String,
        fr:String
      },
      image:String,
      views:[{
        name:{en:String,fr:String,de:String},
        weight:Number,
        url:String
      }]
    },

    content:[{
      name:String,
      value:{en:String,fr:String,de:String},
      group:String,
      active:Boolean
    }],

    menu:[{
      name:{en:String,fr:String,de:String},
      url:String,
      weight:Number,
      group:String,
      active:Boolean
    }],

    //
    // defines keys
    keys:{
      pubStripe:String,
      pubGithub:String,
      pubUpcare:String,
      pubMap:String,
      pubDisqus:String
    }
});

Config.statics.getMain=function(cb) {
  var Config=mongoose.model('Config');
  var query=Config.findOne({cid:'main'}).select('-_id -__v');
  //
  // use plain javascript object
  query.lean();
  query.exec(function(err,c){
    if(err){return cb(err)};
    // first time collection is empty
    if(!c){
      return (new Config({})).save(cb)
    }
    return cb(null,c)
  });
}
Config.statics.saveMain=function(c, cb) {
  var Config=mongoose.model('Config');
  Config.findOne({cid:'main'}).select('-__v').exec(function(e,conf){
    if(e){return cb(err)};
    _.extend(conf,c);
    conf.save(function(e,c) {
      _.extend(config.shared,conf.toObject())
      cb(e,c)
    })
  });
}


Config.set('autoIndex', config.mongo.ensureIndex);
module.exports =mongoose.model('Config', Config);


