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
    var user = msg.User.user;
    console.log("are we gonna make a div");
    console.log(user);
    if( $(`#${user._id}`).length<1) {
      console.log("looks like we need a div");
      $("#messages").append(`<div id="${user._id}"></div>`);
    }
    $(`#${user._id}`).replaceWith(`
      <div id="${user._id}">
        <div class="textboxuser">${user.name}</div>
        <div class="textbox">${msg.baseString}</div>
        <div class="feelingsboxes">
          <div class="anger" style="opacity:${msg.watsonResponse.anger};"></div>
          <div class="disgust" style="opacity:${msg.watsonResponse.disgust};"></div>
          <div class="fear" style="opacity:${msg.watsonResponse.fear};"></div>
          <div class="joy" style="opacity:${msg.watsonResponse.joy};"></div>
          <div class="sadness" style="opacity:${msg.watsonResponse.sadness};"></div>
        </div>
        </div>
    `);

    // $("#messages").text(`${user.name} said: ${msg.baseString}`);
    // $("#messages").css({
    //   "background-color": `rgb(${nums[0]},${nums[1]},${nums[2]})`,
    //   "opacity":`${msg.feeling.score}`,
    //   "transition": "2s"
    // });

  });


  // MEETING page
  //Get the current user and send it via websockets
  if ($('body').hasClass('meeting')) {
    $.get('/api/userdata', function(user) {
      //var user = JSON.stringify(user.user);
      // online_users.push(user.user);
      socket.emit('meetingAttendance',{user: user.user});
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
            <img src="http://placehold.it/350x350" alt="" />
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
