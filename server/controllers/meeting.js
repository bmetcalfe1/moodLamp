var Meeting = require('../models/Meeting');


exports.create = function(req, res, next) {
  console.log('req body', req.body);
  var meeting = new Meeting({
    name: req.body.name
  });
  meeting.save(function(err) {
    if(err) console.log('error creating a meeting', err);
    //res.send(meeting);
    res.render('account/meeting');
  });
}

exports.get = function(req,res, next) {
  Meeting.find({}, function(err, meetings) {
    // res.send(meetings);
    res.render('account/meeting');
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
    // res.send(meeting);
    res.render('account/conversation:id'); // i did this. might not works
  });
}
