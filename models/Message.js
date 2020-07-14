var mongoose = require('mongoose');
var User = require("./User");
var MsgSchema = new mongoose.Schema({
    text: { type: String, required: true },
    media: [{ type: String }],
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    timeCreated: { type: Date, default: Date.now() }

});
mongoose.model('Msg', MsgSchema);

module.exports = mongoose.model('Msg');