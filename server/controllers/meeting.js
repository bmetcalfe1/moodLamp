var Meeting = require('../models/Meeting');
var Handlebars = require('Handlebars');
var _ = require('lodash');

exports.create = function(req, res, next) {
  var meeting = new Meeting({
    name: req.body.meetingName
  });
  meeting.save(function(err) {
    if(err) console.log('error creating a meeting', err);
    res.redirect('/meetings');
  });
};

exports.getAllMeetings = function(req,res, next) {
  var user = req.user;
  Meeting.find({}, function(err, meetings) {
      meetings = _.orderBy(meetings, ['created_at'],['desc']);
      console.log("meetings are pull from here", meetings)
      res.render('account/meeting', {meetings: meetings});
  })
  .populate('attendees')
  .exec(function (err, meeting) {
    if (err) return handleError(err);
    // prints "The creator is Aaron"
  });
};

exports.show = function(req, res) {
  var meetingID = req.params.id;
  Meeting.findById(meetingID, function(err, doc) {
    // console.log("what's up doc!", doc);
    res.render('account/onemeeting', {meeting: doc});
  });
};


exports.update = function(req,res) {
  var meetingID = req.params.id;
  Meeting.findById(meetingID, function(err, doc) {
    if(err) {console.log('error', err)};
    console.log("backend update function!", doc);
  });
}
