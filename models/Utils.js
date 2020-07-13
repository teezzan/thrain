var mongoose = require('mongoose');
var UtilsSchema = new mongoose.Schema({
    server: String,
    authed: [{ socket_id: String, username: String, id: String }]
});
mongoose.model('Utils', UtilsSchema);

module.exports = mongoose.model('Utils');