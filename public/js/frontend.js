
  //add class to the body depending on the page.
  $('body').addClass(window.location.pathname.split('/')[1]);
  $.get('/api/userdata', function(user) {
    localStorage.setItem('user', JSON.stringify(user));
  });



  var socket = io();
  socket.on('chat message', function(obj){
      console.log("obj", obj);
      $('#messages').text(obj.User.username.name + obj.baseString);
    });
    if($('body').hasClass('meeting')) {
      socket.emit('meetingAttendance', {user: localStorage.getItem('user')} );

      socket.on('online users', function(data) {
        console.log('online users here', data);

      });

    }
