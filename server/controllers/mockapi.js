var request = require('request');
var watson = require('watson-developer-cloud');
var debounce = require('throttle-debounce/debounce');

// setup the watson api stuff



//setup the particle board
var particle_endpoint = `https://api.particle.io/v1/devices/${process.env.PARTICLE_DEVICE_ID}/makeRainbow?access_token=${process.env.PARTICLE_TOKEN}`;

//set parameters for watson. text key can take a string or URL.



//execute this function with the parameters variable to send the request to watson,
//and change the color of the light.

//this function will get emotion, and light up the particle board
exports.lightItUp = function (req, res) {

  //console.log('req', req.body);
  var str = req.body.baseString;
  var alchemy_language = watson.alchemy_language({
    api_key: process.env.WATSON_API_KEY
  });
  var displayTones;
  var watsonResponse;
  var parameters = {
    text: str
  };
  console.log("parsed string", str);
  var payload = req.body;
  function displayColor(obj) {
    //console.log("display",obj);
    console.log("You feel",obj.tone_name);
    //sockets.emit('chat message', req);
    //takes in tone name and score, returns color + intensity
    console.log("payload", payload);
    switch (obj.tone_name) {

          case 'anger':
            var colorintesity = '';
            colorintesity += ("r=" + (232*obj.score) + ",g=" + (5*obj.score) + ",b=" + (33*obj.score))
            // 'r': 232,
            // 'g': 5,
            // 'b'= 33
            console.log("lampcolor", colorintesity)
            return colorintesity;
              break;

          case 'disgust':
          //console.log("in disgust");
          // 'r': 89,
          // 'g': 38,
          // 'b': 132
          var colorintesity = '';
          colorintesity += ("r=" + (89*obj.score) + ",g=" + (38*obj.score) + ",b=" + (132*obj.score))
          console.log("lampcolor", colorintesity)
          return colorintesity;
              break;

          case 'fear':
          // 'r': 50,
          // 'g': 94,
          // 'b': 43
          var colorintesity = '';
          colorintesity += ("r=" + (50*obj.score) + ",g=" + (94*obj.score) + ",b=" + (43*obj.score))
          console.log("lampcolor", colorintesity)
          return colorintesity;
              break;

          case 'joy':
          // 'r': 255,
          // 'g': 214,
          // 'b': 41
          var colorintesity = '';
          colorintesity += ("r=" + (255*obj.score) + ",g=" + (214*obj.score) + ",b=" + (41*obj.score))
          console.log("lampcolor", colorintesity)
          return colorintesity;
              break;

          case 'sadness':
          // 'r': 8,
          // 'g': 109,
          // 'b': 178
          var colorintesity = '';
          colorintesity += ("r=" + (8*obj.score) + ",g=" + (109*obj.score) + ",b=" + (178*obj.score))
          console.log("lampcolor", colorintesity)
          return colorintesity;
              break;

      }
  }
  alchemy_language.emotion(parameters, function (err, response) {
  if (err) {
    console.log('error:', err);
  }
  else {
    console.log(response);
    watsonResponse = response.docEmotions;
    //console.log('watson responded', watsonResponse);

    var result = Object.keys(watsonResponse).reduce(function (prev, curr) {
        //console.log('curr', watsonResponse[curr]);
        if (watsonResponse[curr] > watsonResponse[prev]) {
            return curr;
        }
        else {
          return prev;
        }
    });

    var resultObj = {
      tone_name: result,
      score: parseFloat(watsonResponse[result])
    };

    payload.color = displayColor(resultObj);
    var particle_endpoint = `https://api.particle.io/v1/devices/${process.env.PARTICLE_DEVICE_ID}/makeRainbow?access_token=${process.env.PARTICLE_TOKEN}`;
    var options = {
      method: 'POST',
      url: particle_endpoint,
      qs: {access_token: process.env.PARTICLE_TOKEN},
      header: {
        'content-type': 'multipart/form-data;'
      },
      formData: {
        args: payload.color
      }
    };

    request(options, function(error, response, body) {
      if(error) {
        throw new Error(error);
      }
      else {
        console.log('body from particle', body);
        res.status(200);
      }
    });

  }
});
};


//this function return a feels and rgb color based on string
exports.getEmoColor = function (req, res) {

  console.log('req', req.query);
  var str = req.query.baseString;
  var alchemy_language = watson.alchemy_language({
    api_key: process.env.WATSON_API_KEY
  });
  var displayTones;
  var watsonResponse;
  var parameters = {
    text: str
  };
  var payload = req.query;
  console.log("parsed string", str);
  function displayColor(obj) {
    //console.log("display",obj);
    console.log("You feel",obj.tone_name);
    req.query.feeling = obj;
    //sockets.emit('chat message', req);
    //takes in tone name and score, returns color + intensity
    console.log("new req", req.query);
    switch (obj.tone_name) {

          case 'anger':
            var emoColor = {
            emotion: obj.tone_name,
            color: "232,5,33",
            score: obj.score
          };
            console.log(emoColor)
            return emoColor;
              break;

          case 'disgust':
          var emoColor = {
            emotion: obj.tone_name,
            color: "89,38,132",
            score: obj.score
          };
          console.log(emoColor)
          return emoColor;
              break;

          case 'fear':
          var emoColor = {
            emotion: obj.tone_name,
            color: "50,94,43",
            score: obj.score
          };
          console.log(emoColor)
          return emoColor;
              break;

          case 'joy':
            var emoColor = {
            emotion: obj.tone_name,
            color: "255,214,41",
            score: obj.score
          };
          console.log(emoColor)
          return emoColor;
              break;

          case 'sadness':
            var emoColor = {
            emotion: obj.tone_name,
            color: "8,109,178",
            score: obj.score
          };
          console.log(emoColor)
          return emoColor;
              break;

      }
  }
  var watsonResponse;
  alchemy_language.emotion(parameters, function (err, response) {
  if (err) {
    console.log('error:', err);
  }
  else {
    watsonResponse = response.docEmotions;
    //console.log('watson responded', watsonResponse);

    var result = Object.keys(watsonResponse).reduce(function (prev, curr) {
        //console.log('curr', watsonResponse[curr]);
        if (watsonResponse[curr] > watsonResponse[prev]) {
            return curr;
        }
        else {
          return prev;
        }
    });

    var resultObj = {
      tone_name: result,
      score: parseFloat(watsonResponse[result])
    };


    var color = displayColor(resultObj);
    console.log("color", color);
    payload.feeling = color;
    payload.watsonResponse = watsonResponse
    console.log("payload ready", payload);
    res.send(payload);


  }
});
};


//this.lightItUp("hello, i love you");
