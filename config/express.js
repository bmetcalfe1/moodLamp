/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// Module dependencies
var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var passport = require('passport');
var flash = require('express-flash');
var session = require('express-session');
var methodOverride = require('method-override');
var exphbs = require('express-handlebars');


module.exports = function(app) {


  var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
      ifeq: function(a, b, options) {
        if (a === b) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
      toJSON : function(object) {
        return JSON.stringify(object);
      }
    }
  });

  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');

  app.enable('trust proxy');

  // Only loaded when SECURE_EXPRESS is `true`
  if (process.env.SECURE_EXPRESS)
    require('./security')(app);

  // Configure Express
  app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(express.static(__dirname + '/../public'));
  app.use(expressValidator());
  app.use(flash());
  app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
  app.use(methodOverride('_method'));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});


};
