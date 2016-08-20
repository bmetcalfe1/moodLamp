var Meeting = require('../models/Meeting');


exports.create = function(req, res, next) {
  console.log('req body', req.body);
  var meeting = new Meeting({
    name: req.body.name
  });
  meeting.save(function(err) {
    if(err) console.log('error creating a meeting', err);
    res.render("account/meeting", {meetings: meeting });
  });
}

exports.get = function(req,res, next) {
  Meeting.find({}, function(err, meetings) {
    res.send(meetings);
  })
  .populate('attendees')
  .exec(function (err, meeting) {
    if (err) return handleError(err);
    console.log('The creator is %s', meeting.attendees);
    // prints "The creator is Aaron"
  });
}

exports.joinMeeting = function(req, res, next) {
  var updatedObj = req.body;
  console.log('req.body', req.body);
  Meeting.findOneAndUpdate(req.params.id,
    {$push: { "attendees": req.body.attendee_id}},
    {safe: true, new: true}, function(err, meeting) {
    res.send(meeting);
  });
}

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
