var { DataSource } = require('apollo-datasource')
var User = require("../models/User");
var Comment = require("../models/Comment");
var Idea = require("../models/Idea");
var Msg = require("../models/Message");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var configure = require('../config'); // get config file
var Utils = require("../models/Utils");





function randomint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function parseUser(userData) {
    var user = {
        fullname: userData.fullname,
        email: userData.email,
        username: userData.username,
        verified: userData.verified,
        ideas: userData.ideas,
        liked_ideas: userData.liked_ideas,
        comments: userData.comments,
    }
    return user;
}

async function sendMessage(msgData, id, callback) {
    var response = false;
    var recepOnline = false;
    var recepSocketId = null;
    try {
        user = await User.findOne({ username: msgData.to });
        if (!!user) {
            var message = await Msg.create({
                text: msgData.text,
                from: msgData.from,
                to: user._id,
                bid: `${msgData.from}${user._id}`

            });
            if (!!message) {
                response = true;
                //check if the reciever is online and deliever
                var util = await Utils.findOne({ server: configure.server });
                // console.log("user => here");
                if (!!util) {
                    // console.log("util =>", util);
                    var newauthed = util.authed.filter(c => c.id == user._id);
                    // console.log("newaythed =>", newauthed);

                    if (newauthed.length !== 0) {
                        recepOnline = true;
                        recepSocketId = newauthed[0].socket_id;
                    }
                }

            }
        }

    } catch (err) {
        console.log("error occurred", err.message);
        response = false;
    }
    callback(null, { sent: response, receiverId: id, recepOnline, recepSocketId, text: msgData.text });
}



class MsgApi extends DataSource {
    context = {};
    constructor() {
        super();

    }

    initialize(config) {
        this.context = config.context;
        this.userDetails = this.context.user;

    }
    async checkIdValidity(userDetails) {
        var out = false;
        var date = Date.now() / 1000;
        if (userDetails.auth && date < userDetails.exp) {
            try {
                var user = await User.findOne({ _id: userDetails.id });
                if (user != null) {
                    out = true
                }

            }
            catch (err) {
                console.log("err", err.message);

                out = false;
            }

        }
        return out

    }

    async getMsgbyUsername(username) {



        var msg, response;
        var tee = await this.checkIdValidity(this.userDetails)//this.userDetails.id
        console.log(tee);
        if (tee) {
            console.log("true entered");

            try {
                var user = await User.findOne({ username: username });
                if (!!user) {
                    var tag = [`${user._id}${this.userDetails.id}`, `${this.userDetails.id}${user._id}`];
                    msg = await Msg.find({ bid: { "$in": tag } });
                    // console.log("msg => ", msg);
                    response = {
                        status: "200",
                        messages: msg
                    }
                }
                else {
                    response = {
                        status: "404",
                        message: "user not found"
                    }
                }
            }
            catch (err) {
                console.log("error occurred", err);
                response = { status: "401", message: "Idea Not Created", error: err.message };

            }
        }
        else {
            response = { status: "401", message: "Unauthorized" };
        }
        // console.log(response);
        return response;


    }


}


module.exports = { MsgApi, sendMessage };
