var mongoose = require('mongoose');
// var Idea = require("./Idea");
// var Comment = require("./Comment");


function randomint(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
var UserSchema = new mongoose.Schema({
  fullname: { type: String, default:""},
  email: { type: String, unique: true },
  username: { type: String, unique: true, default: `HM${randomint(1, 1000)}${randomint(1, 1000)}` },
  password: String,
  verified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: { type: Date, default: Date.now() },
  ideas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
  }],
  liked_ideas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
  }],
  comments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
}]
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');