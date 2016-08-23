var socket = io();

//add class to the body depending on the page.
$('body').addClass(window.location.pathname.split('/')[1]);
$.get('/api/userdata', function(user) {
  localStorage.setItem('user', JSON.stringify(user));
});



socket.on('chat message', function(msg){
  console.log("msg", msg);
  var color = msg.feeling.color;
  console.log(color.split);
  str = (color.split(','));
  var nums = str.map(function (str){
    return parseInt(str)
  });

  $("#messages").text(`${msg.User.user.name} said: ${msg.baseString}`);
  $("#messages").css({
    "background-color": `rgb(${nums[0]},${nums[1]},${nums[2]})`,
    "transition": "2s"
  });

});

if ($('body').hasClass('meeting')) {
  socket.emit('meetingAttendance', {
    user: localStorage.getItem('user')
  });

  socket.on('online users', function(data) {
    console.log('online users here', data);

  });

}
