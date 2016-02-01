

  
module.exports = function(app, config, passport) {
  var path='../controllers/';

  var api       = require(path+'api');
  var auth 			= require(path+'auth');
  var home 			= require(path+'home');
  var users 	  = require(path+'users');
  var emails    = require(path+'emails');
  var docs      = require(path+'documents');
  // var categories= require(path+'categories');
  var _         = require('underscore');


  //
  // wrap a request to a simple queuing system. 
  // It's not efficient, but this should avoid race condition on product and orders
  var queue=require('../app/queue')(1,true);
  var queued=function(f){
    return function(req,res){
      queue.defer(f,req,res)
    }
  }

  function nocached(req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=0');
    return next();
  }


  function cached(req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=120');
    return next();
  }
	
  function longcached(req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=120000');
    return next();
  }
  
	
  //
  // auth 
  app.get ('/logout', auth.logout);
 	app.get ('/login', auth.login);
  app.post('/login', queued(auth.login_post));
  app.get ('/register', auth.register);
  app.post('/register', queued(auth.register_post));

  //
  // sitemap & robots
  app.get ('/sitemap.xml', api.sitemap);
  app.get ('/seo/sitemap.xml', api.sitemap);
  app.get ('/robots.txt', api.robots);
  app.get ('/seo/robots.txt', api.robots);
  
  //
  // documents
  app.get ('/v1/documents', auth.ensureAuthenticated, docs.findByOwner);
  app.get ('/v1/documents/category/:category', docs.findByCategory);
  app.get ('/v1/documents/:slug', docs.get);
  // documents update/create
  app.post('/v1/documents/:slug', auth.ensureAuthenticated, docs.ensureOwnerOrAdmin,docs.update);
  app.post('/v1/documents', auth.ensureAuthenticated,docs.create);


  //
  // activities
  app.get('/v1/activities', auth.ensureAuthenticated,api.activities);

  


  //
  // user
  app.get('/v1/users/me', auth.ensureAuthenticated, users.me);
  app.get('/v1/users', auth.ensureAdmin, users.list);
  app.get('/v1/users/sessions', auth.ensureAdmin,api.sessions);
  app.post('/v1/users/:id', users.ensureMeOrAdmin,users.update);
  app.post('/v1/users/:id/like/:sku', users.ensureMe,users.like);
  app.post('/v1/users/:id/unlike/:sku', users.ensureMe,users.unlike);
  app.post('/v1/users/:id/status', auth.ensureAdmin,users.status);
  app.post('/v1/users/:id/password',users.ensureMe, users.password);

  
  // recover email  
  app.post('/v1/recover/:token/:email/password', users.recover);
  
  //
  // delete
  app.put('/v1/users/:id', auth.ensureAdmin, auth.checkPassword, users.remove);

	//
	// home
  app.get ('/', home.index(app));
  app.get ('/welcome', home.welcome);
  app.get ('/v1', api.index(app));

  //
  // SEO
  // app.get('/products/:sku',products.getSEO);
  app.get('/seo',home.SEO);

  //
  // system
  app.get ('/v1/config', nocached, api.config);
  app.post('/v1/config', auth.ensureAdmin, api.saveConfig);
  app.post('/v1/trace/:key', api.trace);
  app.post('/v1/comment', api.email);
  // temporary path for subscription
  app.post('/v1/message/:key/:subject?', api.message);
  app.post('/v1/github/webhook',api.github)


  
  //
  // email validation
  app.get ('/v1/validate',auth.ensureAuthenticated, emails.list);
  app.post('/v1/validate/create',auth.ensureAuthenticated, emails.create);
  app.get ('/v1/validate/:uid/:email', emails.validate);
  
  //
  // category
  // app.get ('/v1/category', cached, categories.list);
  // app.get ('/v1/category/:category', categories.get);
  // app.post('/v1/category', auth.ensureAdmin, categories.create);
  // app.post('/v1/category/:category', auth.ensureAdmin, categories.update);
  // app.put('/v1/category/:category', auth.ensureAdmin, auth.checkPassword, categories.remove);
  
  

};
