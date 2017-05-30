# evaletolab-express-seed
This is the seed of the Krabou CMS backend project. With this project we have a complet seed with those features:
* continuous integration
* complet user management (create, update, forget password, profile, roles, ...)
* mailchimp list subscription (on create user)
* basic CMS :fire:
  * multilingue :love:
  * handle custom menu,
  * handle page type (use default css by type),
  * handle title, tagline, about,
* sendmail when catched errors (vs getsentry.com)
* log activities (optional)

MISSING
* replacing cookies by JWT token


[![Build Status](https://travis-ci.org/evaletolab/evaletolab-express-seed.svg?branch=master)](https://travis-ci.org/evaletolab/evaletolab-express-seed)

## Getting started
This is a backend part of your futur application.

    $ git clone https://github.com/evaletolab/evaletolab-express-seed.git
    $ cd evaletolab-express-seed
    $ npm install
    $ optional edit config-devel|test.js
    $ mongod
    
Testing

    $ sudo npm -g install mocha
    $ NODE_ENV=test ./node_modules/.bin/mocha
    $ (or) make test

Running    

    $ node app

### Continuous integration - Forever & gihub
Each time you do a push your aplication will restart and update all dependencies, Cool!

Install
    $ sudo npm install -g forever

Run
    $ forever start --minUptime 2000 --spinSleepTime 2000 --watchIgnore "*newrelic*" --uid "cms" -w -a -f  -o $HOME/www/logs/node-cms.log  app    
    $ forever list
    info:    Forever processes running
    data:        uid     command         script forever pid   id logfile                            uptime       
    data:    [1] cms     /usr/bin/nodejs app    30454   30460    /home/container/.forever/cms.log     0:0:0:5.429 

Configure gihub webhooks 'On push event'
    1) https://your.api.domain.com/v1/github/webhook    
    2) in your configuration authorize reference (config.admin.webhook.release == branch name)
    3) setup a secret (config.admin.webhook.secret)

## API
Current API version is v1. You need to prepend `v1/` to app requests except auth.

* backend, http://api.cms.evaletolab.ch/v1/config 

### Auth
All requests that change state (`POST`, `PUT`, `DELETE`) require authentication.

#### Get user data
```
  #STATE  #ROUTE                                 #SECURITY                 #API
  app.get('/v1/users/me'                        , auth.ensureAuthenticated, users.me);
  app.get('/v1/users'                           , auth.ensureAdmin        , users.list);
  app.post('/v1/users/:id'                      , users.ensureMe          , users.update);
  app.post('/v1/users/:id/like/:slug'           , users.ensureMe          , users.like);
  app.post('/v1/users/:id/unlike/:slug'         , users.ensureMe          , users.unlike);
  app.post('/v1/users/:id/status'               , auth.ensureAdmin        , users.status);
  app.post('/v1/users/:id/password'             , users.ensureMe          , users.password);
  app.post('/v1/recover/:token/:email/password'                           , users.recover);
  
```
**Example:** http://api.cms.evaletolab.ch/v1/users/me



## Copyright 
* Copyright (c) 2015 Karibou (http://karibou.ch/)
* Copyright (c) 2012 Olivier Evalet (http://evaletolab.ch/)


Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

**The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.**


THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

* more reading http://www.gnu.org/licenses/gpl-violation.fr.html http://www.gnu.org/licenses/why-affero-gpl.fr.html
