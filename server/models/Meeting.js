var mongoose = require('mongoose');

var meetingSchema = new mongoose.Schema({
  name: String,
  created_at: {type: Date, default: Date.now()},
  ended_at: Date,
  attendees: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  transcripts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Dialogue'}]
});

var Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
