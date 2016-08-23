var Meeting = require('../models/Meeting');
var Handlebars = require('Handlebars')

exports.create = function(req, res, next) {

  var meeting = new Meeting({
    name: req.body.meetingName
  });
  meeting.save(function(err) {
    if(err) console.log('error creating a meeting', err);
    res.redirect('/meeting');
  });
};

exports.getMeeting = function(req,res, next) {

  var meetingId = req.query.meeting;
  Meeting.findById(meetingId, function(err, meeting) {
    res.render("account/onemeeting", {meeting: meeting, helpers: {
      printMeeting: function(meeting){
        //print transcripts here
        console.log("im getting meeting here too in printMeeting", meeting)

        console.log("is this how you get user name?", meeting.attendees[0])

        return meeting;
      }

    }
    });
})
};

exports.getAllMeetings = function(req,res, next) {
  var user = req.user;
  Meeting.find({}, function(err, meetings) {
    res.render("account/meeting", {meetings: meetings, helpers: {
            printMeetings: function(meeting) {
              var html = '<ul class="list-group">';
              meeting.sort(function(a,b){return b.created_at-a.created_at })
              meeting.forEach(function(entry) {
//`+ "  "+ "entry.name" + " | " + `entry.created_at
                html += `<li>
                            <input id="joinMeet" type="button" onclick="jointMeeting('`+ user.id + "','"+ entry.id +`')" value="Join">
                            <input id="retrieveMeet" type="button" onclick="retrieveMeeting('`+ entry.id +`')" value="Transcript">
                            <div>`+ entry.name + ` | ` + entry.created_at + `</div>
                        </li>`
              });
              html += "</ul>";
              return html;
            }
      }});
  })
  .populate('attendees')
  .exec(function (err, meeting) {
    if (err) return handleError(err);
    // prints "The creator is Aaron"
  });

};

exports.join = function(req, res) {
  console.log(req.body);
  res.render('meetingbox');
};

exports.joinMeeting = function(req, res, next) {

  var updatedObj = req.params.id;
  var updateAttendee = req.body.attendee_id;

  Meeting.findOneAndUpdate(updatedObj,
    {$push: { "attendees": updateAttendee}},
    {new: true},
    function(err, doc) {
    console.log(doc)
    res.send(doc);
  });
};
