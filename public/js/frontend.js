$(document).ready(function() {
  var socket = io();
  //add class to the body depending on the page.
  $('body').addClass(window.location.pathname.split('/')[1]);

  socket.on('chat message', function(msg) {
    console.log("msg", msg);
    var color = msg.feeling.color;
    console.log(color.split);
    str = (color.split(','));
    var nums = str.map(function (str){
      return parseInt(str)
    });
    console.log("msg", msg)
    var user;
    if(!msg.User) {
      user = {
        name:"Visitor",
        _id: 1234567890
      }
    }
    else {
      user = msg.User.user;
    }

    console.log("are we gonna make a div");
    console.log(user);
    if( $(`#${user._id}`).length<1) {
      console.log("looks like we need a div");
      $("#messages").append(`<div id="${user._id}"></div>`);
    }
    $(`#${user._id}`).replaceWith(`
      <div class="convbox" id="${user._id}">
        <div class="textboxuser">${user.name}</div>
        <div class="textbox">${msg.baseString}</div>
        <div class="feelingsboxes">
          <div class="anger" style="background-color:rgba(232,5,33,${msg.watsonResponse.anger});"><p>Anger</p></div>
          <div class="disgust" style="background-color:rgba(89,38,132,${msg.watsonResponse.disgust});"><p>Disgust</p></div>
          <div class="fear" style="background-color:rgba(50,94,43,${msg.watsonResponse.fear});"><p>Fear</p></div>
          <div class="joy" style="background-color:rgba(255,214,41,${msg.watsonResponse.joy});"><p>Joy</p></div>
          <div class="sadness" style="background-color:rgba(8,109,178,${msg.watsonResponse.sadness});"><p>Sadness</p></div>
        </div>
        </div>
    `);
    $(`#${user._id}`).css({
      "transition": "2s"
    });

    // $("#messages").text(`${user.name} said: ${msg.baseString}`);


  });


  // MEETING page
  //Get the current user and send it via websockets
  if ($('body').hasClass('meeting')) {
    $.get('/api/userdata', function(user) {
      console.log('user object', user.user);
      var currentUSER = user.user;
      // /gravatar?email=' + user.email, function(gravatar) {
      //   console.log('gravatrar', gravatar);
      // });

      $.ajax({
        url: '/gravatar',
        type: 'get',
        data: {email: currentUSER.email},
        success: function(response) {
          console.log('email?', response);
          currentUSER.gravatarURL = response.gravatarURL;
          socket.emit('meetingAttendance',{user: currentUSER});
          localStorage.setItem('user', JSON.stringify(currentUSER));
        }
      });

    }); // api.get user data

    socket.on('online users', function(data) {
      console.log('online user here', data);

      // iterate over data
      // compare it to online_users array
      // only push if it does not exist in the array.

      // online_users = _.uniqBy(online_users.concat(data), 'name');
      // console.log("client list of online users", online_users)
      // console.log("user to check for repeated", data.user)

      var newHTML = [];
      $.each(data, function(index, value) {

        newHTML.push(
          `<li>
            <img src=${value.gravatarURL} alt="" />
              <div class="name">
                ` + value.name + `
              </div>
          </li>`
        );
      });

      $(".list").html(newHTML.join(""));



    }); // socket

  }; // if in meeting page

});
