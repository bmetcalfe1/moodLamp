$(document).ready(function() {
  var socket = io();
  //add class to the body depending on the page.
  $('body').addClass(window.location.pathname.split('/')[1]);

  socket.on('chat message', function(obj) {
    console.log("obj", obj);
    $('#messages').text(obj.User.username.name + obj.baseString);
  });


  // MEETING page

  //Get the current user and send it via websockets
  var online_users = [];

  if ($('body').hasClass('meeting')) {

    $.get('/api/userdata', function(user) {
      console.log("what does get see in user" , user.user)
      //var user = JSON.stringify(user.user);
      socket.emit('meetingAttendance',
      {
         user: JSON.stringify(user.user)
      }
    );
    console.log("after sending out to server" , user)

      socket.on('meetingAttendance', function(data) {
        console.log('online user here', data);

        function containsObject(obj, list) {
          var i;
          for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
              return true;
            }
          }
          return false;
        }
        console.log("client list of online users", online_users)


        if(!containsObject(data, online_users)){
          online_users.push(data)
        }

        var newHTML = [];
        $.each(online_users, function(index, value) {
          console.log("what is value made of", typeof value)
          console.log("what is value", value)
          //var user = JSON.parse(value);
          //console.log("what is value made of value after jsonparse", typeof user)
          newHTML.push(
            `<li>
              <img src="http://placehold.it/350x350" alt="" />
                <div class="name">
                  ` + value.user.name + `
                </div>
            </li>`
          );
        });

        $(".list").html(newHTML.join(""));


      });



    });
  };

});
