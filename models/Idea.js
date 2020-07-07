var mongoose = require('mongoose');
var User = require("./User");
var Comment = require("./Comment");
function randomint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var IdeaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    media: [{ type: String }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    },
    timeCreated: {type: Date, default: Date.now()},
    tags: [],
    likes: {Number, default:0},
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: Comment,
    }]

});
mongoose.model('Idea', IdeaSchema);

module.exports = mongoose.model('Idea');