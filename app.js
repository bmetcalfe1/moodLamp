/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
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

var express = require('express'),
  app = express(),
  vcapServices = require('vcap_services'),
  extend = require('util')._extend,
  watson = require('watson-developer-cloud');
var expressBrowserify = require('express-browserify');
var mongoose = require('mongoose');

var http = require('http').Server(app);
var io = require('socket.io')(http);


// CONTROLLERS
var userController = require('./server/controllers/user');

// load environment properties from a .env file for local development
require('dotenv').load({silent: true});

// Bootstrap application settings
require('./config/express')(app);
require('./config/passport');

//mongo DB stuff
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
 console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
 process.exit(1);
});


// automatically compile and serve the front-end js
app.get('/js/index.js', expressBrowserify('src/index.js', {
  watch: process.env.NODE_ENV !== 'production'
}));

// For local development, replace username and password
var config = extend({
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api',
  username: process.env.STT_USERNAME || 'e2956133-1aa1-4537-9b3e-c5af1215a9eb',
  password: process.env.STT_PASSWORD || 'qm7Lyv2CghgM'
}, vcapServices.getCredentials('speech_to_text'));

var authService = watson.authorization(config);

app.get('/', function(req, res) {
  res.render('index', {
    ct: req._csrfToken,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID
  });
});

// Get token using your credentials
app.post('/api/token', function(req, res, next) {
  authService.getToken({url: config.url}, function(err, token) {
    if (err)
      next(err);
    else
      res.send(token);
  });
});

app.get('/signup', userController.signupGet);
app.post('/signup', userController.signupPost);

app.get('/login', userController.loginGet);
app.post('/login', userController.loginPost);

//socket.io stuff


io.on('connection', function(socket){
  console.log("user connected!");
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
/*
io.on ('transcript', function (msg) {
    console.log("receiving transcript:", msg)
})
*/
// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
