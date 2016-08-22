var request = require('request');
var watson = require('watson-developer-cloud');


// setup the watson api stuff



//setup the particle board
var particle_endpoint = `https://api.particle.io/v1/devices/${process.env.PARTICLE_DEVICE_ID}/makeRainbow?access_token=${process.env.PARTICLE_TOKEN}`;

//set parameters for watson. text key can take a string or URL.



//execute this function with the parameters variable to send the request to watson,
//and change the color of the light.
exports.lightItUp = function (req, res) {
  console.log('req', req.body);
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
  function displayColor(obj) {
    //console.log("display",obj);
    console.log("You feel",obj.tone_name);
    req.body.feeling = obj;
    //sockets.emit('chat message', req);
    //takes in tone name and score, returns color + intensity
    console.log("new req", req.body);
    switch (obj.tone_name) {

          case 'anger':
            var colorintesity = '';
            colorintesity += ("r=" + (232*obj.score) + ",g=" + (5*obj.score) + ",b=" + (33*obj.score))
            // 'r': 232,
            // 'g': 5,
            // 'b'= 33
            console.log(colorintesity)
            return colorintesity;
              break;

          case 'disgust':
          //console.log("in disgust");
          // 'r': 89,
          // 'g': 38,
          // 'b': 132
          var colorintesity = '';
          colorintesity += ("r=" + (89*obj.score) + ",g=" + (38*obj.score) + ",b=" + (132*obj.score))
          console.log(colorintesity)
          return colorintesity;
              break;

          case 'fear':
          // 'r': 50,
          // 'g': 94,
          // 'b': 43
          var colorintesity = '';
          colorintesity += ("r=" + (50*obj.score) + ",g=" + (94*obj.score) + ",b=" + (43*obj.score))
          console.log(colorintesity)
          return colorintesity;
              break;

          case 'joy':
          // 'r': 255,
          // 'g': 214,
          // 'b': 41
          var colorintesity = '';
          colorintesity += ("r=" + (255*obj.score) + ",g=" + (214*obj.score) + ",b=" + (41*obj.score))
          console.log(colorintesity)
          return colorintesity;
              break;

          case 'sadness':
          // 'r': 8,
          // 'g': 109,
          // 'b': 178
          var colorintesity = '';
          colorintesity += ("r=" + (8*obj.score) + ",g=" + (109*obj.score) + ",b=" + (178*obj.score))
          //console.log(colorintesity)
          return colorintesity;
              break;

      }
  }
  alchemy_language.emotion(parameters, function (err, response) {
  if (err) {
    console.log('error:', err);
  }
  else {
    watsonResponse = response.docEmotions;
    console.log('watson responded', watsonResponse);

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
    var particle_endpoint = `https://api.particle.io/v1/devices/${process.env.PARTICLE_DEVICE_ID}/makeRainbow?access_token=${process.env.PARTICLE_TOKEN}`;
    var options = {
      method: 'POST',
      url: particle_endpoint,
      qs: {access_token: process.env.PARTICLE_TOKEN},
      header: {
        'content-type': 'multipart/form-data;'
      },
      formData: {
        args: color
      }
    };

    request(options, function(error, response, body) {
      if(error) throw new Error(error);
      console.log('body from particle', body);
      res.send(req);
    });

  }
});
};

exports.getEmoColor = function (req, res) {
  console.log('req', req.body);
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
  function displayColor(obj) {
    //console.log("display",obj);
    console.log("You feel",obj.tone_name);
    req.body.feeling = obj;
    //sockets.emit('chat message', req);
    //takes in tone name and score, returns color + intensity
    console.log("new req", req.body);
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

  alchemy_language.emotion(parameters, function (err, response) {
  if (err) {
    console.log('error:', err);
  }
  else {
    watsonResponse = response.docEmotions;
    console.log('watson responded', watsonResponse);

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
    return color;


  }
});
};


//this.lightItUp("hello, i love you");
