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

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var vcapServices = require('vcap_services');
var extend = require('util')._extend;
var watson = require('watson-developer-cloud');
var expressBrowserify = require('express-browserify');
var mongoose = require('mongoose');
var _ = require('lodash');

// CONTROLLERS
var userController = require('./server/controllers/user');
var lightController = require('./server/controllers/mockapi');
var meetingController = require('./server/controllers/meeting');

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
  res.render('microphone', {
    ct: req._csrfToken
  });
});

app.get('/microphone', function(req, res) {
  res.render('microphone', {
    ct: req._csrfToken
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

app.get('/api/userdata', function(req, res) {
    if (req.user === undefined) {
        // The user is not logged in
        res.json({});
    } else {
        res.json({
            user: req.user
        });
    }
});

app.get('/signup', userController.signupGet);
app.post('/signup', userController.signupPost);

app.get('/login', userController.loginGet);
app.post('/login', userController.loginPost);

app.get('/meetings', meetingController.getAllMeetings);
app.post('/meetings', meetingController.create);
app.get('/meeting/:id', meetingController.show);
app.put('/meeting/:id', meetingController.update);

app.get('/logout', userController.logout);

app.get('/forgot', userController.forgotGet);
app.post('/forgot', userController.forgotPost);

app.get('/reset', userController.resetGet);
app.post('/reset', userController.resetPost);

app.get('/about', userController.goToAbout);

//Gravatar shift
app.get('/gravatar', userController.getGravatar);

//socket.io stuff
app.post('/lightItUp', lightController.lightItUp);
app.get('/lightItUp', lightController.getEmoColor);

// SOCKET stuff
var users_array = [];
var concated_array;
var allClients = [];
io.on('connection', function(client) {

    console.log('a client has connected!');
    client.on('chat message', function(data){
      console.log("chat message received by server", data);
      io.emit('chat message', data);
    });

    client.on('meetingAttendance', function(data) {
      //users_array = users_array.concat(data.users);
      // users_array = _.uniqBy(users_array.concat(data.users), 'name');
      var socketID = client.id.substring(2,23);
      if (data.user) {
        var User = data.user;
        console.log('why is user undefined', User);
        User.socket_id = socketID;
        users_array.push(User);
        users_array = _.uniqBy(users_array, 'name');
        console.log('users_array', users_array);
        io.emit('online users', users_array);
      }
    });

      client.on('disconnect',function() {

        console.log('Got disconnect!');
        var client_ID = client.id.substring(2,23);


        // var new_array = _.remove(users_array, function(n) {
        //   if (typeof n.socketID != 'undefined'){
        //     console.log('client id', client.id);
        //     console.log('socket id', n.socketID);
        //     return n.socketID !== client_ID;
        //   } else {
        //     return false;
        //   }
        // });

        console.log('client id', client_ID);

        var disconnected_array=[];
        for (var i = 0; i < users_array.length; i++){
          if (users_array[i].socket_id != client_ID)
            disconnected_array.push(users_array[i]);
          }
        users_array = disconnected_array;
        console.log('d/c array', users_array);
        // var i = users_array.indexOf(client.id);
        // users_array = users_array.splice(i, 1);
        io.emit('online users', users_array);

    });

});

  // client.on('meetingAttendance', function(data) {
  //   var data = { user: JSON.parse(data.user)};
  //   io.emit('meetingAttendance', data)
  //
  //   // function containsObject(obj, list) {
  //   //   var i;
  //   //   for (i = 0; i < list.length; i++) {
  //   //     if (list[i] === obj) {
  //   //       return true;
  //   //     }
  //   //   }
  //   //   return false;
  //   // }
  //
  //   // if(!containsObject(data.user, online_users)){
  //   //   console.log("im sending out a new guy \n")
  //   //   console.log(data.user)
  //   //   online_users.push(data.user);
  //   // }
  //   // console.log("server's list of online users",online_users )
  //   // online_users.forEach(function(data){
  //   //data = JSON.stringify(data)
  //   //console.log("stringify before sending from server \n", typeof data)
  //   // console.log("inside foreach", data)
  //   // var data = { user: data};
  //   // io.emit('meetingAttendance', data)
  //   // console.log("a guy was sent out to the clients", data)
  //   // })
  //
  // })


//});



// error-handler settings
require('./config/error-handler')(app);
// Deployment tracking
require('cf-deployment-tracker-client').track();

var port = process.env.VCAP_APP_PORT || 3000;
server.listen(port);
console.log('listening at:', port);

module.exports = app;
