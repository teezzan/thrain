var mongoose = require("mongoose");
var Utils = require("./models/Utils");
var configure = require('./config'); // get config file

mongoose.connect('mongodb+srv://adminlove:t%40ye1234@cluster0-sbitd.mongodb.net/test?retryWrites=true&w=majority', {
// mongoose.connect("mongodb://localhost:27017/thrsin",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    console.log("DB started");

    Utils.findOne({ server: configure.server }, (err, server) => {

      if (server == null) {
        Utils.create({ server: "1", authed: [] }, (err, util) => {
          console.log(err);

          // console.log("util", util);
        })
      }
      else {
        console.log("All done");
      }

    })

  }
);
