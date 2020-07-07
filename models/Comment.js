var mongoose = require('mongoose');
var User = require("./User");
var CommentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    media: [{ type: String }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    },
    timeCreated: {type: Date, default: Date.now()},
    likes: {Number, default:0},
    replies: [this],
    

});
mongoose.model('Comment', CommentSchema);

module.exports = mongoose.model('Comment');