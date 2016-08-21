var Meeting = require('../models/Meeting');
var Handlebars = require('Handlebars')

exports.create = function(req, res, next) {
  console.log(req.body.meetingName)
  var meeting = new Meeting({
    name: req.body.meetingName
  });
  meeting.save(function(err) {
    if(err) console.log('error creating a meeting', err);
    res.redirect('/meeting');
  });
};

exports.get = function(req,res, next) {
  console.log("the user might be here?", req.user.id)
  var user = req.user.id;
  console.log("the whole meeting model here!", Meeting)
  Meeting.find({}, function(err, meetings) {
    console.log("is the user still here", user)
    res.render("account/meeting", {user: user, meetings: meetings, helpers: {
            printMeetings: function(meeting) {
              var html = '<ul class="list-group">';
              meeting.sort(function(a,b){return b.created_at-a.created_at })
              meeting.forEach(function(entry) {
              //html += `<li><a href="/joinMeeting/` + entry.id + `">` +  entry.name + " | " + entry.created_at + "</a></li>";
                //html += `<li><button type="submit" formmethod="post" formaction="/joinMeeting/` + entry.id + `>` + entry.name + " | " + entry.created_at + `</button></li>`
                // html += `<li><form method="post" action="http://localhost:3000/joinMeeting/` +  entry.id +  `" class="inline">
                //         <input type="hidden" name="attendee_id" value=`+user+`>
                //         <button type="submit" name="submit_param" value="submit_value" class="link-button">`+  entry.id +  entry.name + " | " + entry.created_at + `</button></form></li>`
                html += `<li>
                            <input id="joinMeet" type="button" onclick="jointMeeting('`+ user + "','"+ entry.id +`')" value="Join">
                            <input id="retrieveMeet" type="button" onclick="retrieveMeeting(`+ entry.id +`)" value="Transcript">`+ "  "+ entry.name + " | " + entry.created_at + `</button>
                        </li>`
              });
              html += "</ul>";
              return html;
            }
      }});
  }
)
  .populate('attendees')
  .exec(function (err, meeting) {
    if (err) return handleError(err);
    // prints "The creator is Aaron"
  });

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
/**
 * POST /signup
 */
// exports.signupPost = function(req, res, next) {
//   req.assert('name', 'Name cannot be blank').notEmpty();
//   req.assert('email', 'Email is not valid').isEmail();
//   req.assert('email', 'Email cannot be blank').notEmpty();
//   req.assert('password', 'Password must be at least 4 characters long').len(4);
//   req.sanitize('email').normalizeEmail({ remove_dots: false });
//
//   var errors = req.validationErrors();
//
//   if (errors) {
//     req.flash('error', errors);
//     return res.redirect('/signup');
//   }
//
//   User.findOne({ email: req.body.email }, function(err, user) {
//     if (user) {
//       req.flash('error', { msg: 'The email address you have entered is already associated with another account.' });
//       return res.redirect('/signup');
//     }
//     user = new User({
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password
//     });
//     user.save(function(err) {
//       req.logIn(user, function(err) {
//         res.redirect('/testmeeting');
//       });
//     });
//   });
// };
//
//
//   User.findById(req.user.id, function(err, user) {
//     if ('password' in req.body) {
//       user.password = req.body.password;
//     } else {
//       user.email = req.body.email;
//       user.name = req.body.name;
//       user.gender = req.body.gender;
//       user.location = req.body.location;
//       user.website = req.body.website;
//     }
//     user.save(function(err) {
//       if ('password' in req.body) {
//         req.flash('success', { msg: 'Your password has been changed.' });
//       } else if (err && err.code === 11000) {
//         req.flash('error', { msg: 'The email address you have entered is already associated with another account.' });
//       } else {
//         req.flash('success', { msg: 'Your profile information has been updated.' });
//       }
//       res.redirect('/account');
//     });
//   });
// };
