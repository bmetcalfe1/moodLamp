var mongoose = require('mongoose');

var dialogueSchema = new mongoose.Schema({
  user: String,
  message: String,
  created_at: {type: Date, default: Date.now()},
  meetings: [{type: mongoose.Schema.Types.ObjectId, ref: 'Meeting'}],
});

var Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
